import React from "react";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import GoalInfo from "../../../types/GoalInfo";
import GoalType from "../../../types/GoalType";
import { Maybe } from "../../../types/Maybe";
import { IGameState } from "../../../types/RuntimeGameState";

import GoalText from "./GoalText";

const mockSetGoal = jest.fn();
const mockContext = {
  state: {} as IGameState,
  controller: {
    setGoal: mockSetGoal as (f: string, g: GoalInfo)=>void,
  } as IGameController,
} as GameContextType;

function renderIt(goalType: Maybe<GoalType> = undefined) {
  render(
    <GameContext.Provider value={mockContext}>
      <GoalText faction={{
          id: "test-faction",
          goal: {
            type: goalType,
          } as GoalInfo,
        } as FactionInfo}
      />
    </GameContext.Provider>
  );
}

describe('GoalText', () => {
  it('renders "None" when goal not set', () => {
    renderIt();
    const text = screen.getByTestId("goal-text");
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent("None");
  });

  it('renders goal text when goal is set', () => {
    const goalType: GoalType = "Blood the Enemy";
    renderIt(goalType);
    const text = screen.getByTestId("goal-text");
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent(goalType);
  });

  it('calls controller when goal is updated', async () => {
    const goalType: GoalType = "Commercial Expansion";
    renderIt(goalType);
    const outer = screen.getByTestId("goal-text");
    const button = within(outer).getByTestId("editable-dropdown-button");
    fireEvent.click(button);

    const autocomplete = within(outer).getByTestId("editable-dropdown-autocomplete");
    expect(autocomplete).toBeInTheDocument();
    
    const listbox = within(outer).getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    const options = within(listbox).getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    const selection = options[Math.floor(Math.random() * options.length)];
    fireEvent.click(selection);

    await waitFor(() => expect(mockSetGoal).toBeCalledTimes(1));
    expect(mockSetGoal).toBeCalledWith("test-faction", { type: selection.textContent });
  });
});
