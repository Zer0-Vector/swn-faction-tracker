import React from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";


export const Item = React.memo(styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  placeContent: "center",
})));

export const ItemHeader = React.memo(styled(Item)(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: "bold",
  textAlign: "right",
})));
