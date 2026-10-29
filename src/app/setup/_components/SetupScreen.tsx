"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import type { TripInput } from "@/lib/data/types";
import TripSetupForm from "./TripSetupForm";
import TripConfirmSheet from "./TripConfirmSheet";
import InfoBanner from "./InfoBanner";
import { isTripFormComplete, toTripInput, type TripFormValue } from "../_lib/tripForm";

export type SetupMode = "create" | "edit";

interface SetupScreenProps {
  mode: SetupMode;
  initialForm: TripFormValue;
  /** 저장하고 이동까지 한다. 실패하면 시트에 보여줄 문구를 돌려준다 */
  onSave: (input: TripInput) => Promise<string | null>;
}

// 04·05 여행 정보 입력 + 06 확인 바텀시트. 입력값은 이 화면 상태로만 들고 있고 `확인`에서만 저장한다.
export default function SetupScreen({ mode, initialForm, onSave }: SetupScreenProps) {
  const router = useRouter();
  const [form, setForm] = useState<TripFormValue>(initialForm);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // setState 반영 전에 두 번 눌려도 한 번만 저장되게 한다
  const submittingRef = useRef(false);

  const complete = isTripFormComplete(form);

  const handleConfirm = async () => {
    const input = toTripInput(form);
    if (submittingRef.current || !input) return;
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage(null);

    const error = await onSave(input);
    // 성공하면 onSave가 이동시키므로 버튼은 계속 잠가 둔다
    if (error) {
      setErrorMessage(error);
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="flex min-h-screen-safe flex-col bg-surface-default pb-28">
      <Header onBack={() => router.back()} />

      <h1 className="mt-4 px-4 py-1 text-title-xl font-semibold text-text-strong">
        {mode === "create" ? "떠날 여행을" : "여행 정보를"}
        <br />
        {mode === "create" ? "등록해주세요" : "수정해주세요"}
      </h1>

      <div className="mt-12">
        <TripSetupForm value={form} onChange={setForm} />
      </div>

      <InfoBanner text="여행 일정은 나중에도 변경할 수 있어요!" className="mx-4 mt-auto" />

      <BottomCTA
        label="다음"
        disabled={!complete}
        onClick={() => {
          setErrorMessage(null);
          setSheetOpen(true);
        }}
      />

      <TripConfirmSheet
        open={sheetOpen}
        value={form}
        onEdit={() => setSheetOpen(false)}
        onConfirm={handleConfirm}
        submitting={submitting}
        errorMessage={errorMessage}
      />
    </div>
  );
}
