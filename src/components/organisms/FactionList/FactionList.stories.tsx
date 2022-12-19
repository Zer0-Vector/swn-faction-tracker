import React, { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, Story } from "@storybook/react";

import { AssetContext, AssetPoset } from "../../../contexts/AssetContext";
import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { LocationContext, LocationsPoset } from "../../../contexts/LocationContext";
import { TagsList } from "../../../data/Tags";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import FactionInfo from "../../../types/FactionInfo";
import { GoalTypes } from "../../../types/GoalType";
import PurchasedAsset from "../../../types/PurchasedAsset";

import FactionList from "./FactionList";

interface MockProviderProps extends RequiredChildrenProps {
  factions: FactionInfo[];
}

const locations = [
  {
    id: "loc-1",
    name: "Loc 1",
  },
  {
    id: "loc-2",
    name: "Loc 1",
  },
  {
    id: "loc-3",
    name: "Loc 1",
  },
];

const MockProvider = ({ children, factions }: MockProviderProps) => (
  // TODO wrap with LocationContext and insert AssetContext
  <LocationContext.Provider value={{
    locations: {
      getAll() {
        return locations;
      },
      get(locationId) {
        return locations.find(loc => loc.id === locationId);
      },
    } as LocationsPoset,
  }}>
    <FactionContext.Provider value={{
      factions: {
        getAll() {
          return factions;
        },
        get(factionId) {
          return factions.find(f => f.slug === factionId);
        },
      } as FactionPoset,
    }}>
      <AssetContext.Provider value={{
        assets: {
          getAll() {
            return [] as PurchasedAsset[];
          },
        } as AssetPoset,
      }}>
        {children}
      </AssetContext.Provider>
    </FactionContext.Provider>
  </LocationContext.Provider>
);

export default {
  component: FactionList,
  argTypes: {
    numberOfFactions: {
      type: {
        name: "number",
        required: true,
      },
    },
  },
  decorators: [
    story => (
      <MemoryRouter>
        {story()}
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof FactionList>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type AdditionalArgs = { numberOfFactions: number };

const Template: Story<ComponentProps<typeof FactionList> & AdditionalArgs> = (args) => (
  <MockProvider factions={
    [...Array(args.numberOfFactions).keys()].map(n => ({
      id: `${n}`,
      slug: `faction-${n}`,
      name: `Faction ${n}`,
      cunning: n % 3,
      force: n % 4,
      hp: n % 10,
      maxHp: n % 5 + 1,
      wealth: n % 5,
      xp: 0,
      goal: {
        type: GoalTypes[n % GoalTypes.length],
        tally: n % 6,
        target: n % 3,
      },
      tag: TagsList[n % TagsList.length],
    } as FactionInfo))
  }>
    <FactionList />
  </MockProvider>
);

export const Empty = Template.bind({});
Empty.args = {
  numberOfFactions: 0,
};

export const OneFaction = Template.bind({});
OneFaction.args = {
  numberOfFactions: 1,
};

export const TwoFactions = Template.bind({});
TwoFactions.args = {
  numberOfFactions: 2,
};

export const FiveFactions = Template.bind({});
FiveFactions.args = {
  numberOfFactions: 5,
};
