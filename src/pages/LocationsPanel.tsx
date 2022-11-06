import React from "react";

import Box from "@mui/material/Box";

import LocationsActionToolbar from "../components/LocationsActionToolbar";
import LocationsList from "../components/LocationsList";

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
