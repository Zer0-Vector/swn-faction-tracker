import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../types/FactionInfo";
import GoalInfo from "../../../types/GoalInfo";
import UiState from "../../../types/UiState";

import GoalProgress from "./GoalProgress";

const mockSlugGet = jest.fn() as jest.MockedFn<FactionPoset['slugGet']>;
const mockUpdate = jest.fn() as jest.MockedFn<FactionPoset['update']>;
const mockContext: FactionContextType = {
  factions: {
    slugGet: mockSlugGet as FactionPoset['slugGet'],
    update: mockUpdate as FactionPoset['update'],
  } as FactionPoset,
};

const mockFaction = {
  slug: "test-faction",
  goal: {
    tally: 11,
    target: 22,
  } as GoalInfo,
} as FactionInfo;

function renderIt(faction = mockFaction) {
  render(
    <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      <FactionContext.Provider value={mockContext}>
        <GoalProgress faction={faction} />
      </FactionContext.Provider>
    </UiStateContext.Provider>
  );
}

describe('default GoalProgress', () => {
  beforeEach(() => {
    mockSlugGet.mockImplementationOnce(() => mockFaction);
  });

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
    expect(mockUpdate).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledWith(undefined, "goal", {
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
    expect(mockUpdate).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledWith(undefined, "goal", {
      tally: expect.anything(),
      target: 332211,
    });
  });
});

describe('empty GoalProgress', () => {
  it('renders instruction text', () => {
    renderIt({} as FactionInfo);
    const elem = screen.getByTestId("goal-progress-empty");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent?.length).toBeGreaterThan(0);
  });
});
