import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Tooltip from "./Tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: { text: "경비를 등록해 볼까요?" },
  decorators: [
    (Story) => (
      <div className="flex justify-end p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: { text: "여기를 눌러 여행을 추가하세요" },
};
