import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TripConfirmSheet from "./TripConfirmSheet";
import type { TripFormValue } from "../_lib/tripForm";

const VALUE: TripFormValue = {
  destination: "대한민국",
  departure: { year: 2026, month: 3, day: 1 },
  arrival: { year: 2026, month: 3, day: 4 },
  isDayTrip: false,
  currency: "KRW",
  amount: 3000000,
};

const meta = {
  title: "Setup/TripConfirmSheet",
  component: TripConfirmSheet,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    value: VALUE,
    onEdit: fn(),
    onConfirm: fn(),
    submitting: false,
    errorMessage: null,
  },
} satisfies Meta<typeof TripConfirmSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 06 정보 확인 */
export const Default: Story = {};

export const DayTrip: Story = {
  args: { value: { ...VALUE, isDayTrip: true, arrival: null } },
};

/** 저장 중: 두 버튼 모두 비활성 */
export const Submitting: Story = { args: { submitting: true } };

/** 저장 실패: 시트와 입력값은 그대로 두고 에러를 보여준다 */
export const SaveError: Story = {
  args: { errorMessage: "여행을 저장하지 못했어요. 잠시 후 다시 시도해주세요." },
};
