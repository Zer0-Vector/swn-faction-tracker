import React from "react";

import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Tooltip from "@mui/material/Tooltip";

import { useTurnPhases } from "./useTurnPhases";

export function TurnPhaseStepper() {
  const { index, phases } = useTurnPhases();

  return (
    <Stepper activeStep={index}>
      {phases.map((phase, i) => (
        <Step key={phase.name}>
          <Tooltip title={phase.title} enterDelay={300}>
            <div>
              {/* needed for tooltip display over disabled button */}
              <StepButton
                icon={phase.icon}
                onClick={phase.onClick}
                disabled={i < index ? true : undefined}
              >
                {phase.name}
              </StepButton>
            </div>
          </Tooltip>
        </Step>
      ))}
    </Stepper>
  );
}
