import React from "react";

import MuiLink from "@mui/material/Link";

interface LinkProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  "data-testid"?: string;
}

const Link = ({ children, onClick, "data-testid": dtid }: LinkProps) => {
  return (
    <MuiLink onClick={onClick} sx={{ "&:hover": { cursor: "pointer" } }} data-testid={dtid}>{children}</MuiLink>
  );
};

export default Link;
