import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FactionList from "../FactionList";
import FactionActionToolbar from "../FactionActionToolbar";

export default function PrimaryPanel() {
  return (
    <Box sx={{
        display: "flex",
        minHeight: "calc(100vh - 6rem)",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "3rem 0",
      }}
      data-testid="app-inner-box"
    >
      <Typography variant="h1" sx={{ textAlign: "center" }}>SWN Faction Tracker</Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%"
      }}>
        <Box sx={{ 
          width: "40%",
          marginTop: "2rem",
          marginX: "2rem",
          padding: "1rem",
          backgroundColor: "background.paper",
        }}>
          {/* <AddFactionForm /> */}
          <FactionActionToolbar />
          <FactionList />
        </Box>
        <Box sx={{
          flexGrow: "1",
          marginTop: "2rem",
          marginX: "2rem",
          padding: "1rem",
        }}>
          <Typography>Test 123</Typography>
        </Box>
      </Box>
    </Box>
  );
}