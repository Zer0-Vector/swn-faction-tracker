import React, { Suspense, useMemo } from "react";

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";


const FactionListActionToolbar = React.lazy(() => import("../../components/organisms/FactionListActionToolbar"));
const FactionList = React.lazy(() => import("../../components/organisms/FactionList"));

export default function PrimaryPanel() {
  console.debug("Rendering PrimaryPanel...");
  const boxSx = useMemo<SxProps<Theme>>(
    () => ({ gridColumnStart: "1", gridColumnEnd: "3" }),
    []
  );
  return (
    <Box sx={boxSx}>
      <Suspense fallback={<div>Loading...</div>}>
        <FactionListActionToolbar />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <FactionList />
      </Suspense>
    </Box>
  );
}
