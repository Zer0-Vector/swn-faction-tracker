import React, { useMemo } from "react";

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

import FactionList from "../../components/organisms/FactionList";
import FactionListActionToolbar from "../../components/organisms/FactionListActionToolbar";

export default function PrimaryPanel() {
  console.debug("Rendering PrimaryPanel...");
  const boxSx = useMemo<SxProps<Theme>>(() => ({ gridColumnStart: "1", gridColumnEnd: "3" }), []);
  return (
    <Box sx={boxSx}>
      <FactionListActionToolbar />
      <FactionList />
    </Box>
  );
}
