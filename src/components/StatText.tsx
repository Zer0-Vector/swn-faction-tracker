import Typography, { TypographyProps } from "@mui/material/Typography";
import React from "react";

type StatTextProps = TypographyProps;

export default function StatText(props: StatTextProps) {
  return (
    <>
      <Typography
        variant="body2"
        {...props}
        component="span"
      >
        {props.children}
      </Typography>
    </>
  );
}
