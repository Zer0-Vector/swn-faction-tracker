import React from "react";

import Typography, { TypographyProps } from "@mui/material/Typography";

type StatTextProps = TypographyProps & { component?: React.ElementType };

export default function StatText(props: StatTextProps) {
  return (
    <>
      <Typography
        variant="body2"
        component="span"
        {...props}
      >
        {props.children}
      </Typography>
    </>
  );
}
