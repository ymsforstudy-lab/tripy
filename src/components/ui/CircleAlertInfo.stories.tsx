import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CircleAlertInfo from "./CircleAlertInfo";

const meta = {
  title: "UI/CircleAlertInfo",
  component: CircleAlertInfo,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CircleAlertInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 삭제 확인 모달 등에서 쓰는 경고 아이콘 (props 없음) */
export const Default: Story = {};
