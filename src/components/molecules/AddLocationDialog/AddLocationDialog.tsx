import React, { useCallback, useRef, useState } from "react";

import MessageDialog, { DialogActionHandler } from "@/components/atoms/MessageDialog";
import Box from "@mui/material/Box";

import NameTextField from "./fields/NameTextField";
import TechLevelTextField from "./fields/TechLevelTextField";
import { LocationDialogFieldHandles } from "./fields/utils";
import XCoordTextField from "./fields/XCoordTextField";
import YCoordTextField from "./fields/YCoordTextField";

interface AddLocationDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreate: (loc: {
    name: string;
    tl: number;
    x: number;
    y: number;
  }) => void;
}

// FIXME refactor into sub-components
export default function AddLocationDialog({
  open,
  onClose,
  onCreate,
}: AddLocationDialogProps) {

  console.log("Rendering AddLocationDialog...");

  const nameRef = useRef<LocationDialogFieldHandles>(null);
  const tlRef = useRef<LocationDialogFieldHandles>(null);
  const xRef = useRef<LocationDialogFieldHandles>(null);
  const yRef = useRef<LocationDialogFieldHandles>(null);

  const [allValid, setAllValid] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    nameRef.current?.reset();
    tlRef.current?.reset();
    xRef.current?.reset();
    yRef.current?.reset();
    nameRef.current?.focus();
    onClose();
  }, [onClose]);

  const validityChanged = () => {
    setAllValid(!!(nameRef.current?.isValid() &&
      tlRef.current?.isValid() &&
      xRef.current?.isValid() &&
      yRef.current?.isValid()));
  };

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const handleCreate = () => {
    if (allValid) {
      onCreate({
        name: nameRef.current!.getValue(),
        tl: Number.parseInt(tlRef.current!.getValue()),
        x: Number.parseInt(xRef.current!.getValue()),
        y: Number.parseInt(yRef.current!.getValue()),
      });
    }
  };
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  const handleAction = useCallback<DialogActionHandler>(
    (result) => {
      if (result.reason === "Create") {
        handleCreate();
      }
      handleClose();
    },
    [handleClose, handleCreate]
  );

  const buttons = ["Cancel", "Create"];
  const disabledButtons = allValid ? [] : ["Create"];

  return (
    <MessageDialog
      open={open}
      message="Enter the new location's details."
      title="Add Location"
      buttons={buttons}
      disabledButtons={disabledButtons}
      onAction={handleAction}
      data-testid="add-location-dialog"
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <NameTextField ref={nameRef} onValidityChange={validityChanged} />
        <TechLevelTextField ref={tlRef} onValidityChange={validityChanged} />
        <Box display="flex" justifyContent="space-between" gap={2}>
          <XCoordTextField ref={xRef} onValidityChange={validityChanged} />
          <YCoordTextField ref={yRef} onValidityChange={validityChanged} />
        </Box>
      </Box>
    </MessageDialog>
  );
}
