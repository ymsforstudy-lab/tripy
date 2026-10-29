"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useRepository } from "@/hooks/useRepository";
import type { TripRepository } from "@/lib/data/repository";
import type { Trip } from "@/lib/data/types";
import { pickHomeTrip } from "@/lib/data/home-trip";
import { todayLocal } from "@/lib/data/dates";

type TripState = {
  /** 홈에 보여줄 여행 (진행 중 > 가장 가까운 예정). 없으면 null */
  trip: Trip | null;
  /** 사용자의 전체 여행 (출발일 내림차순) */
  trips: Trip[];
  /** 인증 또는 여행 목록을 불러오는 중. true인 동안에는 "여행 없음"으로 판단하지 않는다 */
  loading: boolean;
  error: string | null;
  /** 여행 목록을 다시 불러온다. 생성·수정·삭제 후 호출 */
  refresh: () => Promise<void>;
};

const TripContext = createContext<TripState>({
  trip: null,
  trips: [],
  loading: true,
  error: null,
  refresh: async () => {},
});

/** 어떤 저장소에서 불러온 결과인지 함께 보관해 사용자가 바뀌면 이전 결과를 쓰지 않는다 */
type FetchResult = {
  repo: TripRepository;
  trips: Trip[];
  error: string | null;
};

async function loadTrips(repo: TripRepository): Promise<FetchResult> {
  try {
    return { repo, trips: await repo.listTrips(), error: null };
  } catch {
    return { repo, trips: [], error: "여행 정보를 불러오지 못했습니다." };
  }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading } = useAuth();
  const repo = useRepository();
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    if (!repo) return;
    let cancelled = false;
    loadTrips(repo).then((next) => {
      if (!cancelled) setResult(next);
    });
    return () => {
      cancelled = true;
    };
  }, [repo]);

  const refresh = useCallback(async () => {
    if (!repo) return;
    setResult(await loadTrips(repo));
  }, [repo]);

  // 게스트 저장소가 들어오기 전까지 비로그인은 repo가 null → 여행 없음으로 본다
  const current = repo && result?.repo === repo ? result : null;
  const loading = authLoading || (repo !== null && current === null);
  const trips = current?.trips ?? [];
  const trip = loading ? null : pickHomeTrip(trips, todayLocal());

  return (
    <TripContext.Provider value={{ trip, trips, loading, error: current?.error ?? null, refresh }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
