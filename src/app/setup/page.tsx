"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { useRepository } from "@/hooks/useRepository";
import { RepositoryError } from "@/lib/data/repository";
import TripSetupForm from "./_components/TripSetupForm";
import TripConfirmSheet from "./_components/TripConfirmSheet";
import InfoBanner from "./_components/InfoBanner";
import { EMPTY_TRIP_FORM, isTripFormComplete, toTripInput, type TripFormValue } from "./_lib/tripForm";

// 2.0 04·05 여행 정보 입력 + 06 확인 바텀시트. 입력값은 이 화면 상태로만 들고 있고 `확인`에서만 저장한다.
export default function SetupPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const { refresh } = useTrip();
  const repo = useRepository();
  const [form, setForm] = useState<TripFormValue>(EMPTY_TRIP_FORM);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // setState 반영 전에 두 번 눌려도 한 번만 저장되게 한다
  const submittingRef = useRef(false);

  const complete = isTripFormComplete(form);

  const handleConfirm = async () => {
    const input = toTripInput(form);
    if (submittingRef.current || !input) return;
    if (!repo) {
      // 게스트(localStorage) 저장소가 들어오기 전까지는 비로그인도 null이다
      setErrorMessage(
        authLoading ? "로그인 상태를 확인하고 있어요. 잠시 후 다시 눌러주세요." : "로그인한 뒤에 여행을 저장할 수 있어요.",
      );
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await repo.createTrip(input);
    } catch (e) {
      console.error("여행 생성 실패:", e);
      setErrorMessage(
        e instanceof RepositoryError ? `${e.message} 잠시 후 다시 시도해주세요.` : "여행을 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
      setSubmitting(false);
      submittingRef.current = false;
      return;
    }
    await refresh();
    router.replace("/home");
  };

  return (
    <div className="flex min-h-screen-safe flex-col bg-surface-default pb-28">
      <Header onBack={() => router.back()} />

      <h1 className="mt-4 px-4 py-1 text-title-xl font-semibold text-text-strong">
        떠날 여행을
        <br />
        등록해주세요
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
