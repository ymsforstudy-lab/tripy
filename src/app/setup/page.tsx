"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { useRepository } from "@/hooks/useRepository";
import { RepositoryError } from "@/lib/data/repository";
import type { Trip } from "@/lib/data/types";
import SetupScreen from "./_components/SetupScreen";
import { EMPTY_TRIP_FORM, fromTrip } from "./_lib/tripForm";

// /setup            새 여행 등록 (createTrip)
// /setup?tripId=…   여행 정보 수정 (updateTrip). 진입점은 docs/flow-v2.md §7 결정 후 연결한다
//   &from=/travels/… 저장 후 돌아갈 경로. 없으면 /home
export default function SetupPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SetupRoute />
    </Suspense>
  );
}

function SetupRoute() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const from = searchParams.get("from");
  // 외부 주소로 보내지 않도록 앱 안 경로만 받는다
  const returnTo = from?.startsWith("/") && !from.startsWith("//") ? from : "/home";

  return tripId ? <EditTrip tripId={tripId} returnTo={returnTo} /> : <CreateTrip />;
}

function saveErrorMessage(e: unknown) {
  console.error("여행 저장 실패:", e);
  return e instanceof RepositoryError
    ? `${e.message} 잠시 후 다시 시도해주세요.`
    : "여행을 저장하지 못했어요. 잠시 후 다시 시도해주세요.";
}

function CreateTrip() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const { refresh } = useTrip();
  const repo = useRepository();

  return (
    <SetupScreen
      mode="create"
      initialForm={EMPTY_TRIP_FORM}
      onSave={async (input) => {
        // 게스트(localStorage) 저장소가 들어오기 전까지는 비로그인도 null이다
        if (!repo) {
          return authLoading
            ? "로그인 상태를 확인하고 있어요. 잠시 후 다시 눌러주세요."
            : "로그인한 뒤에 여행을 저장할 수 있어요.";
        }
        try {
          await repo.createTrip(input);
        } catch (e) {
          return saveErrorMessage(e);
        }
        await refresh();
        router.replace("/home");
        return null;
      }}
    />
  );
}

function EditTrip({ tripId, returnTo }: { tripId: string; returnTo: string }) {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const { refresh } = useTrip();
  const repo = useRepository();
  const [loaded, setLoaded] = useState<{ id: string; trip: Trip | null; error?: boolean } | null>(null);

  useEffect(() => {
    if (!repo) return;
    let cancelled = false;
    repo
      .getTrip(tripId)
      .then((trip) => {
        if (!cancelled) setLoaded({ id: tripId, trip });
      })
      .catch((e) => {
        console.error("여행 불러오기 실패:", e);
        if (!cancelled) setLoaded({ id: tripId, trip: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [repo, tripId]);

  if (!authLoading && !repo) return <Notice text="로그인한 뒤에 여행 정보를 수정할 수 있어요." />;
  // 다른 tripId로 바뀐 직후에는 이전 여행을 보여주지 않는다
  if (!loaded || loaded.id !== tripId) return <LoadingScreen />;
  if (loaded.error) return <Notice text="여행 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요." />;
  if (!loaded.trip) return <Notice text="여행을 찾을 수 없어요." />;

  return (
    <SetupScreen
      // 여행이 바뀌면 폼 상태를 새로 만든다
      key={loaded.trip.id}
      mode="edit"
      initialForm={fromTrip(loaded.trip)}
      onSave={async (input) => {
        if (!repo) return "로그인 상태를 확인하고 있어요. 잠시 후 다시 눌러주세요.";
        try {
          // 수정 모드는 insert하지 않는다
          await repo.updateTrip(tripId, input);
        } catch (e) {
          return saveErrorMessage(e);
        }
        await refresh();
        router.replace(returnTo);
        return null;
      }}
    />
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen-safe items-center justify-center bg-surface-default px-4">
      <p className="text-center text-body-m text-text-muted">{text}</p>
    </div>
  );
}
