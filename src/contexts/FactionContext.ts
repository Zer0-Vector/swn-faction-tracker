import React from "react";

import FactionInfo from "../types/FactionInfo";
import { INamedElementPoset } from "../types/NamedElementPoset";

export type FactionPoset = INamedElementPoset<FactionInfo>;

export interface FactionContextType {
  factions: FactionPoset;
}

export const FactionContext = React.createContext<FactionContextType>({} as FactionContextType);
