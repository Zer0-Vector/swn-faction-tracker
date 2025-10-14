import React from "react";

import FactionInfo from "../utils/FactionInfo";
import { NamedElementPoset } from "../utils/NamedElementPoset";

export class FactionPoset extends NamedElementPoset<FactionInfo> {
  constructor(elements: FactionInfo[] = []) {
    super(FactionInfo.from, elements);
  }
}

export interface FactionContextType {
  factions: FactionPoset;
}

export const FactionContext = React.createContext({} as FactionContextType);

export const useFactions = () => {
  const ctx = React.useContext(FactionContext);
  if (!ctx)
    throw new Error("useFactions must be used within a FactionContextProvider");
  return React.useSyncExternalStore(
    ctx.factions.subscribe.bind(ctx.factions),
    () => ctx.factions
  );
};
