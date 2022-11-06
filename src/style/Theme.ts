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
    }
  },
  typography: {
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "1.125rem",
    },
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2.25rem",
    },
    h3: {
      fontSize: "2rem",
    },
    h4: {
      fontSize: "1.75rem",
    },
    h5: {
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1.25rem",
    },
    subtitle1: {
      fontSize: "2.25rem"
    },
    subtitle2: {
      fontSize: "2rem"
    }
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "1rem"
        }
      }
    }
  }
});
