import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import css from "./gradient.css?raw";
import primitiveCss from "./primitive-color.css?raw";
import semanticCss from "./semantic-color.css?raw";
import { ColorGrid, tokenDocParameters } from "./TokenDoc";
import { sectionOf, varResolver } from "./parseTokens";

const resolve = varResolver(primitiveCss, semanticCss, css);

const meta = {
  title: "Foundations/Gradient",
  parameters: tokenDocParameters(
    "gradient.css",
    "Figma 그라디언트 색상 스타일. `background: var(--gradient-*)` 또는 `bg-(image:--gradient-*)`로 쓴다. 아래 회색 글씨는 Figma 스타일 이름이다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gradient: Story = {
  render: () => <ColorGrid section={sectionOf(css, "Gradient")} resolve={resolve} />,
};
