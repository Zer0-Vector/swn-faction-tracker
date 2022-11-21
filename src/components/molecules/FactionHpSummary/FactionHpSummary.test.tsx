import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import FactionStatsInfo from "../../../types/FactionStatsInfo";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import FactionHpSummary from "./FactionHpSummary";

const mockContext = {
  state: {
    getFaction: jest.fn() as (fid: string)=>Maybe<FactionInfo>,
  } as IGameState,
  controller: {
    updateHp: jest.fn() as (id: string, hp: number)=>void,
  } as IGameController,
} as GameContextType;


function doMock() {
  const mock = mockContext.state.getFaction as jest.MockedFn<typeof mockContext.state.getFaction>;
  mock.mockImplementationOnce((_:string) => ({
    stats: {
      hp: 123,
      maxHp: 456,
    } as FactionStatsInfo
  } as FactionInfo));
}

function renderIt(factionId = "tf123") {
  render(
    <GameContext.Provider value={mockContext}>
      <FactionHpSummary data-testid="test123" factionId={factionId} />
    </GameContext.Provider>
  );
}

describe('<FactionHpSummary />', () => {
  it('renders default value when faction does not exist', () => {
    renderIt("not-here");
    const summary = screen.getByTestId("test123");
    expect(summary).toBeInTheDocument();
    expect(summary.textContent).toEqual("??/??");
  });
  
  it('renders hp and maxHp when faction exists', () => {
    doMock();
    renderIt();
    expect(mockContext.state.getFaction).toBeCalledTimes(1);
    expect(mockContext.state.getFaction).toBeCalledWith("tf123");
    const hp = screen.getByTestId("test123-hp");
    expect(hp).toBeInTheDocument();
    expect(hp.textContent).toEqual("123");

    const maxHp = screen.getByTestId("test123-maxhp");
    expect(maxHp).toBeInTheDocument();
    expect(maxHp.textContent).toEqual("456");
  });

  it('renders TextField after double click on hp', () => {
    doMock();
    renderIt();

    const hp = screen.getByTestId("test123-hp");
    expect(hp).toBeInTheDocument();
    fireEvent.doubleClick(hp);

    const textfield = screen.getByTestId("test123-hp-textfield");
    expect(textfield).toBeInTheDocument();
    expect(textfield).toBeInstanceOf(HTMLDivElement);
    expect(textfield).toHaveClass("MuiTextField-root");
  });

  it.todo('does not accept invalid hp values');
  it.todo('updates hp on Enter and valid value');
});
