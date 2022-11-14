import React from "react";

import MuiLink from "@mui/material/Link";

interface LinkProps {
  children: React.ReactNode;
}

const Link = ({ children }: LinkProps) => {
  return (
    <MuiLink sx={{ "&:hover": { cursor: "pointer" } }}>{children}</MuiLink>
  );
};

export default Link;
