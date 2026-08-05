"use client";

import { useState } from "react";
import ExchangeDropdown from "@/components/ui/ExchangeDropdown";
import SelectChip from "@/components/ui/SelectChip";
import { type Currency } from "@/lib/constants/currency";

const SAMPLE_COUNTRIES = ["🇯🇵 일본", "🇺🇸 미국", "🇫🇷 프랑스", "🇹🇭 태국", "🇩🇪 독일"];

export default function DropdownPreviewPage() {
  const [currency, setCurrency] = useState<Currency>("KRW");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-5 p-8 flex flex-col gap-10">
      <h1 className="text-xl font-bold text-gray-90">드롭다운 호버 미리보기</h1>

      {/* ExchangeDropdown */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-gray-60">ExchangeDropdown (호버 시 bg-gray-5)</h2>
        <div className="rounded-2xl bg-gray-5 p-5">
          <ExchangeDropdown value={currency} onChange={setCurrency} />
        </div>
      </section>

      {/* SelectChip - default / selected */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-gray-60">SelectChip — default: hover:bg-gray-5 / selected: hover:bg-green-10</h2>
        <div className="flex flex-col gap-3">
          {SAMPLE_COUNTRIES.map((country) => (
            <SelectChip
              key={country}
              label={country}
              variant={selected === country ? "selected" : "default"}
              onClick={() => setSelected(selected === country ? null : country)}
            />
          ))}
        </div>
      </section>

      {/* SelectChip - tag */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-gray-60">SelectChip — tag (호버 불필요)</h2>
        {selected && (
          <SelectChip
            label={selected}
            variant="tag"
            onRemove={() => setSelected(null)}
          />
        )}
        {!selected && (
          <span className="text-sm text-gray-50">위에서 항목 선택 시 태그 표시</span>
        )}
      </section>
    </div>
  );
}
