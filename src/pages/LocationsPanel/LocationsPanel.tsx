import React, { Suspense, useMemo } from "react";

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

const LocationsActionToolbar = React.lazy(() => import("../../components/organisms/LocationsActionToolbar"));
const LocationsList = React.lazy(() => import("../../components/organisms/LocationsList"));

export default function LocationsPanel() {
  const boxSx = useMemo<SxProps<Theme>>(
    () => ({
      gridColumn: "1 / 3",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
    }),
    []
  );

  console.debug("Rendering LocationsPanel...");
  return (
    <Box sx={boxSx}>
      <Suspense fallback={<div>Loading...</div>}>
        <LocationsActionToolbar />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <LocationsList />
      </Suspense>
    </Box>
  );
}
