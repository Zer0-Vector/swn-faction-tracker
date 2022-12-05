import React, { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, Story } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { TagsList } from "../../../data/Tags";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import FactionInfo from "../../../types/FactionInfo";
import { GoalTypes } from "../../../types/GoalType";
import PurchasedAsset from "../../../types/PurchasedAsset";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockActionController } from "../../__mocks__/MockActionController";

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
  <GameContext.Provider value={{
    state: {
      getFactions() {
        return factions;
      },
      getFaction(factionId) {
        return factions.find(f => f.id === factionId);
      },
      getLocations() {
        return locations;
      },
      getLocation(locationId) {
        return locations.find(loc => loc.id === locationId);
      },
      getAssets(factionId) {
        return [] as PurchasedAsset[];
      },
    } as IGameState,
    controller: MockActionController,
  }}>
    {children}
  </GameContext.Provider>
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
      id: `faction-${n}`,
      name: `Faction ${n}`,
      stats: {
        cunning: n % 3,
        force: n % 4,
        hp: n % 10,
        maxHp: n % 5 + 1,
        wealth: n % 5,
        xp: 0,
      },
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
