import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionBlock, TokenMeta, tokenDocParameters } from "./TokenDoc";
import { tokensOf, type Section } from "./tokens";

const SAMPLE = "트리피와 함께하는 여행 가계부 1,234,500원";

function SampleList({
  section,
  styleOf,
}: {
  section: Section;
  styleOf: (value: string, lineHeight?: string) => React.CSSProperties;
}) {
  return (
    <SectionBlock section={section}>
      <div className="flex flex-col divide-y divide-gray-10">
        {section.tokens.map((token) => (
          <div key={token.name} className="flex flex-col gap-gap-3 py-pad-6">
            <span
              className="text-gray-90"
              style={styleOf(token.value, token.lineHeight)}
            >
              {SAMPLE}
            </span>
            <TokenMeta token={token} />
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function MetaList({ section }: { section: Section }) {
  return (
    <SectionBlock section={section}>
      <div className="flex flex-col gap-gap-3">
        {section.tokens.map((token) => (
          <TokenMeta key={token.name} token={token} />
        ))}
      </div>
    </SectionBlock>
  );
}

const meta = {
  title: "Foundations/Typography",
  parameters: tokenDocParameters(
    "Pretendard 기반 타이포그래피. 크기는 `text-*`, 굵기는 `font-*` 클래스를 조합한다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FontSize: Story = {
  render: () => (
    <SampleList
      section={tokensOf("--text-", "Font Size")}
      styleOf={(fontSize, lineHeight) => ({ fontSize, lineHeight })}
    />
  ),
};

export const FontWeight: Story = {
  render: () => (
    <SampleList
      section={tokensOf("--font-weight-", "Font Weight")}
      styleOf={(fontWeight) => ({ fontWeight })}
    />
  ),
};

export const FontFamily: Story = {
  render: () => <MetaList section={tokensOf("--font-pretendard", "Font Family")} />,
};

export const LineHeight: Story = {
  render: () => <MetaList section={tokensOf("--leading-", "Line Height")} />,
};
