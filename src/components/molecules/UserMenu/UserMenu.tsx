import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { User } from "firebase/auth";

import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { UiStateContext } from "../../../contexts/UiStateContext";
import Nullable from "../../../types/Nullable";
import LoginDialog from "../LoginDialog";
import LogoutConfirmDialog from "../LogoutConfirmDialog";
import NeedsVerificationDialog from "../NeedsVerificationDialog";
import { PasswordResetDialog } from "../PasswordResetDialog";
import { PasswordResetErrorDialog } from "../PasswordResetErrorDialog";
import { PasswordResetSentDialog } from "../PasswordResetSentDialog";
import RegistrationDialog from "../RegistrationDialog";
import VerificationEmailErrorDialog from "../VerificationEmailErrorDialog";

interface UserMenuProps {
  readonly user: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const btnRef = useRef<Nullable<HTMLButtonElement>>(null);
  const { state: uiState, controller: uiController } = useContext(UiStateContext);

  const icon: JSX.Element = user === null ? <PersonOutlinedIcon /> : <PersonIcon />;

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLogin = useCallback(() => {
    handleClose();
    console.info("Logging in...");
    uiController.setLoginState("LOGGING_IN");
  }, [handleClose, uiController]);

  const handleLogout = useCallback(() => {
    handleClose();
    console.info("Logging out...");
    uiController.setLoginState("LOGGING_OUT");
  }, [handleClose, uiController]);

  const handleSettings = useCallback(() => {
    handleClose();
    console.info("Opening settings...");
    // TODO
  }, [handleClose]);

  const menuItems: JSX.Element[] = useMemo(() => {
    if (user === null) {
      return [<MenuItem key="0" onClick={handleLogin}>Login</MenuItem>];
    } else {
      return [
        <MenuItem key="1" onClick={handleSettings} disabled>Settings</MenuItem>,
        <MenuItem key="2" onClick={handleLogout}>Logout</MenuItem>,
      ];
    }
  }, [handleLogin, handleLogout, handleSettings, user]);

  // FIXME: rework this so we're not rendering elements that aren't shown
  const dialogItems: JSX.Element = useMemo(() => {
    if (user === null) {
      return (
        <>
          <LoginDialog />
          <RegistrationDialog />
          <PasswordResetDialog />
          <PasswordResetErrorDialog />
          <PasswordResetSentDialog />
        </>
      );
    } else {
      return (
        <>
          <NeedsVerificationDialog />
          <VerificationEmailErrorDialog />
          <LogoutConfirmDialog />
        </>
      );
    }
  }, [user]);

  const iconClickHandler = useCallback(() => setOpen(prev => !prev), []);
  const menuCloseHandler = useCallback(() => setOpen(false), []);

  console.debug("Rendering UserMenu... logged in? ", !!user);

  return (
    <div>
      <IconButton ref={btnRef} onClick={iconClickHandler}>
        {icon}
      </IconButton>
      <Menu open={open} anchorEl={btnRef.current} onClose={menuCloseHandler}>
        {menuItems}
      </Menu>
      {dialogItems}
    </div>
  );
}
