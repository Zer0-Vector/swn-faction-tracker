import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type ListActionToolbarProps = {
  removable: boolean,
  onAddClick: React.MouseEventHandler<HTMLButtonElement>,
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>,
  children: React.ReactElement | React.ReactElement[],
};

export default function ListActionToolbar({ removable, onAddClick, onRemoveClick, children }: ListActionToolbarProps) {
  return (
    <Box sx={{ paddingBottom: "1rem", display: "flex", flexDirection: "row", gap: "1rem" }}>
      <Fab
        size="medium"
        color="primary"
        onClick={onAddClick}
      >
        <AddIcon />
      </Fab>
      <Fab
        size="medium"
        color="primary"
        disabled={!removable}
        onClick={onRemoveClick}
      >
        <RemoveIcon />
      </Fab>
      {children}
    </Box>
  );
}
