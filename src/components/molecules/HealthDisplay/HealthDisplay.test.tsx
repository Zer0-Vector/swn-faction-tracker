import React from "react";

import { render } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import HealthDisplay from "./HealthDisplay";

const mockContext = {
  state: {
    getFaction: jest.fn() as (f: string)=>FactionInfo,
  } as IGameState,
  controller: {} as IGameController,
} as GameContextType;

function renderIt() {
  render(
    <GameContext.Provider value={mockContext}>
      <HealthDisplay factionId="testFactionId" />
    </GameContext.Provider>
  );
}

describe('HealthDisplay', () => {
  it.todo('renders faction hp and maxHp');
  it.todo('render tooltip on hover');
});
