import { createTheme } from "@mui/material/styles";

enum Shade {
  DARKER = -2,
  DARK = -1,
  BASE = 0,
  LIGHT = 1,
  LIGHTER = 2,
}
const DARKER = Shade.DARKER;
const DARK = Shade.DARK;
const BASE = Shade.BASE;
const LIGHT = Shade.LIGHT;
const LIGHTER = Shade.LIGHTER;

type ColorType = {
  [K in Shade]: string;
};

type ColorVariant = "main" | "very light pastel" | "greyish darkest" | "greyish lighter" | "shiny";

interface MainPalette {
  primary: ColorType;
  secondary: ColorType;
  tertiary: ColorType;
}

type PaletteMap = { [K in ColorVariant]: MainPalette };

// https://paletton.com/#uid=33x0I0kmpJc6c+ygdUgrbuKqJdi
const COLORS: PaletteMap = {
  "main": {
    primary: {
      [DARKER]: "#0F2D44",
      [DARK]: "#0F2D44",
      [BASE]: "#4792CC",
      [LIGHT]: "#7CBBEC",
      [LIGHTER]: "#D0EAFE",
    },
    secondary: {
      [DARKER]: "#6A1111",
      [DARK]: "#F52525",
      [BASE]: "#FF4C4C",
      [LIGHT]: "#FF7E7E",
      [LIGHTER]: "#FFCECE",
    },
    tertiary: {
      [DARKER]: "#6A5B11",
      [DARK]: "#F5D125",
      [BASE]: "#FFE04C",
      [LIGHT]: "#FFE97E",
      [LIGHTER]: "#FFF7CE",
    },
  },
  "greyish darkest": {
    // TODO
    primary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    secondary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    tertiary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
  },
  "greyish lighter": {
    // TODO
    primary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    secondary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    tertiary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
  },
  "very light pastel": {
    // TODO
    primary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    secondary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    tertiary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
  },
  "shiny": {
    // TODO
    primary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    secondary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
    tertiary: {
      [DARKER]: "#",
      [DARK]: "#",
      [BASE]: "#",
      [LIGHT]: "#",
      [LIGHTER]: "#",
    },
  }
};

export const THEME = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.main.primary[BASE],
      light: COLORS.main.primary[LIGHT],
      dark: COLORS.main.primary[DARK],
      contrastText: COLORS.main.primary[LIGHTER],
    },
    secondary: {
      main: COLORS.main.secondary[BASE],
      light: COLORS.main.secondary[LIGHT],
      dark: COLORS.main.secondary[DARK],
      contrastText: COLORS.main.secondary[LIGHTER],
    },
    tertiary: {
      main: COLORS.main.tertiary[BASE],
      light: COLORS.main.tertiary[LIGHT],
      dark: COLORS.main.tertiary[DARK],
      contrastText: COLORS.main.tertiary[LIGHTER],
    },
    action: {
      selected: COLORS.main.tertiary[DARKER],
      dragging: COLORS.main.secondary[DARKER],
    },
    background: {
      default: "#282c34",
      paper: "#383c44",
      paper2: "#484c54",
      paper3: "#50546c",
    },
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
