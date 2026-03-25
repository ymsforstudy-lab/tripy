export const COUNTRIES = [
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

export function getCountryEmoji(name: string): string {
  return COUNTRIES.find((c) => c.name === name)?.emoji ?? "🌍";
}
