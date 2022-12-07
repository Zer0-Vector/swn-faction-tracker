import React, { useCallback, useMemo } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { ModalProps } from "@mui/material/Modal";
import { SxProps, Theme } from "@mui/material/styles";
import { SystemStyleObject } from "@mui/system/styleFunctionSx";

import TestableProps from "../../../types/TestableProps";

export type DialogActionHandler = (action: "CLOSE" | "BUTTON", reason: string) => void;

interface MessageDialogProps extends TestableProps {
  open: boolean;
  title: string;
  message: string;
  closeable?: boolean;
  modal?: boolean;
  onAction: DialogActionHandler;
  buttons?: string[];
  children?: React.ReactNode;
  fullWidth?: boolean;
  disabledButtons?: string[];
}

const MessageDialog = ({ 
  open,
  title,
  message,
  onAction,
  buttons,
  disabledButtons = [],
  closeable = true,
  modal = true,
  fullWidth = true,
  children,
  "data-testid": dtid,
}: MessageDialogProps) => {
  const handleButtonClick = useCallback((button: string, event: React.SyntheticEvent) => {
    event.stopPropagation();
    onAction("BUTTON", button);
  }, [onAction]);

  const handleCloseClick = useCallback((event: React.SyntheticEvent) => {
    event.stopPropagation();
    onAction("CLOSE", "closeButton");
  }, [onAction]);

  type JustHandleClose = Exclude<ModalProps['onClose'], undefined>;
  const handleClose = useCallback<JustHandleClose>((_, reason) => {
    if (!modal) {
      onAction("CLOSE", reason);
    }
  }, [modal, onAction]);

  const buttonsClickHandlers = useMemo(() => (
    buttons?.map(b => (evt: React.SyntheticEvent) => handleButtonClick(b, evt)) || []
  ), [buttons, handleButtonClick]);

  const renderedButtons = useMemo(() => (
    buttons?.map((b, i) => <Button key={b} disabled={disabledButtons.includes(b)} onClick={buttonsClickHandlers[i]}>{b}</Button>)
  ), [buttons, buttonsClickHandlers, disabledButtons]);

  const closeButtonSx = useMemo<SxProps<Theme>>(() => ({
    position: "absolute",
    right: theme => theme.spacing(1),
    top: theme => theme.spacing(1),
    color: theme => theme.palette.grey[500],
  }), []);

  type JustSxFunc = (theme: Theme) => SystemStyleObject<Theme>;
  const contentTextSx = useCallback<JustSxFunc>(theme => ({
    marginBottom: theme.spacing(1.5),
  }), []);

  const closeButton = useMemo(() => (
    closeable
    ? (
      <IconButton onClick={handleCloseClick} size="small" sx={closeButtonSx} data-testid="message-dialog-close-button">
        <CloseIcon fontSize="small" />
      </IconButton>
    ) : null
  ), [closeButtonSx, closeable, handleCloseClick]);

  return (
    <Dialog open={open} fullWidth={fullWidth} maxWidth="xs" onClose={handleClose} data-testid={dtid}>
      <DialogTitle data-testid="message-dialog-title">
        {title}
        {closeButton}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={contentTextSx} data-testid="message-dialog-message">{message}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions data-testid="message-dialog-actions">
        {renderedButtons}
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
