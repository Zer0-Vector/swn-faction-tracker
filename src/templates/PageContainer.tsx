import React from "react";
import { getAuth } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
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

export default function PageContainer({ children }: PageContainerProps) {
  const location = useLocation();

  const tab = location.pathname.startsWith("/locations") ? "LOCATIONS" : "FACTIONS";

  console.debug("Rendering PageContainer...");

  const tabSx: SxProps<Theme> = {
    color: "primary.contrastText",
    '&:hover': {
      color: "primary.light",
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "stretch",
        }}
        data-testid="page-container"
      >
        
        <AppBar sx={{ color: "primary.contrastText", backgroundColor: "primary.dark" }}>
          <Toolbar>
            <Grid container>
              <Grid item xs={3.5}>
                <Typography variant="h1" sx={{ mr: 2, color: "primary.contrastText", whiteSpace: "nowrap" }}>SWN Faction Tracker</Typography>
              </Grid>
              <Grid item xs={4.5}>
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
              </Grid>
              <Grid item xs={3}>
                <ModeToggleButtons />
              </Grid>
              <Grid item xs={1}>
                <UserMenu user={getAuth(FirebaseApp).currentUser} />
              </Grid>
            </Grid>
          </Toolbar>
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
    </>
  );
}
