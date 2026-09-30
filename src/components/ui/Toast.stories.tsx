import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Toast from "./Toast";

const meta = {
  title: "UI/Toast",
  component: Toast,
  parameters: {
    // fixed 요소라 모바일 프레임 없이 뷰포트 기준으로 렌더링한다.
    mobileFrame: false,
  },
  args: {
    message: "지출이 등록되었어요",
    visible: true,
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {};

export const Hidden: Story = {
  args: { visible: false },
};

export const LongMessage: Story = {
  args: { message: "여행이 삭제되었어요" },
};

/** 버튼으로 노출/숨김 전환하며 애니메이션을 확인한다. */
export const Toggle: Story = {
  render: function Render(args) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="p-4">
        <button
          onClick={() => setVisible((v) => !v)}
          className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-white"
        >
          토스트 {visible ? "숨기기" : "보이기"}
        </button>
        <Toast {...args} visible={visible} />
      </div>
    );
  },
};
