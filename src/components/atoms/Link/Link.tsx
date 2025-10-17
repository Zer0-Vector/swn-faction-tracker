import React from "react";

import MuiLink from "@mui/material/Link";

import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import TestableProps from "../../../types/TestableProps";

export interface LinkProps extends TestableProps, RequiredChildrenProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Link = ({ children, onClick, "data-testid": dtid }: LinkProps) => {
  return (
    <MuiLink
      onClick={onClick}
      sx={{ "&:hover": { cursor: "pointer" } }}
      data-testid={dtid}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
