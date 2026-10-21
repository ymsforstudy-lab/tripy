import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import FormField from "./FormField";

const meta = {
  title: "UI/FormField",
  component: FormField,
  argTypes: {
    state: { control: "inline-radio", options: ["default", "focused", "success", "error"] },
  },
  args: {
    label: "닉네임",
    showRequiredIcon: true,
    placeholder: "닉네임을 입력하세요.",
    state: "default",
    disabled: false,
    actionLabel: "중복확인",
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

// 스토리 이름은 Figma FormField의 state 값(Default·Disabled·Focused·Error)과 같다.
export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Focused: Story = {
  args: { state: "focused", value: "굶주린드림" },
};

export const Error: Story = {
  args: { state: "error", value: "굶주린드리미", helperText: "이미 사용 중인 닉네임이에요." },
};

export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    const [checked, setChecked] = useState(false);
    return (
      <FormField
        {...args}
        value={value}
        maxLength={10}
        state={checked ? "success" : "default"}
        helperText={checked ? "사용 가능한 닉네임이에요" : undefined}
        actionDisabled={value.length === 0}
        onChange={(v) => {
          setValue(v);
          setChecked(false);
        }}
        onAction={() => setChecked(true)}
      />
    );
  },
};
