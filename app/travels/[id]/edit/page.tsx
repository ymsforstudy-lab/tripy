"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import Input from "@/components/ui/Input";
import SelectChip from "@/components/ui/SelectChip";
import { COUNTRIES } from "@/lib/constants/countries";

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#8E8E8E" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function EditCountryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = COUNTRIES.filter((c) => c.name.includes(search));
  const noResults = search.length > 0 && filtered.length === 0;

  const handleSelect = (name: string) => {
    setSelected(name);
    setSearch("");
  };

  const handleNext = () => {
    if (!selected) return;
    if (selected === "대한민국") {
      router.push(`/travels/${id}/edit/region`);
    } else {
      // TODO: 날짜 수정 페이지 연결 시 변경
      router.push("/travels");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header onBack={() => router.back()} />

      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          여행지를<br />수정해주세요
        </h1>
      </div>

      <div className="mt-6 px-4">
        <Input
          icon={SearchIcon}
          value={search}
          placeholder="국가를 입력해주세요"
          onChange={setSearch}
        />

        {selected && (
          <div className="mt-3 flex flex-wrap gap-2">
            <SelectChip
              label={selected}
              variant="tag"
              onRemove={() => setSelected(null)}
            />
          </div>
        )}
      </div>

      <div className="mt-4 h-2 border-t border-gray-30 bg-gray-10" />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {noResults && (
          <button
            onClick={() => handleSelect(search)}
            className="flex items-center gap-2 rounded-xl border border-dashed border-gray-30 px-6 py-4 text-sm text-gray-60"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="#717171" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>
              <span className="font-medium text-gray-90">'{search}'</span> 직접 입력하기
            </span>
          </button>
        )}

        {filtered.map((country) => (
          <SelectChip
            key={country.name}
            label={`${country.emoji} ${country.name}`}
            variant={selected === country.name ? "selected" : "default"}
            onClick={() => handleSelect(country.name)}
          />
        ))}
      </div>

      <BottomCTA label="다음" onClick={handleNext} disabled={!selected} />
    </div>
  );
}
