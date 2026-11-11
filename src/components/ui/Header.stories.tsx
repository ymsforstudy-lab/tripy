import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from "./Header";

const meta = {
  title: "UI/Header",
  component: Header,
  argTypes: {
    onBack: { action: "back" },
    onClose: { action: "close" },
  },
  args: { title: "여행 설정" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 뒤로가기 + 가운데 정렬된 타이틀 */
export const WithTitle: Story = {};

/** 타이틀 없이 뒤로가기만 */
export const BackOnly: Story = {
  args: { title: undefined },
};

/** 뒤로가기 + 타이틀 + 닫기 */
export const WithClose: Story = {
  args: { title: "지출 등록", onClose: () => {} },
};

/** 뒤로가기 + 타이틀 없음 + 오른쪽 커스텀 액션 (여행 상세 수정 버튼 예시) */
export const WithRightAction: Story = {
  args: {
    title: undefined,
    rightAction: (
      <button aria-label="여행 정보 수정" className="flex items-center justify-center p-1">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M14.5 2.5a1.414 1.414 0 0 1 2 2L6 15 2 16l1-4L14.5 2.5Z"
            stroke="var(--color-gray-60)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    ),
  },
};
