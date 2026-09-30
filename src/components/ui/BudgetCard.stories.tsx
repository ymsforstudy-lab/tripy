import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BudgetCard from "./BudgetCard";
import { CURRENCIES } from "@/lib/constants/currency";

const meta = {
  title: "UI/BudgetCard",
  component: BudgetCard,
  argTypes: {
    currency: { control: "select", options: CURRENCIES },
  },
  args: {
    totalSpent: 45000,
    totalBudget: 100000,
    progressRatio: 0.45,
    currency: "KRW",
  },
  decorators: [
    (Story) => (
      <div className="bg-green-0 py-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BudgetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 아직 지출이 없는 상태 */
export const NoSpending: Story = {
  args: { totalSpent: 0, progressRatio: 0 },
};

/** 예산을 다 쓴 상태 */
export const Full: Story = {
  args: { totalSpent: 100000, progressRatio: 1 },
};

/** 예산 초과 — danger 배지와 게이지 색상 확인 */
export const OverBudget: Story = {
  args: { totalSpent: 138000, progressRatio: 1.38 },
};

/** 해외 통화 표기 */
export const ForeignCurrency: Story = {
  args: {
    totalSpent: 8400,
    totalBudget: 15000,
    progressRatio: 0.56,
    currency: "JPY",
  },
};
