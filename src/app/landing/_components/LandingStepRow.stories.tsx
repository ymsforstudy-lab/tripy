import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LandingStepRow from "./LandingStepRow";

const meta = {
  title: "Landing/LandingStepRow",
  component: LandingStepRow,
  args: {
    step: "01",
    title: "여행 등록",
    description: "여행지·기간·예산을 한 화면에서 입력하세요. 국내외 어디든 등록할 수 있어요.",
  },
  decorators: [
    (Story) => (
      <div className="w-87.5 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingStepRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
