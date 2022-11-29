import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import FactionStatsInfo from "../../../types/FactionStatsInfo";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionHpSummary from "./FactionHpSummary";

const mockContext = {
  state: {} as IGameState,
  controller: {
    updateHp: jest.fn() as (id: string, hp: number)=>void,
  } as IGameController,
} as GameContextType;

function renderIt(factionId = "tf123") {
  render(
    <GameContext.Provider value={mockContext}>
      <FactionHpSummary data-testid="test123" hp={123} maxHp={456} factionId={factionId} />
    </GameContext.Provider>
  );
}

describe('<FactionHpSummary />', () => {
  it('renders hp and maxHp when faction exists', () => {
    renderIt();
    const box = screen.getByTestId("faction-hp-box");
    const hp = within(box).getByTestId("hp");
    expect(hp).toBeInTheDocument();
    expect(hp.textContent).toEqual("123");

    const maxHp = within(box).getByTestId("maxhp");
    expect(maxHp).toBeInTheDocument();
    expect(maxHp.textContent).toEqual("456");
  });

  it('renders TextField after double click on hp', () => {
    renderIt();

    const box = screen.getByTestId("faction-hp-box");

    const hp = within(box).getByTestId("hp");
    expect(hp).toBeInTheDocument();
    fireEvent.doubleClick(hp);

    const textfield = within(box).getByTestId("hp-textfield");
    expect(textfield).toBeInTheDocument();
    expect(textfield).toBeInstanceOf(HTMLDivElement);
    expect(textfield).toHaveClass("MuiTextField-root");
  });
  
  it('updates hp on Enter and valid value', () => {
    renderIt();
    const box = screen.getByTestId("faction-hp-box");

    const hp = within(box).getByTestId("hp");
    fireEvent.doubleClick(hp);
    const tfDiv = screen.getByTestId("hp-textfield");
    expect(tfDiv).toBeInTheDocument();

    const textfield = within(tfDiv).getByDisplayValue("123");
    expect(textfield).toBeInTheDocument();
    expect(textfield).toBeInstanceOf(HTMLInputElement);
    fireEvent.input(textfield, { target: { value: "321" } });
    fireEvent.keyUp(textfield, { key: "Enter" });
    expect(textfield).not.toBeInTheDocument();
    expect(mockContext.controller.updateHp).toBeCalledTimes(1);
    expect(mockContext.controller.updateHp).toBeCalledWith("tf123", 321);
  });
});
