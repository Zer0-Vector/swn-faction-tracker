import React, { useCallback, useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SxProps, Theme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import ModeToggleButtons from "../components/molecules/ModeToggleButtons";
import UserMenu from "../components/molecules/UserMenu";
import { UiStateContext } from "../contexts/UiStateContext";
import { FirebaseAuth } from "../firebase-init";

export interface PageContainerProps {
  children?: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  const { controller: uiController } = useContext(UiStateContext);
  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clearSelection = useCallback(() => uiController.clearSelections(), []);

  console.debug("Rendering PageContainer...");

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
      data-testid="page-container"
    >
      <AppBar sx={{ color: "primary.contrastText", backgroundColor: "primary.dark" }}>
        <Toolbar>
          <Grid container>
            <Grid item xs={3.5}>
              <Typography variant="h1" sx={{ mr: 2, color: "primary.contrastText", whiteSpace: "nowrap" }}>SWN Faction Tracker</Typography>
            </Grid>
            <Grid item xs={4.5}>
              <Tabs value={location.pathname} component="nav">
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
            </Grid>
            <Grid item xs={3}>
              <ModeToggleButtons />
            </Grid>
            <Grid item xs={1}>
              <UserMenu user={FirebaseAuth.currentUser} />
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
  );
}
