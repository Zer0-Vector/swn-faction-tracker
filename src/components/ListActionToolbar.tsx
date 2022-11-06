import React from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

interface ListActionToolbarProps {
  removable: boolean;
  onAddClick: React.MouseEventHandler<HTMLButtonElement>;
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactElement | React.ReactElement[];
}

export default function ListActionToolbar({ removable, onAddClick, onRemoveClick, children }: ListActionToolbarProps) {
  return (
    <>
      <Box sx={theme => ({ 
        paddingBottom: "1rem",
        display: "flex",
        flexDirection: "row",
        gap: theme.spacing(2),
      })}>
        <Fab
          size="medium"
          color="secondary"
          onClick={onAddClick}
        >
          <AddIcon />
        </Fab>
        <Fab
          size="medium"
          color="secondary"
          disabled={!removable}
          onClick={onRemoveClick}
        >
          <RemoveIcon />
        </Fab>
      </Box>
      {children}
    </>
  );
}
