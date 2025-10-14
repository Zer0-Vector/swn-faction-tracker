import React from "react";

import Typography, { TypographyProps } from "@mui/material/Typography";

import TestableProps from "../../../types/TestableProps";

type StatTextProps = TypographyProps
  & Required<Pick<TypographyProps, "children">> & {
    component?: React.ElementType;
  } & TestableProps;

export default function StatText(props: StatTextProps) {
  return (
    <>
      <Typography
        variant="body2"
        component="span"
        color="text.primary"
        {...props}
        data-testid={props["data-testid"]}
      >
        {props.children}
      </Typography>
    </>
  );
}
