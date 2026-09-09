import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES } from "@/lib/constants/categories";

const meta = {
  title: "UI/CategoryIcon",
  component: CategoryIcon,
  argTypes: {
    category: { control: "select", options: CATEGORIES.map((c) => c.id) },
    variant: { control: "inline-radio", options: ["image", "emoji"] },
    size: { control: { type: "range", min: 16, max: 96, step: 4 } },
  },
  args: {
    category: "food",
    variant: "image",
    size: 40,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CategoryIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {};

export const Emoji: Story = {
  args: { variant: "emoji" },
};

/** 알 수 없는 카테고리는 💰 로 대체된다. */
export const UnknownFallback: Story = {
  args: { category: "unknown-category" },
};

/** 6개 카테고리 전체 */
export const AllCategories: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-4">
      {CATEGORIES.map((c) => (
        <div key={c.id} className="flex flex-col items-center gap-1">
          <CategoryIcon {...args} category={c.id} />
          <span className="text-xs text-gray-60">{c.label}</span>
        </div>
      ))}
    </div>
  ),
};
