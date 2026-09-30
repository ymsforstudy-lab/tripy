import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionBlock, TokenMeta, tokenDocParameters } from "./TokenDoc";
import { tokensOf } from "./tokens";

function RadiusGrid() {
  const section = tokensOf("--radius-", "Border Radius");
  return (
    <SectionBlock section={section}>
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
  );
}

const meta = {
  title: "Foundations/Radius",
  parameters: tokenDocParameters("Figma R* 변수 기반 모서리 둥글기."),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = { render: () => <RadiusGrid /> };
