import "@mui/material/styles/createPalette";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    paper2: string;
  }

  interface TypeAction {
    dragging: string;
  }

  interface PaletteOptions {
    tertiary: PaletteColorOptions;
  }
}

declare module "@mui/material/ToggleButtonGroup/ToggleButtonGroup" {
  interface ToggleButtonGroupPropsColorOverrides {
    tertiary: PaletteOptions["tertiary"];
  }
}
