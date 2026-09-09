import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import Modal from "./Modal";

const meta = {
  title: "UI/Modal",
  component: Modal,
  parameters: {
    // fixed 오버레이라 프레임 없이 뷰포트 전체를 사용한다.
    mobileFrame: false,
  },
  args: {
    open: true,
    onClose: fn(),
    maxWidth: 390,
    children: (
      <div className="rounded-t-3xl bg-white p-6">
        <h2 className="text-base font-semibold text-gray-90">바텀시트 영역</h2>
        <p className="mt-2 text-sm text-gray-60">
          children으로 넘긴 내용이 하단에서 올라옵니다. 어두운 배경을 누르면 닫힙니다.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = {
  args: { open: false },
};

/** 열고 닫는 동작을 직접 확인한다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-white"
        >
          모달 열기
        </button>
        <Modal {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
