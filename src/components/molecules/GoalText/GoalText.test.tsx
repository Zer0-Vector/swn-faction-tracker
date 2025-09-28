import React from "react";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../types/FactionInfo";
import GoalInfo from "../../../types/GoalInfo";
import GoalType from "../../../types/GoalType";
import { Maybe } from "../../../types/Maybe";
import UiState from "../../../types/UiState";

import GoalText from "./GoalText";

const mockSetGoal = jest.fn();
const mockContext = {
  factions: {
    update: mockSetGoal as FactionPoset['update'],
  } as FactionPoset,
} as FactionContextType;

function renderIt(goalType: Maybe<GoalType> = undefined) {
  render(
    <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      <FactionContext.Provider value={mockContext}>
        <GoalText faction={{
            slug: "test-faction",
            goal: {
              type: goalType,
            } as GoalInfo,
          } as FactionInfo}
        />
      </FactionContext.Provider>
    </UiStateContext.Provider>
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
    const selection = options[0];
    fireEvent.click(selection);

    await waitFor(() => expect(mockSetGoal).toBeCalledTimes(1), { timeout: 2000 });
    expect(mockSetGoal).toBeCalledWith(undefined, "goal", { type: selection.textContent });
  });
});
