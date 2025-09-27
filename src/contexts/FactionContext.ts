import React from "react";

import FactionInfo from "../types/FactionInfo";
import { INamedElementPoset } from "../types/NamedElementPoset";

export type FactionPoset = INamedElementPoset<FactionInfo>;

export interface FactionContextType {
  factions: FactionPoset;
}

export const FactionContext = React.createContext({} as FactionContextType);

export const useFactions = () => {
  const ctx = React.useContext(FactionContext);
  if (!ctx) throw new Error("useFactions must be used within a FactionContextProvider");
  return ctx.factions;
};
