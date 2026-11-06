import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LandingCTAButton from "./LandingCTAButton";
import "../landing.css";

const meta = {
  title: "Landing/LandingCTAButton",
  component: LandingCTAButton,
  argTypes: {
    size: { control: "inline-radio", options: ["L", "S"] },
  },
  args: {
    label: "무료로 시작하기",
    size: "L",
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingCTAButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const L: Story = {};

export const S: Story = {
  args: { size: "S", label: "시작하기" },
};
