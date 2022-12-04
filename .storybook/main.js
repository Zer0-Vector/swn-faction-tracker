module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  env: config => ({
    ...config,
    REACT_APP_FIREBASE_CONFIG: "{\"apiKey\": \"storybook\", \"projectId\": \"swn-faction-tracker-test\", \"messagingSenderId\": \"123\", \"appId\": \"test\"}"
  }),
}