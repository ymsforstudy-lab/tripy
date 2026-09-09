import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatusBadge from "./StatusBadge";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  argTypes: {
    variant: { control: "inline-radio", options: ["good", "danger"] },
  },
  args: { variant: "good" },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 예산 내에서 사용 중 */
export const Good: Story = {};

/** 예산 초과 */
export const Danger: Story = {
  args: { variant: "danger" },
};

/** label을 넘기면 기본 문구를 대체한다. */
export const CustomLabel: Story = {
  args: { variant: "danger", label: "초과" },
};
