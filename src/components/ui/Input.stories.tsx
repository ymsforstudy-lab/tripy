import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import Input from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    state: { control: "inline-radio", options: ["default", "focused", "success", "error"] },
  },
  args: {
    label: "닉네임",
    placeholder: "닉네임을 입력해 주세요",
    state: "default",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Focused: Story = {
  args: { state: "focused", value: "트리피" },
};

export const Success: Story = {
  args: { state: "success", value: "트리피", helperText: "사용 가능한 닉네임이에요" },
};

export const Error: Story = {
  args: { state: "error", value: "트", helperText: "2자 이상 입력해 주세요" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "수정할 수 없어요" },
};

export const WithIconAndMaxLength: Story = {
  args: {
    maxLength: 10,
    icon: <span className="text-xs">0/10</span>,
  },
};

/** 실제 입력이 동작하는 상태를 확인한다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    return <Input {...args} value={value} onChange={setValue} maxLength={10} />;
  },
};
