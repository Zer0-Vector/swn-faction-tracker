import { useLocation } from "react-router-dom";

interface SelectionIds {
  factionId: string;
  assetId: string;
  locationId: string;
}

export function useSelectionId(): Partial<SelectionIds> {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  return {
    factionId: pathParts.length > 2 && pathParts[1] === "factions" ? pathParts[2] : undefined,
    assetId:  pathParts.length > 4 && pathParts[1] === "factions" && pathParts[3] === "assets" ? pathParts[4] : undefined,
    locationId: pathParts.length > 2 && pathParts[1] === "locations" ? pathParts[2] : undefined,
  };
}
