"use client";

import { useEffect, useState } from "react";
import type { ExchangeRates } from "@/lib/exchange-rates";

const CACHE_KEY = "tripy_exchange_rates";
const CACHE_TTL = 60 * 60 * 1000; // 1시간

interface CachedRates {
  rates: ExchangeRates;
  timestamp: number;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorage 캐시 확인
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedRates = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          setRates(parsed.rates);
          setLoading(false);
          return;
        }
      }
    } catch {
      // sessionStorage 사용 불가 시 무시
    }

    fetch("/api/exchange-rates")
      .then((res) => res.json())
      .then((data) => {
        setRates(data.rates);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ rates: data.rates, timestamp: Date.now() })
          );
        } catch {
          // sessionStorage 저장 실패 무시
        }
      })
      .catch(() => {
        // fetch 실패 시 rates는 null 유지 → 기존 방식으로 합산
      })
      .finally(() => setLoading(false));
  }, []);

  return { rates, loading };
}
