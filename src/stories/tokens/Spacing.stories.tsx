import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionBlock, TokenMeta, tokenDocParameters } from "./TokenDoc";
import { tokensOf } from "./tokens";

function SpacingList() {
  const section = tokensOf("--spacing-", "Spacing");
  return (
    <SectionBlock section={section}>
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
  );
}

const meta = {
  title: "Foundations/Spacing",
  parameters: tokenDocParameters(
    "Figma padding/gap 변수. 요소 사이 간격은 `gap-*`, 안쪽 여백은 `p-*`로 쓴다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = { render: () => <SpacingList /> };
