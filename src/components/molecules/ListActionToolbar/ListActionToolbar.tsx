import React, { useMemo } from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { SxProps } from "@mui/material/styles";

interface ListActionToolbarProps {
  removable: boolean;
  onAddClick: React.MouseEventHandler<HTMLButtonElement>;
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactElement | React.ReactElement[];
}

export default function ListActionToolbar({ removable, onAddClick, onRemoveClick, children }: ListActionToolbarProps) {
  const fabSx = useMemo<SxProps>(() => ({
    backgroundColor: "secondary.main"
  }), []);
  
  return (
    <>
      <Box paddingBottom="1rem" display="flex" flexDirection="row" gap={2}>
        <Fab
          size="medium"
          sx={fabSx}
          onClick={onAddClick}
        >
          <AddIcon />
        </Fab>
        <Fab
          size="medium"
          sx={fabSx}
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
