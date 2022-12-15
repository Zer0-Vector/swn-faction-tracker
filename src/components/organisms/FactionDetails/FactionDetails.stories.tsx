import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { TagsList } from "../../../data/Tags";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockActionController } from "../../__mocks__/MockActionController";

import FactionDetails from "./FactionDetails";

const locations = [
  {
    id: "location-1",
    name: "Location 1",
    tl: 1, x: 2, y: 3,
  },
  {
    id: "location-2",
    name: "Location 2",
    tl: 4, x: 5, y: 6,
  },
];

const MockProvider = ({ children }: RequiredChildrenProps) => (
  <GameContext.Provider value={{
    controller: MockActionController,
    state: {
      getLocations() {
        return locations;
      },
      getLocation(locationId: string) {
        return locations.find(loc => loc.id === locationId);
      },
    } as IGameState,
  }}>
    {children}
  </GameContext.Provider>
);

export default {
  component: FactionDetails,
  decorators: [
    story => (
      <MockProvider>
        {story()}
      </MockProvider>
    ),
  ],
} as ComponentMeta<typeof FactionDetails>;

const Template: ComponentStory<typeof FactionDetails> = args => <FactionDetails {...args} />;

export const NoGoal = Template.bind({});
NoGoal.args = {
  faction: {
    slug: "test-faction",
    name: "Test Faction",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    },
  },
};

export const WithGoal = Template.bind({});
WithGoal.args = {
  faction: {
    slug: "test-faction",
    name: "Test Faction",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    },
    goal: {
      type: "Wealth of Worlds",
    },
  },
};

export const Full = Template.bind({});
Full.args = {
  faction: {
    slug: "test-faction",
    name: "Test Faction",
    stats: {
      cunning: 1,
      force: 2,
      hp: 3,
      maxHp: 4,
      wealth: 5,
      xp: 6,
    },
    goal: {
      type: "Wealth of Worlds",
      tally: 2,
      target: 3,
      reward: 11,
      unit: "FacCred",
    },
    tag: TagsList[2],
    homeworldId: "location-1",
  },
};
