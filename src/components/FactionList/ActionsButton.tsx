import React, { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import Divider from "@mui/material/Divider";

type ActionsButtonProps = {
  onRemove: ()=>void,
}

export default function ActionsButton({ onRemove }: ActionsButtonProps) {
  const [menuOpened, setMenuOpened] = useState(false);
  const anchorEl = useRef(null);
  return (
    <>
      <IconButton onClick={() => setMenuOpened(prev => !prev)} ref={anchorEl}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl.current} open={menuOpened} onClose={() => setMenuOpened(false)}>
        <MenuItem onClick={() => { setMenuOpened(false); onRemove(); }}>Remove</MenuItem>
      </Menu>
    </>
  );
}