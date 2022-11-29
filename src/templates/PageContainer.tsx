import React, { useMemo } from "react";
import { getAuth } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid, { GridSize } from "@mui/material/Grid";
import { SxProps, Theme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import ModeToggleButtons from "../components/molecules/ModeToggleButtons";
import UserMenu from "../components/molecules/UserMenu";
import { FirebaseApp } from "../firebase-init";

export interface PageContainerProps {
  children?: React.ReactNode;
}

const GridItem = ({ xs, children }: { xs: GridSize, children: React.ReactNode }) => (
  <Grid item
    xs={xs}
    display="flex"
    justifyContent="flex-start"
    alignItems="center"
  >
    {children}
  </Grid>
);

export default function PageContainer({ children }: PageContainerProps) {
  const location = useLocation();

  const tab = useMemo(
    () => location.pathname.startsWith("/locations") ? "LOCATIONS" : "FACTIONS", 
    [location.pathname]
  );

  console.debug("Rendering PageContainer...");

  const tabSx = useMemo<SxProps<Theme>>(() => ({
    color: "primary.contrastText",
    '&:hover': {
      color: "primary.light",
      backgroundColor: "action.hover",
    }
  }), []);

  const boxSx = useMemo<SxProps<Theme>>(() => ({
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: "stretch",
  }), []);

  const appBarSx = useMemo<SxProps<Theme>>(() => ({ 
    color: "primary.contrastText",
    backgroundColor: "primary.dark",
  }), []);

  const appTitleSx = useMemo<SxProps<Theme>>(() => ({
    mr: 2,
    color: "primary.contrastText",
    whiteSpace: "nowrap"
  }), []);

  const containerSx = useMemo<SxProps<Theme>>(() => ({
    py: 2,
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "40% 60%",
  }), []);

  return (
    <>
      <CssBaseline />
      <Box sx={boxSx} data-testid="page-container">
        <AppBar sx={appBarSx}>
          <Toolbar>
            <Grid container>{/* TODO use different layout container */}
              <GridItem xs={3.5}>
                <Typography variant="h1" sx={appTitleSx}>SWN Faction Tracker</Typography>
              </GridItem>
              <GridItem xs={4.5}>
                <Tabs value={tab} component="nav">
                  <Tab
                    value="FACTIONS"
                    label="Factions"
                    component={Link}
                    to="/factions"
                    sx={tabSx}
                    />
                  <Tab
                    value="LOCATIONS"
                    label="Locations"
                    component={Link}
                    to="/locations"
                    sx={tabSx}
                    />
                </Tabs>
              </GridItem>
              <GridItem xs={3}>
                <ModeToggleButtons />
              </GridItem>
              <GridItem xs={1}>
                <UserMenu user={getAuth(FirebaseApp).currentUser} />
              </GridItem>
            </Grid>
          </Toolbar>
        </AppBar>
        <Toolbar id="appbar-shim" />
        <Container sx={containerSx}>
          {children}
        </Container>
      </Box>
    </>
  );
}
