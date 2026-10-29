"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { TripRepository } from "@/lib/data/repository";
import { createSupabaseRepository } from "@/lib/data/supabase-repo";
import { localRepository } from "@/lib/data/local-repo";

/**
 * 현재 사용자에 맞는 여행·지출 저장소.
 * - 로그인(1.x 익명 세션 포함): Supabase
 * - 비로그인 게스트: 이 기기의 localStorage
 * 인증 로딩 중에는 null이다.
 */
export function useRepository(): TripRepository | null {
  const { user, loading } = useAuth();
  const userId = user?.id;

  return useMemo(() => {
    if (loading) return null;
    return userId ? createSupabaseRepository(userId) : localRepository;
  }, [loading, userId]);
}
