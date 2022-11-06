import { createTheme } from "@mui/material/styles";

interface ColorType {
  [key: number]: string;
}

interface ColorsMapType {
  [key: string]: ColorType;
}

const COLORS: ColorsMapType = {
  primary: {
    [-2]: "#1B384B",
    [-1]: "#376E92",
    [0]: "#619FC7",
    [1]: "#9DCEEE",
    [2]: "#F3FAFF",
  },
  secondary: {
    [-2]: "#2B2151",
    [-1]: "#55429D",
    [0]: "#816CCF",
    [1]: "#B4A4F0",
    [2]: "#F6F4FF",
  },
  tirtiary: {
    [-2]: "#26601F",
    [-1]: "#4BBB40",
    [0]: "#73E368",
    [1]: "#A6F69E",
    [2]: "#F4FFF3",
  }
};

export const THEME = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.primary[0],
      light: COLORS.primary[1],
      dark: COLORS.primary[-1],
      contrastText: COLORS.primary[2],
    },
    secondary: {
      main: COLORS.tirtiary[0],
      light: COLORS.tirtiary[1],
      dark: COLORS.tirtiary[-1],
      contrastText: COLORS.tirtiary[2],
    },
    action: {
      selected: COLORS.secondary[1],
      dragging: COLORS.secondary[0],
    },
    background: {
      default: "#282c34",
      paper: "#383c44",
      paper2: "#484c54",
      paper3: "#50546c",
    }
  },
  typography: {
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.85rem",
    },
    h1: {
      fontSize: "2.5rem"
    },
    h2: {
      fontSize: "2.25rem"
    },
    h3: {
      fontSize: "2rem"
    },
    h4: {
      fontSize: "1.75rem"
    },
    h5: {
      fontSize: "1.5rem"
    },
    h6: {
      fontSize: "1.75rem"
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
