import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type PageContainerProps = {
  ref?: React.Ref<unknown>,
  children?: React.ReactNode,
};

export default function PageContainer({ ref, children }: PageContainerProps) {
  return (
    <Box sx={{
        display: "flex",
        minHeight: "calc(100vh - 4rem)",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "2rem 0",
      }}
      ref={ref}
      data-testid="page-container"
    >
      <Typography variant="h1" sx={{ textAlign: "center" }}>SWN Faction Tracker</Typography>
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
