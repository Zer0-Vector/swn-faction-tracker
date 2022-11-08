import React from "react";

import Box from "@mui/material/Box";

import FactionList from "../components/organisms/FactionList/FactionList";
import FactionListActionToolbar from "../components/organisms/FactionListActionToolbar";

export default function PrimaryPanel() {
  return (
    <Box sx={{ gridColumnStart: "1", gridColumnEnd: "3" }}>
      <FactionListActionToolbar />
      <FactionList />
    </Box>
  );
}
