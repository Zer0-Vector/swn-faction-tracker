import React, { useMemo } from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { SxProps } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ListActionToolbarProps {
  removable: boolean;
  onAddClick: React.MouseEventHandler<HTMLButtonElement>;
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactElement | React.ReactElement[];
  ["data-testid"]?: string;
}

export default function ListActionToolbar({ removable, onAddClick, onRemoveClick, children, "data-testid": dtid }: ListActionToolbarProps) {
  const fabSx = useMemo<SxProps>(() => ({
    backgroundColor: "secondary.main"
  }), []);
  const isSmallViewport = useMediaQuery("(max-width:600px)");
  const buttonSize = isSmallViewport ? "small" : "medium";
  return (
    <>
      <Box padding={1} display="flex" flexDirection="row" alignItems="center" gap={2} data-testid={dtid}>
        <Fab
          size={buttonSize}
          sx={fabSx}
          onClick={onAddClick}
          data-testid="lat-add"
        >
          <AddIcon />
        </Fab>
        <Fab
          size={buttonSize}
          sx={fabSx}
          disabled={!removable}
          onClick={onRemoveClick}
          data-testid="lat-remove"
        >
          <RemoveIcon />
        </Fab>
      </Box>
      {children}
    </>
  );
}
