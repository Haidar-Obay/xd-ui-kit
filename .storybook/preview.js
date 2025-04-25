// .storybook/preview.js
import '../src/styles/tailwind.css'; // Make sure the path is correct

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
