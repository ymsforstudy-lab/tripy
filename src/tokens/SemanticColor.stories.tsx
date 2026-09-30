import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import css from "./semantic-color.css?raw";
import { ColorGrid, tokenDocParameters } from "./TokenDoc";
import { tokensOf } from "./parseTokens";

const meta = {
  title: "Foundations/Semantic Color",
  parameters: tokenDocParameters(
    "semantic-color.css",
    "상태를 전달하는 의미 색상. 에러·삭제는 danger, 안내는 info, 주의는 warning을 쓴다.",
  ),
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  render: () => <ColorGrid section={tokensOf(css, "--color-danger-", "Danger")} />,
};

export const Info: Story = {
  render: () => <ColorGrid section={tokensOf(css, "--color-info-", "Info")} />,
};

export const Warning: Story = {
  render: () => <ColorGrid section={tokensOf(css, "--color-warning-", "Warning")} />,
};
