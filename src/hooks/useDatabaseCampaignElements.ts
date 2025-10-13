import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { AssetPoset } from "../contexts/AssetContext";
import { FactionPoset } from "../contexts/FactionContext";
import { LocationsPoset } from "../contexts/LocationContext";
import { Prettify } from "../types/Prettify";
import { Serialized } from "../types/Serialized";
import { Identifiable } from "../types/SluggedEntity";
import FactionInfo from "../utils/FactionInfo";
import LocationInfo from "../utils/LocationInfo";
import { Named } from "../utils/NamedElementPoset";
import PurchasedAsset from "../utils/PurchasedAsset";

import { useAuth } from "./useAuth";
import { useFirestore } from "./useFirestore";

type SectorInfo = Prettify<Named<{
  description?: string,
  width?: number,
  height?: number,
}>>;

export type CampaignInfo = Prettify<Named<Identifiable> & {
  description?: string,
  sector?: SectorInfo,
}>;

export interface CampaignElements {
  campaign: CampaignInfo,
  factions: FactionPoset,
  locations: LocationsPoset,
  assets: AssetPoset,
}

interface CampaignElementsWrapper { elements: CampaignElements }

type SerializedElement =
    | Serialized<PurchasedAsset, "asset">
    | Serialized<FactionInfo, "faction">
    | Serialized<LocationInfo, "location">

// FIXME: draft implementation of useDatabaseCampaignElements
export const useDatabaseCampaignElements = (campaignId: string = "(default)"): CampaignElementsWrapper => {
  const db = useFirestore();
  const auth = useAuth();
  const [campaignData, setCampaignData] = useState<CampaignElementsWrapper>({} as CampaignElementsWrapper);

  useEffect(() => {
    let isMounted = true;

    const uid = auth.currentUser?.uid;
    if (isMounted && uid) {
      const elements: Omit<CampaignElements, "campaign"> & Partial<Pick<CampaignElements, "campaign">> = {
        factions: new FactionPoset(),
        locations: new LocationsPoset(),
        assets: new AssetPoset(),
      };
      getDoc(doc(db, "users", uid, "campaigns", campaignId))
          .then(ss => {
            elements.campaign = ss.data() as CampaignInfo;
          })
          .catch(reason => {
            console.error("Failed to fetch campaign info: ", reason);
          })
          .then(() => getDocs(collection(db, `/users/${uid}/campaigns/${campaignId}/elements`)))
          .then(ss => {
            ss.forEach(doc => {
              const docData = doc.data() as SerializedElement;
              switch(docData.type) {
                case "faction":
                  elements.factions.add(docData);
                  break;
                case "location":
                  elements.locations.add(docData);
                  break;
                case "asset":
                  elements.assets.add(docData);
                  break;
                default:
                  console.warn("Unknown element type: ", docData);
              }
            });
            setCampaignData({ elements: elements as CampaignElements });
          })
          .catch(reason => {
            console.error("Failed to fetch campaign elements: ", reason);
          });
    }

    return () => {
      isMounted = false;
    }
  }, [db, auth.currentUser]);

  return campaignData;
}
