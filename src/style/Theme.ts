import { createTheme } from "@mui/material/styles";

import { BASE, COLORS, DARK, DARKER, LIGHT, LIGHTER } from "./Colors";

export const THEME = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.pastel.primary[BASE],
      light: COLORS.pastel.primary[LIGHT],
      dark: COLORS.pastel.primary[DARK],
      contrastText: COLORS.pastel.primary[LIGHTER],
    },
    secondary: {
      main: COLORS.pastel.secondary[BASE],
      light: COLORS.pastel.secondary[LIGHT],
      dark: COLORS.pastel.secondary[DARK],
      contrastText: COLORS.pastel.secondary[LIGHTER],
    },
    tertiary: {
      main: COLORS.pastel.tertiary[BASE],
      light: COLORS.pastel.tertiary[LIGHT],
      dark: COLORS.pastel.tertiary[DARK],
      contrastText: COLORS.pastel.tertiary[LIGHTER],
    },
    action: {
      selected: COLORS.pastel.tertiary[DARKER],
      dragging: COLORS.pastel.secondary[DARKER],
    },
    background: {
      default: COLORS["greyish darkest"].primary[BASE],
      paper: COLORS["greyish darkest"].primary[LIGHT],
      paper2: COLORS["greyish darkest"].primary[LIGHTER],
    },
    text: {
    },
  },
  typography: {
    body1: {
      fontSize: "0.75rem",
    },
    body2: {
      fontSize: "1rem",
    },
    h1: {
      fontSize: "2rem",
      color: COLORS.pastel.tertiary[LIGHTER],
    },
    h2: {
      fontSize: "1.875rem",
      color: COLORS.pastel.tertiary[LIGHTER],
    },
    h3: {
      fontSize: "1.75rem",
      color: COLORS.pastel.tertiary[LIGHTER],
    },
    h4: {
      fontSize: "1.625rem",
      color: COLORS.pastel.tertiary[LIGHTER],
    },
    h5: {
      fontSize: "1.5rem",
      color: COLORS.pastel.tertiary[LIGHTER],
    },
    h6: {
      fontSize: "1.375rem",
      color: COLORS.pastel.tertiary[LIGHTER],
    },
    subtitle1: {
      fontSize: "2.25rem",
    },
    subtitle2: {
      fontSize: "2rem",
    },
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
        },
      },
    },
  },
});
