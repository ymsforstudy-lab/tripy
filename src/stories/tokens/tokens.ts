/// <reference types="vite/client" />
import tokensCss from "../../app/tokens.css?raw";

// tokens.css(Figma 자동 생성)를 그대로 파싱한다.
// 토큰 목록을 스토리에 복사해 두지 않으므로, tokens.css가 바뀌면 문서도 자동으로 따라간다.

export type Token = {
  name: string; // --color-green-50
  value: string; // #6BC20F
  note?: string; // 줄 끝 주석 (Figma 변수명 등)
  lineHeight?: string; // --text-* 의 --line-height 짝
};

export type Section = { title: string; tokens: Token[] };

function parseTokens(css: string): Section[] {
  const sections: Section[] = [];
  let current: Section | undefined;

  for (const raw of css.split("\n")) {
    const line = raw.trim();

    const heading = line.match(/^\/\*\s*──\s*(.+?)\s*──\s*\*\/$/);
    if (heading) {
      current = { title: heading[1].replace(/\s*\(.*\)$/, ""), tokens: [] };
      sections.push(current);
      continue;
    }

    const decl = line.match(/^(--[\w-]+):\s*(.+?);\s*(?:\/\*\s*(.+?)\s*\*\/)?$/);
    if (!decl || !current) continue;
    const [, name, value, note] = decl;

    // --text-body-m--line-height 는 별도 토큰이 아니라 --text-body-m 에 붙인다.
    const lh = name.match(/^(--text-[\w-]+?)--line-height$/);
    if (lh) {
      const owner = current.tokens.find((t) => t.name === lh[1]);
      if (owner) owner.lineHeight = value;
      continue;
    }

    current.tokens.push({ name, value, note });
  }

  return sections.filter((s) => s.tokens.length > 0);
}

const SECTIONS = parseTokens(tokensCss);

/** 이름이 prefix로 시작하는 토큰만 모아 한 섹션으로 돌려준다. */
export function tokensOf(prefix: string, title: string): Section {
  return {
    title,
    tokens: SECTIONS.flatMap((s) => s.tokens).filter((t) =>
      t.name.startsWith(prefix),
    ),
  };
}

/** tokens.css의 `── 제목 ──` 주석으로 묶인 색상 섹션들. */
export function colorSections(): Section[] {
  return SECTIONS.map((s) => ({
    ...s,
    tokens: s.tokens.filter((t) => t.name.startsWith("--color-")),
  })).filter((s) => s.tokens.length > 0);
}

// 토큰 이름 → 컴포넌트에서 쓰는 Tailwind 클래스
export function utilityOf(name: string): string {
  const rules: [RegExp, (m: string) => string][] = [
    [/^--color-(.+)$/, (m) => `bg-${m}`],
    [/^--text-(.+)$/, (m) => `text-${m}`],
    [/^--font-weight-(.+)$/, (m) => `font-${m}`],
    [/^--font-(.+)$/, (m) => `font-${m}`],
    [/^--leading-(.+)$/, (m) => `leading-${m}`],
    [/^--radius-(.+)$/, (m) => `rounded-${m}`],
    [/^--spacing-(.+)$/, (m) => `p-${m} · gap-${m}`],
    [/^--drop-shadow-(.+)$/, (m) => `drop-shadow-${m}`],
    [/^--shadow-(.+)$/, (m) => `shadow-${m}`],
  ];
  for (const [re, fmt] of rules) {
    const m = name.match(re);
    if (m) return fmt(m[1]);
  }
  return name;
}
