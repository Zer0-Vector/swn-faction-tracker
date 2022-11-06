import React from "react";

import Box from "@mui/material/Box";

import LocationsActionToolbar from "./LocationsActionToolbar";
import LocationsList from "./LocationsList";

export default function LocationsPanel() {
  return (
    <Box sx={theme => ({
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%"
    })}>
      <LocationsActionToolbar />
      <LocationsList />
    </Box>
  );
}
