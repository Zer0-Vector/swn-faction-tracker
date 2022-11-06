import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";

export type PageContainerProps = {
  ref?: React.Ref<unknown>,
  children?: React.ReactNode,
};

export default function PageContainer({ ref, children }: PageContainerProps) {
  const location = useLocation();
  return (
    <Box sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "stretch",
      }}
      ref={ref}
      data-testid="page-container"
    >
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h1" sx={{ mr: 3 }}>SWN Faction Tracker</Typography>
            <Tabs value={location.pathname}>
              <Tab
                value="/"
                label="Factions"
                component={Link}
                to="/"
              />
              <Tab
                value="/locations"
                label="Locations"
                component={Link}
                to="/locations"
              />
            </Tabs>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar id="appbar-shim" />
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: "0.25rem",
        overflow: "clip",
      }}>
        {children}
      </Box>
    </Box>
  );
}
