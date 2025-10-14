enum Shade {
  DARKER = -2,
  DARK = -1,
  BASE = 0,
  LIGHT = 1,
  LIGHTER = 2,
}

export const DARKER = Shade.DARKER;
export const DARK = Shade.DARK;
export const BASE = Shade.BASE;
export const LIGHT = Shade.LIGHT;
export const LIGHTER = Shade.LIGHTER;

type ColorType = {
  [K in Shade]: string;
};

type ColorVariant =
  | "pastel"
  | "very light pale pastel"
  | "greyish darkest"
  | "greyish lightest"
  | "shiny";

interface MainPalette {
  primary: ColorType;
  secondary: ColorType;
  tertiary: ColorType;
}

type PaletteMap = { [K in ColorVariant]: MainPalette };

// https://paletton.com/#uid=33x0I0kmpJc6c+ygdUgrbuKqJdi
export const COLORS: PaletteMap = {
  pastel: {
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
      [DARKER]: "#1C2C38",
      [DARK]: "#1C2C38",
      [BASE]: "#161819",
      [LIGHT]: "#2C3338",
      [LIGHTER]: "#394853",
    },
    secondary: {
      [DARKER]: "#565229",
      [DARK]: "#403E2B",
      [BASE]: "#272722",
      [LIGHT]: "#585643",
      [LIGHTER]: "#817D55",
    },
    tertiary: {
      [DARKER]: "#4D2531",
      [DARK]: "#39272C",
      [BASE]: "#231F20",
      [LIGHT]: "#4E3B41",
      [LIGHTER]: "#744C58",
    },
  },
  "greyish lightest": {
    // TODO
    primary: {
      [DARKER]: "#889096",
      [DARK]: "#9DA3A9",
      [BASE]: "#D3D7DA",
      [LIGHT]: "#A8B7C3",
      [LIGHTER]: "#889DAE",
    },
    secondary: {
      [DARKER]: "#E9E7D3",
      [DARK]: "#FFFDEC",
      [BASE]: "#FFFEF6",
      [LIGHT]: "#FFFCD9",
      [LIGHTER]: "#FFFAC4",
    },
    tertiary: {
      [DARKER]: "#D0BCC2",
      [DARK]: "#E5D4DA",
      [BASE]: "#F4EBEE",
      [LIGHT]: "#EDCAD4",
      [LIGHTER]: "#E7B1C1",
    },
  },
  "very light pale pastel": {
    // TODO
    primary: {
      [DARKER]: "#3C6585",
      [DARK]: "#577C98",
      [BASE]: "#7695AD",
      [LIGHT]: "#9CB4C7",
      [LIGHTER]: "#C1D1DD",
    },
    secondary: {
      [DARKER]: "#CFC456",
      [DARK]: "#ECE380",
      [BASE]: "#FFF7A8",
      [LIGHT]: "#FFFAC4",
      [LIGHTER]: "#FFFCDD",
    },
    tertiary: {
      [DARKER]: "#B94D6E",
      [DARK]: "#D37290",
      [BASE]: "#E798B0",
      [LIGHT]: "#EEB7C8",
      [LIGHTER]: "#F5D4DE",
    },
  },
  shiny: {
    primary: {
      [DARKER]: "#003D6B",
      [DARK]: "#004F8B",
      [BASE]: "#1097FF",
      [LIGHT]: "#79C5FF",
      [LIGHTER]: "#A9DAFF",
    },
    secondary: {
      [DARKER]: "#A79800",
      [DARK]: "#D9C500",
      [BASE]: "#FFE800",
      [LIGHT]: "#FFF270",
      [LIGHTER]: "#FFF7A4",
    },
    tertiary: {
      [DARKER]: "#95002D",
      [DARK]: "#C2003B",
      [BASE]: "#FF004D",
      [LIGHT]: "#FF709B",
      [LIGHTER]: "#FFA4BF",
    },
  },
};
