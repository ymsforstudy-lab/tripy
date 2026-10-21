import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import css from "./semantic-role-color.css?raw";
import primitiveCss from "./primitive-color.css?raw";
import semanticCss from "./semantic-color.css?raw";
import { ColorGrid, tokenDocParameters } from "./TokenDoc";
import { sectionOf, varResolver } from "./parseTokens";

const resolve = varResolver(primitiveCss, semanticCss, css);

const meta = {
  title: "Foundations/Semantic Role Color",
  parameters: tokenDocParameters(
    "semantic-role-color.css",
    "Figma Semantic 변수와 1:1로 대응하는 역할 색상. 원색을 직접 쓰지 말고 용도에 맞는 역할 토큰을 쓴다. 값은 원색 토큰 참조이며, 아래 회색 글씨는 Figma 변수명 · 참조 원색이다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const group = (title: string): Story => ({
  render: () => <ColorGrid section={sectionOf(css, title)} resolve={resolve} />,
});

export const Background = group("Background");
export const Surface = group("Surface");
export const Text = group("Text");
export const Icon = group("Icon");
export const Border = group("Border");
export const Action = group("Action");
export const Status = group("Status");
export const Overlay = group("Overlay");
export const Brand = group("Brand");
