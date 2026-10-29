"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { TripRepository } from "@/lib/data/repository";
import { createSupabaseRepository } from "@/lib/data/supabase-repo";

/**
 * 현재 사용자에 맞는 여행·지출 저장소.
 * 인증 로딩 중이면 null이다. 게스트(localStorage) 구현이 들어오기 전까지는 비로그인도 null이다.
 */
export function useRepository(): TripRepository | null {
  const { user, loading } = useAuth();
  const userId = user?.id;

  return useMemo(() => {
    if (loading || !userId) return null;
    return createSupabaseRepository(userId);
  }, [loading, userId]);
}
