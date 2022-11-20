import React from "react";

import { render } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import GoalInfo from "../../../types/GoalInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import GoalProgress from "./GoalProgress";

const mockContext: GameContextType = {
  state: {} as IGameState,
  controller: {
    setGoal: jest.fn() as (f: string, g: GoalInfo)=>void,
  } as IGameController,
};

const mockFaction = {
  goal: {
    tally: 11,
    target: 22,
  } as GoalInfo,
} as FactionInfo;

function renderIt() {
  render(
    <GameContext.Provider value={mockContext}>
      <GoalProgress faction={mockFaction} />
    </GameContext.Provider>
  );
}

describe('GoalProgress', () => {
  it.todo('renders faction goal');
  it.todo('calls controller when tally is updated');
  it.todo('calls controller when target is updated');
});
