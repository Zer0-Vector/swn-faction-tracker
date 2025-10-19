import React, { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { TurnPhaseStepper } from "@/components/atoms/TurnPhaseStepper";
import ModeToggleButtons from "@/components/molecules/ModeToggleButtons";
import UserMenu from "@/components/molecules/UserMenu";
import { UiStateContext } from "@/contexts/UiStateContext";
import { useAuth } from "@/hooks/useAuth";
import { RequiredChildrenProps } from "@/types/ChildrenProps";
import { ReadonlyPropsWithChildren } from "@/types/ReadonlyPropsWithChildren";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid, { GridTypeMap } from "@mui/material/Grid";
import { OverrideProps } from "@mui/material/OverridableComponent";
import Slide from "@mui/material/Slide";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

type GridItemProps = OverrideProps<GridTypeMap, "div"> & RequiredChildrenProps;

const GridItemComp = (props: GridItemProps) => (
  <Grid
    display="flex"
    justifyContent="center"
    alignItems="center"
    {...props}
  >
    {props.children}
  </Grid>
);

const GridItem = React.memo(GridItemComp);

export default function PageContainer({ children }: ReadonlyPropsWithChildren) {
  const { state } = useContext(UiStateContext);
  const location = useLocation();
  const { currentUser } = useAuth();

  const tab = useMemo(
    () =>
      location.pathname.startsWith("/locations") ? "LOCATIONS" : "FACTIONS",
    [location.pathname]
  );

  console.debug("Rendering PageContainer...");

  const tabSx = {
    color: "primary.contrastText",
    "&:hover": {
      color: "primary.light",
      backgroundColor: "action.hover",
    },
  };

  const pageContainerSx = {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    alignItems: "stretch",
  };

  const appBarSx = {
    color: "primary.contrastText",
    backgroundColor: "primary.dark",
  };

  const contentContainerSx = {
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "40% 60%",
  };

  return (
    <>
      <CssBaseline />
      <Box sx={pageContainerSx} data-testid="page-container">
        <AppBar sx={appBarSx} data-testid="app-bar">
          <Toolbar data-testid="toolbar">
            <Grid container
                spacing={{ lg: 4, md: 3, sm: 2, xs: 1}}
                columns={{ lg: 12, md: 9, xs: 4 }}
                width="100%"
            >
              <GridItem
                  size={4}
                  justifyContent="flex-start"
              >
                <Typography
                    variant="h1"
                    textAlign="left"
                    color="primary.contrastText"
                    whiteSpace="nowrap"
                    data-testid="app-title"
                >
                  SWN Faction Tracker
                </Typography>
              </GridItem>
              <GridItem size={{ lg: 3, md: 5, xs: 4 }}>
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
              <GridItem size={{ lg: 3, md: 8, xs: 3 }}>
                <ModeToggleButtons />
              </GridItem>
              <GridItem size={1}>
                <UserMenu user={currentUser} />
              </GridItem>
            </Grid>
          </Toolbar>
        </AppBar>
        <Toolbar id="appbar-shim" />
        <Slide
          in={state.editMode === "TURN"}
          direction="down"
          appear={false}
          unmountOnExit={true}
        >
          <Box paddingX={4} paddingY={2}>
            <TurnPhaseStepper />
          </Box>
        </Slide>
        <Container sx={contentContainerSx}>{children}</Container>
      </Box>
    </>
  );
}
