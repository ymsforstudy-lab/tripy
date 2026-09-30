import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import css from "./primitive-color.css?raw";
import { ColorGrid, tokenDocParameters } from "./TokenDoc";
import { sectionOf } from "./parseTokens";

const meta = {
  title: "Foundations/Primitive Color",
  parameters: tokenDocParameters(
    "primitive-color.css",
    "브랜드 그린과 그레이스케일 원시 팔레트. 메인 버튼 컬러는 `green-50`이다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  render: () => <ColorGrid section={sectionOf(css, "Primary Green")} />,
};

export const Grayscale: Story = {
  render: () => <ColorGrid section={sectionOf(css, "Grayscale")} />,
};
