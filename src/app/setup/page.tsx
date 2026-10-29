"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import { useTrip } from "@/contexts/TripContext";
import TripSetupForm from "./_components/TripSetupForm";
import TripConfirmSheet from "./_components/TripConfirmSheet";
import InfoBanner from "./_components/InfoBanner";
import { EMPTY_TRIP_FORM, isTripFormComplete, type TripFormValue } from "./_lib/tripForm";
import { saveTrip } from "./_lib/saveTrip";

// 2.0 04·05 여행 정보 입력 + 06 확인 바텀시트. 입력값은 이 화면 상태로만 들고 있고 `확인`에서만 저장한다.
export default function SetupPage() {
  const router = useRouter();
  const { refresh } = useTrip();
  const [form, setForm] = useState<TripFormValue>(EMPTY_TRIP_FORM);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // setState 반영 전에 두 번 눌려도 한 번만 저장되게 한다
  const submittingRef = useRef(false);

  const complete = isTripFormComplete(form);

  const handleConfirm = async () => {
    if (submittingRef.current || !complete) return;
    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage(null);

    const result = await saveTrip(form);
    if (!result.ok) {
      setErrorMessage(result.message);
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
