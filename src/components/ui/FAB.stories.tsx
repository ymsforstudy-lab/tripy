import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FAB from "./FAB";

const meta = {
  title: "UI/FAB",
  component: FAB,
  parameters: {
    // 화면에 fixed로 붙는 컴포넌트라 프레임 없이 렌더링한다.
    mobileFrame: false,
  },
  args: { href: "/expense" },
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 첫 방문 시 힌트 말풍선을 함께 노출한다. */
export const WithTooltip: Story = {
  args: { tooltipText: "경비를 등록해 볼까요?" },
};
