import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    options: {
      storySort: {
        order: [
          'Foundations',
          [
            'Primitive Color',
            'Semantic Color',
            'Typography',
            'Spacing',
            'Radius',
            'Shadow',
          ],
          'UI',
        ],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  // 모바일 우선 설계(max-width 390px)를 스토리에서도 동일하게 재현한다.
  // parameters.mobileFrame: false 를 주면 프레임 없이 그대로 렌더링한다.
  decorators: [
    (Story, context) => {
      if (context.parameters.mobileFrame === false) {
        return <Story />
      }
      return (
        <div className="mx-auto w-full max-w-[390px] bg-white">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
