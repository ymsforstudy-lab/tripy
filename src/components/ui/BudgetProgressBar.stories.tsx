import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BudgetProgressBar from "./BudgetProgressBar";

const meta = {
  title: "UI/BudgetProgressBar",
  component: BudgetProgressBar,
  argTypes: {
    ratio: { control: { type: "range", min: 0, max: 1.5, step: 0.05 } },
  },
  args: { ratio: 0.45 },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BudgetProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { ratio: 0 },
};

export const Half: Story = {
  args: { ratio: 0.5 },
};

export const Full: Story = {
  args: { ratio: 1 },
};

/** 예산 초과 시 danger 색상으로 바뀌고 100%에서 멈춘다. */
export const Over: Story = {
  args: { ratio: 1.4 },
};

export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[0, 0.25, 0.5, 0.75, 1, 1.3].map((r) => (
        <div key={r} className="flex flex-col gap-1">
          <span className="text-xs text-gray-60">{Math.round(r * 100)}%</span>
          <BudgetProgressBar ratio={r} />
        </div>
      ))}
    </div>
  ),
};
