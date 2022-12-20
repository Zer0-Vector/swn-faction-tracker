import React from "react";

import { AssetContextProvider } from "./AssetContextProvider";
import { FactionContextProvider } from "./FactionContextProvider";
import { LocationContextProvider } from "./LocationContextProvider";


export function DataProvider({ children }: React.PropsWithChildren<{}>) {
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
