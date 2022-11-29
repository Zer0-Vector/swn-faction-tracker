import React, { useMemo } from "react";

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

import LocationsActionToolbar from "../../components/organisms/LocationsActionToolbar";
import LocationsList from "../../components/organisms/LocationsList";

export default function LocationsPanel() {
  const boxSx = useMemo<SxProps<Theme>>(() => ({
    gridColumn: "1 / 3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%"
  }), []);
  
  console.debug("Rendering LocationsPanel...");
  return (
    <Box sx={boxSx}>
      <LocationsActionToolbar />
      <LocationsList />
    </Box>
  );
}
