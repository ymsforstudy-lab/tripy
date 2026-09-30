import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost"] },
    size: { control: "inline-radio", options: ["L", "M"] },
    onClick: { action: "clicked" },
  },
  args: {
    label: "다음",
    variant: "primary",
    size: "L",
    fullWidth: true,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", label: "취소" },
};

export const Ghost: Story = {
  args: { variant: "ghost", label: "건너뛰기" },
};

export const SizeM: Story = {
  name: "Size M",
  args: { size: "M" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithIcon: Story = {
  args: {
    label: "지출 추가",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
};

/** 세 가지 variant를 한 화면에서 비교한다. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Button {...args} variant="primary" label="Primary" />
      <Button {...args} variant="secondary" label="Secondary" />
      <Button {...args} variant="ghost" label="Ghost" />
    </div>
  ),
};
