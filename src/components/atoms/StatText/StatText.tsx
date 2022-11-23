import React from "react";

import Typography, { TypographyProps } from "@mui/material/Typography";

import TestableProps from "../../../types/TestableProps";

type StatTextProps = TypographyProps & { component?: React.ElementType } & TestableProps;

export default function StatText(props: StatTextProps) {
  return (
    <>
      <Typography
        variant="body2"
        component="span"
        {...props}
        data-testid={props["data-testid"]}
      >
        {props.children}
      </Typography>
    </>
  );
}
