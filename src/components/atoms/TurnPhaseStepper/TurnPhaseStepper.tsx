import React, { useState } from "react";

import StarsIcon from "@mui/icons-material/AutoAwesome";
import EllipsisIcon from "@mui/icons-material/MoreHoriz";
import Icon from "@mui/material/Icon";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";

interface GamePhase {
  name: string;
  icon?: JSX.Element;
}

interface HoverIconProps {
  normal: JSX.Element;
  hover: JSX.Element;
}

const HoverIcon = ({ normal, hover }: HoverIconProps) => {
  const [shownIcon, setShownIcon] = useState(normal);
  return (
    <Icon
      onMouseEnter={() => setShownIcon(hover)}
      onMouseLeave={() => setShownIcon(normal)}
    >
      {shownIcon}
    </Icon>
  );
};

const ActionIcon = () => (
  <HoverIcon normal={<StarsIcon />} hover={<EllipsisIcon />} />
);

const phases: GamePhase[] = [
  {
    name: "Set Goal",
  },
  {
    name: "Select Action",
  },
  {
    name: "Resolve Action",
  },
];

export function TurnPhaseStepper() {
  return (
    <Stepper nonLinear={true} activeStep={2}>
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
