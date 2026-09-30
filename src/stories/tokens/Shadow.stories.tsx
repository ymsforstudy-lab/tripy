import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionBlock, TokenMeta, tokenDocParameters } from "./TokenDoc";
import { tokensOf, type Section } from "./tokens";

function ShadowGrid({ section, drop }: { section: Section; drop?: boolean }) {
  return (
    <SectionBlock section={section}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-pad-8 bg-gray-5 p-pad-8">
        {section.tokens.map((token) => (
          <div key={token.name} className="flex flex-col gap-gap-5">
            <div
              className="h-20 rounded-12 bg-gray-white"
              style={
                drop
                  ? { filter: `drop-shadow(${token.value})` }
                  : { boxShadow: token.value }
              }
            />
            <TokenMeta token={token} />
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

const meta = {
  title: "Foundations/Shadow",
  parameters: tokenDocParameters(
    "반복 사용되던 그림자를 프리셋으로 만든 것. 요소 박스에는 `shadow-*`, 투명 이미지 윤곽에는 `drop-shadow-*`를 쓴다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BoxShadow: Story = {
  render: () => <ShadowGrid section={tokensOf("--shadow-", "Box Shadow")} />,
};

export const DropShadow: Story = {
  render: () => (
    <ShadowGrid section={tokensOf("--drop-shadow-", "Drop Shadow")} drop />
  ),
};
