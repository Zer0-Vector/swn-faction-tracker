import React, { useContext, useState } from "react";

import StarsIcon from "@mui/icons-material/AutoAwesome";
import EllipsisIcon from "@mui/icons-material/MoreHoriz";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";

import { UiStateContext } from "../../../contexts/UiStateContext";

interface TurnPhase {
  name: string;
  icon?: JSX.Element;
  // showUi: () => void;
  // completed: boolean;
}

const phases: TurnPhase[] = [
  {
    name: "Select Faction",
  },
  {
    name: "Set Goal",
  },
  {
    name: "Select Action",
    icon: React.createElement(StarsIcon),
  },
  {
    name: "",
    icon: React.createElement(EllipsisIcon),
  },
];

export function TurnPhaseStepper() {
  const { state, controller } = useContext(UiStateContext);
  return (
    <Stepper activeStep={0}>
      {phases.map(n => (
        <Step key={n.name}>
          <StepButton icon={n.icon}>
            {n.name}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
}
