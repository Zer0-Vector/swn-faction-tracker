import { useLocation } from "react-router-dom";

interface SelectionSlugs {
  factionSlug: string;
  assetSlug: string;
  locationSlug: string;
}

export function useSelectionSlug(): Partial<SelectionSlugs> {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  return {
    factionSlug:
      pathParts.length > 2 && pathParts[1] === "factions"
        ? pathParts[2]
        : undefined,
    assetSlug:
      pathParts.length > 4
      && pathParts[1] === "factions"
      && pathParts[3] === "assets"
        ? pathParts[4]
        : undefined,
    locationSlug:
      pathParts.length > 2 && pathParts[1] === "locations"
        ? pathParts[2]
        : undefined,
  };
}
