import React, { useContext, useMemo, useRef, useState } from "react";

import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { UiStateContext } from "../../contexts/UiStateContext";
import Nullable from "../../types/Nullable";

import LoginDialog from "./LoginDialog";


interface UserMenuProps {
  user: unknown | undefined;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const btnRef = useRef<Nullable<HTMLButtonElement>>(null);
  const { controller: uiController } = useContext(UiStateContext);

  const icon: JSX.Element = user === undefined ? <PersonOutlinedIcon /> : <PersonIcon />;

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    handleClose();
    console.info("Logging in...");
    uiController.setLoginState("LOGGING_IN");
  };

  const handleLogout = () => {
    handleClose();
    console.info("Logging out...");
    uiController.setLoginState("LOGGING_OUT");
  };

  const handleSettings = () => {
    handleClose();
    console.info("Opening settings...");
    // TODO
  };

  const menuItems: JSX.Element[] = useMemo(() => {
    const result: JSX.Element[] = [];
    if (user === undefined) {
      result.push(<MenuItem key="0" onClick={handleLogin}>Login</MenuItem>);
    } else {
      result.push(<MenuItem key="1" onClick={handleSettings}>Settings</MenuItem>);
      result.push(<MenuItem key="2" onClick={handleLogout}>Logout</MenuItem>);
    }
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  return (
    <div>
      <IconButton ref={btnRef} onClick={() => setOpen(prev => !prev)}>
        {icon}
      </IconButton>
      <Menu open={open} anchorEl={btnRef.current} onClose={() => setOpen(false)}>
        {menuItems}
      </Menu>
      <LoginDialog />
    </div>
  );
}
