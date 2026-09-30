import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import BottomCTA from "./BottomCTA";

const meta = {
  title: "UI/BottomCTA",
  component: BottomCTA,
  parameters: {
    // 화면 하단에 fixed로 붙는 컴포넌트라 프레임 없이 렌더링한다.
    mobileFrame: false,
  },
  args: {
    label: "다음",
    disabled: false,
    onClick: fn(),
    onSecondaryClick: fn(),
  },
} satisfies Meta<typeof BottomCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

/** 보조 텍스트 버튼이 함께 있는 경우 */
export const WithSecondary: Story = {
  args: { label: "예산 설정하기", secondaryLabel: "나중에 할게요" },
};
