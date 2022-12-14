import React, { useContext, useMemo } from "react";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Slide from "@mui/material/Slide";
import { SxProps } from "@mui/material/styles";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import TestableProps from "../../../types/TestableProps";

interface ListActionToolbarProps 
  extends RequiredChildrenProps<React.ReactElement | React.ReactElement[]>, TestableProps {
  removable: boolean;
  onAddClick: React.MouseEventHandler<HTMLButtonElement>;
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ListActionToolbar({ removable, onAddClick, onRemoveClick, children, "data-testid": dtid }: ListActionToolbarProps) {
  const { state } = useContext(UiStateContext);
  const fabSx = useMemo<SxProps>(() => ({
    backgroundColor: "secondary.main",
  }), []);
  return (
    <Slide in={state.editMode === "EDIT"} direction="right" appear={false} unmountOnExit>
      <Box>
        <Box marginBottom={1} padding={1} display="flex" flexDirection="row" alignItems="center" gap={2} data-testid={dtid}>
          <Fab
            size="small"
            sx={fabSx}
            onClick={onAddClick}
            data-testid="lat-add"
          >
            <AddIcon />
          </Fab>
          <Fab
            size="small"
            sx={fabSx}
            disabled={!removable}
            onClick={onRemoveClick}
            data-testid="lat-remove"
          >
            <RemoveIcon />
          </Fab>
        </Box>
        {children}
      </Box>
    </Slide>
  );
}
