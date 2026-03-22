"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomCTA from "@/components/ui/BottomCTA";
import Input from "@/components/ui/Input";
import SelectChip from "@/components/ui/SelectChip";

const COUNTRIES = [
  // 국내
  { emoji: "🇰🇷", name: "대한민국" },
  // 동아시아
  { emoji: "🇯🇵", name: "일본" },
  { emoji: "🇨🇳", name: "중국" },
  { emoji: "🇹🇼", name: "대만" },
  { emoji: "🇭🇰", name: "홍콩" },
  { emoji: "🇲🇴", name: "마카오" },
  // 동남아
  { emoji: "🇹🇭", name: "태국" },
  { emoji: "🇻🇳", name: "베트남" },
  { emoji: "🇵🇭", name: "필리핀" },
  { emoji: "🇸🇬", name: "싱가포르" },
  { emoji: "🇲🇾", name: "말레이시아" },
  { emoji: "🇮🇩", name: "인도네시아" },
  { emoji: "🇰🇭", name: "캄보디아" },
  { emoji: "🇱🇦", name: "라오스" },
  { emoji: "🇲🇲", name: "미얀마" },
  // 남아시아 / 중동
  { emoji: "🇮🇳", name: "인도" },
  { emoji: "🇦🇪", name: "UAE" },
  { emoji: "🇹🇷", name: "튀르키예" },
  { emoji: "🇮🇱", name: "이스라엘" },
  // 유럽
  { emoji: "🇬🇧", name: "영국" },
  { emoji: "🇫🇷", name: "프랑스" },
  { emoji: "🇩🇪", name: "독일" },
  { emoji: "🇮🇹", name: "이탈리아" },
  { emoji: "🇪🇸", name: "스페인" },
  { emoji: "🇨🇭", name: "스위스" },
  { emoji: "🇦🇹", name: "오스트리아" },
  { emoji: "🇳🇱", name: "네덜란드" },
  { emoji: "🇵🇹", name: "포르투갈" },
  // 아메리카 / 오세아니아
  { emoji: "🇺🇸", name: "미국" },
  { emoji: "🇨🇦", name: "캐나다" },
  { emoji: "🇦🇺", name: "호주" },
  { emoji: "🇳🇿", name: "뉴질랜드" },
];

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="#8E8E8E" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#8E8E8E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function CountryPage() {
  const router = useRouter();
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
    router.push(selected === "대한민국" ? "/setup/region" : "/setup/date");
  };

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
        {/* 검색 결과 없을 때 직접 입력 옵션 */}
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
