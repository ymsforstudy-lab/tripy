import { NextResponse } from "next/server";
import { FALLBACK_RATES } from "@/lib/exchange-rates";

const SUPPORTED_CURRENCIES = ["USD", "KRW", "JPY", "EUR"];

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({
        base: "USD",
        rates: FALLBACK_RATES,
        fallback: true,
      });
    }

    const data = await res.json();

    const rates: Record<string, number> = {};
    for (const code of SUPPORTED_CURRENCIES) {
      if (data.rates[code]) {
        rates[code] = data.rates[code];
      }
    }

    return NextResponse.json({
      base: "USD",
      rates,
      fallback: false,
    });
  } catch {
    return NextResponse.json({
      base: "USD",
      rates: FALLBACK_RATES,
      fallback: true,
    });
  }
}
