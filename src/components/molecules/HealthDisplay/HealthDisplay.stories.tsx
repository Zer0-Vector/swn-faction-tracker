import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockAction } from "../../__tests__/MockAction";

import HealthDisplay from "./HealthDisplay";

export default {
  component: HealthDisplay,
  decorators: [
    story => (
      <div style={{ padding: 10, margin: 10 }}>
        {story()}
      </div>
    ),
    story => (
      <GameContext.Provider value={{
        state: {} as IGameState,
        controller: {
          ...MockAction("updateHp"),
        } as unknown as IGameController,
      }}>
        {story()}
      </GameContext.Provider>
    ),
  ],
} as ComponentMeta<typeof HealthDisplay>;

const Template: ComponentStory<typeof HealthDisplay> = args => <HealthDisplay {...args} />;

export const Default = Template.bind({});
Default.args = {
  factionId: "test",
  hp: 5,
  maxHp: 7,
};

export const Full = Template.bind({});
Full.args = {
  factionId: "test",
  hp: 7,
  maxHp: 7,
};

export const Empty = Template.bind({});
Empty.args = {
  factionId: "test",
  hp: 0,
  maxHp: 7,
};
