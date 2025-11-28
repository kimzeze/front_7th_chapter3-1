import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'oklch(1 0 0)',
        },
        {
          name: 'dark',
          value: 'oklch(0.129 0.042 264.695)',
        },
      ],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }

      return <Story />;
    },
  ],
};

export default preview;