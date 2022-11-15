import React from "react";

import MuiLink from "@mui/material/Link";

interface LinkProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Link = ({ children, onClick }: LinkProps) => {
  return (
    <MuiLink onClick={onClick} sx={{ "&:hover": { cursor: "pointer" } }}>{children}</MuiLink>
  );
};

export default Link;
