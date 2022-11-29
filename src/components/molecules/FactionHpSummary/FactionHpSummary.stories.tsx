import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionHpSummary from "./FactionHpSummary";

export default {
  component: FactionHpSummary,
} as ComponentMeta<typeof FactionHpSummary>;

const Template: ComponentStory<typeof FactionHpSummary> = args => {
  const [hp, setHp] = useState<number>(args.hp);
  
  return (
    <GameContext.Provider value={{
      state: {} as IGameState,
      controller: {
        updateHp: (_, hp) => setHp(hp),
      } as IGameController,
    }}>
      <FactionHpSummary {...args} hp={hp} />
    </GameContext.Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  factionId: "test123",
  hp: 11,
  maxHp: 12,
};
