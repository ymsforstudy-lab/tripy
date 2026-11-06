import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LandingFeatureSlide, {
  LandingVisualBudget,
  LandingVisualCategories,
  LandingVisualCurrency,
  LandingVisualGuest,
  LandingVisualTrips,
} from "./LandingFeatureSlide";

const meta = {
  title: "Landing/LandingFeatureSlide",
  component: LandingFeatureSlide,
  args: {
    title: "간편한 지출 등록",
    description: "6가지 카테고리로 빠르게 기록하고, 카드·현금 결제도 나눠서 볼 수 있어요.",
    visual: <LandingVisualCategories />,
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LandingFeatureSlide>;

export default meta;
type Story = StoryObj<typeof meta>;

// 스토리 이름은 Figma LandingVisual* 그림 이름과 같다
export const Categories: Story = {};

export const Budget: Story = {
  args: { title: "실시간 예산 관리", description: "여행 예산 대비 지금까지 쓴 돈을 한눈에. 예산 초과 걱정 없이 여행하세요.", visual: <LandingVisualBudget /> },
};

export const Currency: Story = {
  args: { title: "4가지 통화 지원", description: "원·달러·엔·유로로 기록할 수 있어요. 해외여행도 완벽하게.", visual: <LandingVisualCurrency /> },
};

export const Trips: Story = {
  args: { title: "지난 여행 돌아보기", description: "여행을 여러 개 만들고, 끝난 여행의 예산 결과와 지출 내역을 다시 봐요.", visual: <LandingVisualTrips /> },
};

export const Guest: Story = {
  args: { title: "가입 없이 바로 기록", description: "로그인하지 않으면 이 기기에만 저장돼요. 나중에 로그인하면 계정으로 옮겨져요.", visual: <LandingVisualGuest /> },
};
