import React from "react";

import { render } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionStatSummary from "./FactionStatSummary";

const mockContext: GameContextType = {
  state: {} as IGameState,
  controller: {
    updateForce: jest.fn() as (f: string, v: number)=>void,
    updateCunning: jest.fn() as (f: string, v: number)=>void,
    updateWealth: jest.fn() as (f: string, v: number)=>void,
  } as IGameController,
};

function renderIt() {
  render(
    <GameContext.Provider value={mockContext}>
      <FactionStatSummary factionId="test" force={11} cunning={22} wealth={33} />
    </GameContext.Provider>
  );
}

describe('FactionStatSummary', () => {
  it.todo('renders given stats');
  it.todo('calls controller on update force');
  it.todo('calls controller on update cunning');
  it.todo('calls controller on update wealth');
});
