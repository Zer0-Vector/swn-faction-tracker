import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SxProps, Theme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { UiStateContext } from "../contexts/UiStateContext";

export interface PageContainerProps {
  ref?: React.Ref<unknown>;
  children?: React.ReactNode;
}

export default function PageContainer({ ref, children }: PageContainerProps) {
  const { controller: uiController } = useContext(UiStateContext);
  const location = useLocation();

  const clearSelection = () => uiController.clearSelections();

  const tabSx: SxProps<Theme> = {
    color: "primary.contrastText",
    '&:hover': {
      color: "primary.light",
    }
  };

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
      <AppBar sx={{ color: "primary.contrastText", backgroundColor: "primary.dark" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="subtitle1" sx={{ mr: 3 }}>SWN Faction Tracker</Typography>
            <Tabs value={location.pathname}>
              <Tab
                value="/"
                label="Factions"
                component={Link}
                to="/"
                onClick={clearSelection}
                sx={tabSx}
              />
              <Tab
                value="/locations"
                label="Locations"
                component={Link}
                to="/locations"
                onClick={clearSelection}
                sx={tabSx}
              />
            </Tabs>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar id="appbar-shim" />
      <Container sx={theme => ({
        py: theme.spacing(2),
        width: "100vw",
        display: "grid",
        gridTemplateColumns: "40% 60%",
      })}>
        {children}
      </Container>
    </Box>
  );
}
