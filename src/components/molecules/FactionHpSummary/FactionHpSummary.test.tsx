import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";

import FactionHpSummary from "./FactionHpSummary";
import { describe, expect, it, vi } from "vitest";

const mockContext = {
  factions: {
    update: vi.fn() as FactionPoset['update'],
  } as FactionPoset,
} as FactionContextType;

function renderIt(factionId = "tf123") {
  render(
    <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      <FactionContext.Provider value={mockContext}>
        <FactionHpSummary data-testid="test123" hp={123} maxHp={456} factionId={factionId} />
      </FactionContext.Provider>
    </UiStateContext.Provider>
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
    expect(mockContext.factions.update).toBeCalledTimes(1);
    expect(mockContext.factions.update).toBeCalledWith("tf123", "hp", 321);
  });
});
