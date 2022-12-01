import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { TagsList } from "../../../data/Tags";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockActionController } from "../../__mocks__/MockActionController";

import FactionDetails from "./FactionDetails";

const MockProvider = ({ children }: { children: React.ReactNode }) => (
  <GameContext.Provider value={{
    controller: MockActionController,
    state: {
      getLocations() {
        return [
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
    id: "test-faction",
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
    id: "test-faction",
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
    id: "test-faction",
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
    tag: TagsList[Math.floor(Math.random() * TagsList.length)],
    homeworld: "Location 1",
  },
};
