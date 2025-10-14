import React from "react";

import { IValidationController } from "../types/IValidationController";

export const ValidationContext = React.createContext(
  {} as IValidationController
);
