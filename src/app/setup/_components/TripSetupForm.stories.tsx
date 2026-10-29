import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import TripSetupForm from "./TripSetupForm";
import { EMPTY_TRIP_FORM, type TripFormValue } from "../_lib/tripForm";

const COMPLETE: TripFormValue = {
  destination: "대한민국",
  departure: { year: 2026, month: 3, day: 1 },
  arrival: { year: 2026, month: 3, day: 5 },
  isDayTrip: false,
  currency: "KRW",
  amount: 3000000,
};

// 상태를 스토리 안에서 들고 있어서 입력·달력·통화 선택을 직접 눌러 볼 수 있다
function Stateful({ initial }: { initial: TripFormValue }) {
  const [value, setValue] = useState(initial);
  return <TripSetupForm value={value} onChange={setValue} />;
}

const meta = {
  title: "Setup/TripSetupForm",
  component: Stateful,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stateful>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 04 여행 정보 입력: 아무것도 입력하지 않은 상태 */
export const Empty: Story = { args: { initial: EMPTY_TRIP_FORM } };

/** 05 여행 정보 완료: 기간 옆 N박N일, 예산 옆 요약이 보인다 */
export const Complete: Story = { args: { initial: COMPLETE } };

/** 당일치기: 도착일이 출발일과 같고 비활성 */
export const DayTrip: Story = {
  args: { initial: { ...COMPLETE, isDayTrip: true, arrival: null, amount: 150000 } },
};
