import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SelectChip from "./SelectChip";

const meta = {
  title: "UI/SelectChip",
  component: SelectChip,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "selected", "tag"] },
    onClick: { action: "clicked" },
    onRemove: { action: "removed" },
  },
  args: {
    label: "일본",
    variant: "default",
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 목록에서 아직 선택되지 않은 항목 */
export const Default: Story = {};

/** 목록에서 선택된 항목 */
export const Selected: Story = {
  args: { variant: "selected" },
};

/** 상단에 선택 결과를 보여주는 태그 (X 버튼으로 제거) */
export const Tag: Story = {
  args: { variant: "tag", icon: <span>🇯🇵</span> },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** 국가 선택 화면처럼 여러 항목이 쌓인 모습 */
export const ListExample: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <SelectChip {...args} label="일본" variant="selected" />
      <SelectChip {...args} label="베트남" variant="default" />
      <SelectChip {...args} label="태국" variant="default" />
      <SelectChip {...args} label="프랑스" variant="default" />
    </div>
  ),
};
