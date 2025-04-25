import path from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // Remove existing .css rule
    config.module.rules = config.module.rules.filter(
      (rule) => !(rule.test && rule.test.toString().includes('css'))
    );

    config.module.rules.push({
      test: /\.css$/,
      include: path.resolve(__dirname, '../'),
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    return config;
  },
};

export default config;
