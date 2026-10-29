import { COUNTRIES } from "@/lib/constants/countries";

// 여행지 입력의 국가 추천. 여행지는 자유 입력이고, 목록에 있는 이름이면 항목을 띄운다.
// 한글은 자모 단위로 비교해 조합 중인 글자("읿" → 일본, "댐" → 대만)와 초성("ㅇㅂ")도 찾는다.

const SYLLABLE_START = 0xac00;
const SYLLABLE_END = 0xd7a3;

const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const JUNGSEONG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
// 겹받침은 낱자로 나눈다. 입력 중 "일"+"ㅂ"이 "읿"이 되기 때문이다
const JONGSEONG = ["", "ㄱ", "ㄲ", "ㄱㅅ", "ㄴ", "ㄴㅈ", "ㄴㅎ", "ㄷ", "ㄹ", "ㄹㄱ", "ㄹㅁ", "ㄹㅂ", "ㄹㅅ", "ㄹㅌ", "ㄹㅍ", "ㄹㅎ", "ㅁ", "ㅂ", "ㅂㅅ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
// 낱자로 입력된 겹받침·겹모음도 같은 형태로 맞춘다
const COMPOUND_JAMO: Record<string, string> = {
  ㄳ: "ㄱㅅ", ㄵ: "ㄴㅈ", ㄶ: "ㄴㅎ", ㄺ: "ㄹㄱ", ㄻ: "ㄹㅁ", ㄼ: "ㄹㅂ", ㄽ: "ㄹㅅ", ㄾ: "ㄹㅌ", ㄿ: "ㄹㅍ", ㅀ: "ㄹㅎ", ㅄ: "ㅂㅅ",
};

function decompose(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= SYLLABLE_START && code <= SYLLABLE_END) {
      const offset = code - SYLLABLE_START;
      out += CHOSEONG[Math.floor(offset / 588)] + JUNGSEONG[Math.floor((offset % 588) / 28)] + JONGSEONG[offset % 28];
    } else {
      out += COMPOUND_JAMO[ch] ?? ch.toLowerCase();
    }
  }
  return out;
}

function choseong(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    out += code >= SYLLABLE_START && code <= SYLLABLE_END ? CHOSEONG[Math.floor((code - SYLLABLE_START) / 588)] : ch;
  }
  return out;
}

const isAllChoseong = (text: string) => [...text].every((ch) => CHOSEONG.includes(ch));

const INDEX = COUNTRIES.map((country) => ({
  country,
  jamo: decompose(country.name.replace(/\s/g, "")),
  initials: choseong(country.name.replace(/\s/g, "")),
}));

/** 입력과 맞는 국가 목록. 정확히 같은 이름도 포함하고, 이름이 입력으로 시작하는 국가를 먼저 보여준다 */
export function searchCountries(query: string): (typeof COUNTRIES)[number][] {
  const q = query.replace(/\s/g, "");
  if (!q) return [];

  const byInitials = isAllChoseong(q);
  const qJamo = decompose(q);
  return INDEX.map(({ country, jamo, initials }) => {
    const target = byInitials ? initials : jamo;
    const key = byInitials ? q : qJamo;
    return { country, position: target.indexOf(key) };
  })
    .filter((m) => m.position >= 0)
    .sort((a, b) => (a.position === 0 ? 0 : 1) - (b.position === 0 ? 0 : 1))
    .map((m) => m.country);
}
