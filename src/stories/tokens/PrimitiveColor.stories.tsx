import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorGrid, tokenDocParameters } from "./TokenDoc";
import { colorSections } from "./tokens";

// tokens.css의 색상 섹션 중 Semantic을 뺀 나머지가 원시(primitive) 팔레트다.
const primitive = colorSections().filter((s) => s.title !== "Semantic");
const section = (title: string) => primitive.find((s) => s.title === title)!;

const meta = {
  title: "Foundations/Primitive Color",
  parameters: tokenDocParameters(
    "브랜드 그린과 그레이스케일 원시 팔레트. 메인 버튼 컬러는 `green-50`이다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  render: () => <ColorGrid section={section("Primary Green")} />,
};

export const Grayscale: Story = {
  render: () => <ColorGrid section={section("Grayscale")} />,
};
