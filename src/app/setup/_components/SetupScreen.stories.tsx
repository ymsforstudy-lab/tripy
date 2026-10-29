import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import SetupScreen from "./SetupScreen";
import { EMPTY_TRIP_FORM, fromTrip } from "../_lib/tripForm";

// 수정 모드는 저장된 여행(Trip)을 fromTrip으로 폼에 채운다
const SAVED_TRIP = fromTrip({
  id: "trip-1",
  user_id: "user-1",
  title: "일본 여행",
  destination: null,
  start_date: "2026-03-01",
  end_date: "2026-03-04",
  total_budget: 3000000,
  currency: "KRW",
  is_archived: false,
  created_at: "2026-02-01T00:00:00Z",
});

const meta = {
  title: "Setup/SetupScreen",
  component: SetupScreen,
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  args: {
    mode: "create",
    initialForm: EMPTY_TRIP_FORM,
    onSave: fn(async (): Promise<string | null> => null),
  },
} satisfies Meta<typeof SetupScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 새 여행 등록 (04) */
export const Create: Story = {};

/** 여행 정보 수정: 저장된 값이 채워진 05 상태로 열린다 (Figma 미반영: 제목 문구) */
export const Edit: Story = {
  args: { mode: "edit", initialForm: SAVED_TRIP },
};

/** `다음` → `확인`을 누르면 저장 실패 문구가 시트에 보인다 */
export const SaveError: Story = {
  args: {
    mode: "edit",
    initialForm: SAVED_TRIP,
    onSave: fn(async () => "여행 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요."),
  },
};
