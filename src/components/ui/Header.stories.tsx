import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from "./Header";

const meta = {
  title: "UI/Header",
  component: Header,
  argTypes: {
    onBack: { action: "back" },
    onClose: { action: "close" },
  },
  args: { title: "여행 설정" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 뒤로가기 + 가운데 정렬된 타이틀 */
export const WithTitle: Story = {};

/** 타이틀 없이 뒤로가기만 */
export const BackOnly: Story = {
  args: { title: undefined },
};

/** 뒤로가기 + 타이틀 + 닫기 */
export const WithClose: Story = {
  args: { title: "지출 등록", onClose: () => {} },
};
