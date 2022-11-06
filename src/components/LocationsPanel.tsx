import React from "react";
import LocationsActionToolbar from "./LocationsActionToolbar";
import LocationsList from "./LocationsList";
import Box from "@mui/material/Box";

export default function LocationsPanel() {
  return (
    <Box sx={theme => ({
      margin: theme.spacing(5),
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
