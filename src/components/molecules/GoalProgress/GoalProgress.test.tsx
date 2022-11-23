import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import GoalInfo from "../../../types/GoalInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import GoalProgress from "./GoalProgress";

const mockSetGoal = jest.fn();
const mockContext: GameContextType = {
  state: {} as IGameState,
  controller: {
    setGoal: mockSetGoal as (f: string, g: GoalInfo)=>void,
  } as IGameController,
};

const mockFaction = {
  id: "test-faction",
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
  it('renders faction goal', () => {
    renderIt();
    const theSpan = screen.getByTestId("goal-progress");
    expect(theSpan).toBeInTheDocument();

    const prog = within(theSpan).getByTestId("goal-tally");
    expect(prog).toBeInTheDocument();
    expect(prog.textContent).toEqual("11");

    const targ = within(theSpan).getByTestId("goal-target");
    expect(targ).toBeInTheDocument();
    expect(targ.textContent).toEqual("22");
  });

  it('calls controller when tally is updated', () => {
    renderIt();
    const prog = screen.getByTestId("goal-tally");
    fireEvent.doubleClick(prog);
    const progTf = screen.getByTestId("goal-tally-textfield");
    expect(progTf).toBeInTheDocument();
    const progTfInput = within(progTf).getByDisplayValue("11");
    expect(progTfInput).toBeInTheDocument();
    expect(progTfInput).toBeInstanceOf(HTMLInputElement);
    
    fireEvent.input(progTfInput, { target: { value: "332211" } });
    fireEvent.keyUp(progTfInput, { key: "Enter" });
    expect(mockSetGoal).toBeCalledTimes(1);
    expect(mockSetGoal).toBeCalledWith("test-faction", {
      tally: 332211,
      target: expect.anything(),
    });
  });

  it('calls controller when target is updated', () => {
    renderIt();
    const targ = screen.getByTestId("goal-target");
    fireEvent.doubleClick(targ);
    const targTf = screen.getByTestId("goal-target-textfield");
    expect(targTf).toBeInTheDocument();
    const targTfInput = within(targTf).getByDisplayValue("22");
    expect(targTfInput).toBeInTheDocument();
    expect(targTfInput).toBeInstanceOf(HTMLInputElement);
    
    fireEvent.input(targTfInput, { target: { value: "332211" } });
    fireEvent.keyUp(targTfInput, { key: "Enter" });
    expect(mockSetGoal).toBeCalledTimes(1);
    expect(mockSetGoal).toBeCalledWith("test-faction", {
      tally: expect.anything(),
      target: 332211,
    });
  });
});
