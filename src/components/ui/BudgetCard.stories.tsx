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
    tripName: "대한민국 여행",
    tripDateStr: "2025.03.26 ~ 2025.03.30",
    nightsLabel: "3박 4일",
    todaySpent: 130000,
    remaining: 670000,
    totalBudget: 800000,
    progressRatio: 0.17,
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
  args: { todaySpent: 0, remaining: 800000, progressRatio: 0 },
};

/** 예산을 절반 쓴 상태 */
export const Half: Story = {
  args: { todaySpent: 50000, remaining: 400000, totalBudget: 800000, progressRatio: 0.5 },
};

/** 예산 초과 — 남은 금액 "예산 초과" 텍스트·danger 색상 확인 */
export const OverBudget: Story = {
  args: {
    todaySpent: 50000,
    remaining: -50000,
    totalBudget: 800000,
    progressRatio: 1.06,
  },
};

/** 예산 미등록 — 입력 유도 문구 표시 */
export const NoBudget: Story = {
  args: { totalBudget: 0, remaining: 0, progressRatio: 0, todaySpent: 0 },
};

/** 해외 통화 표기 */
export const ForeignCurrency: Story = {
  args: {
    tripName: "일본 여행",
    tripDateStr: "2025.04.01 ~ 2025.04.05",
    nightsLabel: "4박 5일",
    todaySpent: 8400,
    remaining: 6600,
    totalBudget: 15000,
    progressRatio: 0.56,
    currency: "JPY",
  },
};
