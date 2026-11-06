import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TripyCharacter, { type TripyCharacterVariant } from "./TripyCharacter";

const VARIANTS: TripyCharacterVariant[] = [1, 2, 3, 4, 5, 6, 7];

const meta = {
  title: "UI/TripyCharacter",
  component: TripyCharacter,
  argTypes: {
    variant: { control: "inline-radio", options: VARIANTS },
  },
  args: {
    variant: 1,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TripyCharacter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 컨테이너(점선) 안에서 원본 비율이 유지되는지 한 번에 본다
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {VARIANTS.map((v) => (
        <div key={v} className="flex flex-col items-center gap-2">
          <TripyCharacter variant={v} className="outline-dashed outline-1 outline-gray-30" />
          <span className="text-body-s text-gray-50">variant {v}</span>
        </div>
      ))}
    </div>
  ),
};
