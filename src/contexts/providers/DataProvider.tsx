import React from "react";

import { ReadonlyPropsWithChildren } from "../../types/ReadonlyPropsWithChildren";

import { AssetContextProvider } from "./AssetContextProvider";
import { FactionContextProvider } from "./FactionContextProvider";
import { LocationContextProvider } from "./LocationContextProvider";


export function DataProvider({ children }: ReadonlyPropsWithChildren) {
  // the ordering here matters. child providers depend on parents.
  return (
    <LocationContextProvider>
      <FactionContextProvider>
        <AssetContextProvider>
          {children}
        </AssetContextProvider>
      </FactionContextProvider>
    </LocationContextProvider>
  );
}
