import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProfileAvatar from "./ProfileAvatar";

const meta = {
  title: "UI/ProfileAvatar",
  component: ProfileAvatar,
  argTypes: {
    size: { control: { type: "range", min: 24, max: 120, step: 4 } },
    onClick: { action: "clicked" },
  },
  args: { size: 48 },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 캐릭터 아바타 */
export const Default: Story = {};

export const Large: Story = {
  args: { size: 96 },
};

/** 사용자가 업로드한 사진이 있는 경우 */
export const WithPhoto: Story = {
  args: {
    size: 96,
    avatarUrl: "/images/tripy/tripy-7.png",
  },
};

export const Clickable: Story = {
  args: { onClick: () => {} },
};
