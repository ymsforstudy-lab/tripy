import type { Parameters } from "@storybook/nextjs-vite";
import { utilityOf, type Section, type Token } from "./tokens";

/** 토큰 문서 스토리 공통 parameters */
export function tokenDocParameters(description: string): Parameters {
  return {
    layout: "padded",
    mobileFrame: false,
    docs: {
      description: {
        component: `${description}\n\n\`src/app/tokens.css\`(Figma Variables 자동 생성)를 그대로 읽어 보여준다. 토큰을 추가·변경하면 이 문서도 자동으로 갱신된다. 굵은 글씨가 컴포넌트에서 쓰는 Tailwind 클래스다.`,
      },
    },
  };
}

export function TokenMeta({ token }: { token: Token }) {
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

export function SectionBlock({
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

export function ColorGrid({ section }: { section: Section }) {
  return (
    <SectionBlock section={section}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-gap-5">
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
  );
}
