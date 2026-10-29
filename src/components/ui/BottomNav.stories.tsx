import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BottomNav from "./BottomNav";

const meta = {
  title: "UI/BottomNav",
  component: BottomNav,
  parameters: {
    // 화면 하단에 fixed로 붙는 컴포넌트라 프레임 없이 렌더링한다.
    mobileFrame: false,
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/home" },
    },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const PastTrips: Story = {
  parameters: { nextjs: { navigation: { pathname: "/travels" } } },
};

export const PastTripDetail: Story = {
  parameters: { nextjs: { navigation: { pathname: "/travels/abc123" } } },
};

export const MyPage: Story = {
  parameters: { nextjs: { navigation: { pathname: "/mypage" } } },
};
