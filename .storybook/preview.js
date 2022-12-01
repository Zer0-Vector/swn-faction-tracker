import { ThemeProvider } from "@mui/material";
import { THEME } from "../src/style/Theme"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  Story => (
    <ThemeProvider theme={THEME}>
      <Story />
    </ThemeProvider>
  ),
];
