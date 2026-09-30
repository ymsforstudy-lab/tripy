/// <reference types="vite/client" />
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import tokensCss from "../app/tokens.css?raw";

// tokens.css(Figma 자동 생성)를 그대로 파싱해 보여준다.
// 토큰 목록을 여기에 복사해 두지 않으므로, tokens.css가 바뀌면 이 문서도 자동으로 따라간다.

type Token = {
  name: string; // --color-green-50
  value: string; // #6BC20F
  note?: string; // 줄 끝 주석 (Figma 변수명 등)
  lineHeight?: string; // --text-* 의 --line-height 짝
};

type Section = { title: string; tokens: Token[] };

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

const byPrefix = (prefix: string) =>
  SECTIONS.map((s) => ({
    ...s,
    tokens: s.tokens.filter((t) => t.name.startsWith(prefix)),
  })).filter((s) => s.tokens.length > 0);

// 토큰 이름 → 실제로 쓰는 Tailwind 클래스
function utilityOf(name: string): string {
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

function TokenMeta({ token }: { token: Token }) {
  return (
    <div className="flex min-w-0 flex-col">
      <code className="text-body-s font-semibold text-gray-90">
        {utilityOf(token.name)}
      </code>
      <span className="text-caption-s text-gray-50">
        {token.name}: {token.value}
        {token.lineHeight && ` / line-height ${token.lineHeight}`}
      </span>
      {token.note && (
        <span className="text-caption-s text-gray-60">{token.note}</span>
      )}
    </div>
  );
}

function SectionBlock({
  section,
  children,
}: {
  section: Section;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-pad-8">
      <h2 className="mb-gap-3 text-title-m font-bold text-gray-90">
        {section.title}
        <span className="ml-gap-3 text-body-s font-normal text-gray-50">
          {section.tokens.length}개
        </span>
      </h2>
      {children}
    </section>
  );
}

function ColorTokens() {
  return (
    <>
      {byPrefix("--color-").map((section) => (
        <SectionBlock key={section.title} section={section}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-gap-5">
            {section.tokens.map((token) => (
              <div key={token.name} className="flex flex-col gap-gap-3">
                <div
                  className="h-16 rounded-12 border border-gray-20"
                  style={{ background: token.value }}
                />
                <TokenMeta token={token} />
              </div>
            ))}
          </div>
        </SectionBlock>
      ))}
    </>
  );
}

const SAMPLE = "트리피와 함께하는 여행 가계부 1,234,500원";

function TypographyTokens() {
  const family = byPrefix("--font-pretendard");
  const sizes = byPrefix("--text-");
  const weights = byPrefix("--font-weight-");
  const leading = byPrefix("--leading-");

  return (
    <>
      {[...sizes, ...weights].map((section) => (
        <SectionBlock key={section.title} section={section}>
          <div className="flex flex-col divide-y divide-gray-10">
            {section.tokens.map((token) => {
              const isSize = token.name.startsWith("--text-");
              return (
                <div
                  key={token.name}
                  className="flex flex-col gap-gap-3 py-pad-6"
                >
                  <span
                    className="text-gray-90"
                    style={
                      isSize
                        ? { fontSize: token.value, lineHeight: token.lineHeight }
                        : { fontWeight: token.value }
                    }
                  >
                    {SAMPLE}
                  </span>
                  <TokenMeta token={token} />
                </div>
              );
            })}
          </div>
        </SectionBlock>
      ))}
      {[...family, ...leading].map((section) => (
        <SectionBlock key={section.title} section={section}>
          <div className="flex flex-col gap-gap-3">
            {section.tokens.map((token) => (
              <TokenMeta key={token.name} token={token} />
            ))}
          </div>
        </SectionBlock>
      ))}
    </>
  );
}

function RadiusTokens() {
  return (
    <>
      {byPrefix("--radius-").map((section) => (
        <SectionBlock key={section.title} section={section}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-gap-5">
            {section.tokens.map((token) => (
              <div key={token.name} className="flex flex-col gap-gap-3">
                <div
                  className="h-20 w-20 border-2 border-green-50 bg-green-0"
                  style={{ borderRadius: token.value }}
                />
                <TokenMeta token={token} />
              </div>
            ))}
          </div>
        </SectionBlock>
      ))}
    </>
  );
}

function SpacingTokens() {
  return (
    <>
      {byPrefix("--spacing-").map((section) => (
        <SectionBlock key={section.title} section={section}>
          <div className="flex flex-col gap-gap-5">
            {section.tokens.map((token) => (
              <div key={token.name} className="flex items-center gap-gap-5">
                <div className="w-24 shrink-0">
                  <div
                    className="h-6 rounded-8 bg-green-40"
                    style={{ width: token.value }}
                  />
                </div>
                <TokenMeta token={token} />
              </div>
            ))}
          </div>
        </SectionBlock>
      ))}
    </>
  );
}

function ShadowTokens() {
  const sections = [...byPrefix("--shadow-"), ...byPrefix("--drop-shadow-")];
  // 같은 섹션이 두 번 잡히지 않도록 합친다.
  const merged = sections.reduce<Section[]>((acc, s) => {
    const found = acc.find((a) => a.title === s.title);
    if (found) found.tokens.push(...s.tokens);
    else acc.push({ ...s, tokens: [...s.tokens] });
    return acc;
  }, []);

  return (
    <>
      {merged.map((section) => (
        <SectionBlock key={section.title} section={section}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-pad-8 bg-gray-5 p-pad-8">
            {section.tokens.map((token) => {
              const isDrop = token.name.startsWith("--drop-shadow-");
              return (
                <div key={token.name} className="flex flex-col gap-gap-5">
                  <div
                    className="h-20 rounded-12 bg-gray-white"
                    style={
                      isDrop
                        ? { filter: `drop-shadow(${token.value})` }
                        : { boxShadow: token.value }
                    }
                  />
                  <TokenMeta token={token} />
                </div>
              );
            })}
          </div>
        </SectionBlock>
      ))}
    </>
  );
}

const meta = {
  title: "Foundations/Design Tokens",
  parameters: {
    layout: "padded",
    mobileFrame: false,
    docs: {
      description: {
        component:
          "`src/app/tokens.css`(Figma Variables 자동 생성)를 그대로 읽어 보여준다. 토큰을 추가·변경하면 이 문서도 자동으로 갱신된다. 각 항목의 굵은 글씨가 컴포넌트에서 쓰는 Tailwind 클래스다. 색상은 `bg-` 대신 `text-`·`border-` 접두사로도 쓸 수 있다.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = { render: () => <ColorTokens /> };
export const Typography: Story = { render: () => <TypographyTokens /> };
export const Radius: Story = { render: () => <RadiusTokens /> };
export const Spacing: Story = { render: () => <SpacingTokens /> };
export const Shadow: Story = { render: () => <ShadowTokens /> };
