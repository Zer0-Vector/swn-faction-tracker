import React from "react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import GoalInfo from "../../../types/GoalInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import GoalText from "./GoalText";

const mockFaction = {
  goal: {
    type: "Destroy the Foe",
  } as GoalInfo,
} as FactionInfo;

const mockContext = {
  state: {} as IGameState,
  controller: {
    setGoal: jest.fn() as (f: string, g: GoalInfo)=>void,
  } as IGameController,
} as GameContextType;

function renderIt() {
  return (
    <GameContext.Provider value={mockContext}>
      <GoalText faction={mockFaction} />
    </GameContext.Provider>
  );
}

describe('GoalText', () => {
  it.todo('renders "None" when goal not set');
  it.todo('renders goal text when goal is set');
  it.todo('calls controller when goal is updated');
});
