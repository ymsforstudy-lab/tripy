"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import Input from "@/components/ui/Input";
import SelectChip from "@/components/ui/SelectChip";

const REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "강원특별자치도",
  "제주특별자치도",
];

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#8E8E8E" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function RegionPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = REGIONS.filter((r) => r.includes(search));

  return (
    <div className="flex h-screen flex-col bg-gray-white">
      <Header onBack={() => router.back()} />

      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold leading-[1.5] tracking-[-0.48px] text-gray-90">
          떠날 여행지를<br />등록해주세요
        </h1>
      </div>

      <div className="mt-6 px-4">
        <Input
          icon={SearchIcon}
          value={search}
          placeholder="지역을 입력해주세요"
          onChange={setSearch}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <SelectChip
            label="대한민국"
            variant="tag"
            onRemove={() => router.back()}
          />
          {selected && (
            <SelectChip
              label={selected}
              variant="tag"
              onRemove={() => setSelected(null)}
            />
          )}
        </div>
      </div>

      <div className="mt-4 h-2 border-t border-gray-30 bg-gray-10" />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {filtered.map((region) => (
          <SelectChip
            key={region}
            label={region}
            variant={selected === region ? "selected" : "default"}
            onClick={() => setSelected(region)}
          />
        ))}
      </div>

      <BottomCTA
        label="다음"
        onClick={() => router.push("/setup/date")}
        disabled={!selected}
      />
    </div>
  );
}
