import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import GameMode from "../../../types/GameMode";
import UiState from "../../../types/UiState";

import ListActionToolbar from "./ListActionToolbar";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockOnAddClick = vi.fn();
const mockOnRemoveClick = vi.fn();

function renderIt(removable = false) {
  render(
    <UiStateContext.Provider
      value={{
        state: {
          editMode: "EDIT",
          loginState: "LOGGED_IN",
        } as UiState,
        controller: {} as UiStateController,
      }}
    >
      <ListActionToolbar
        removable={removable}
        onAddClick={mockOnAddClick}
        onRemoveClick={mockOnRemoveClick}
        data-testid="test-lat"
      >
        <p>test</p>
      </ListActionToolbar>
    </UiStateContext.Provider>
  );
}

describe("ListActionToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each<GameMode>(["VIEW", "TURN"])(
    "does not render when editMode=%p",
    (mode) => {
      render(
        <UiStateContext.Provider
          value={{
            state: {
              editMode: mode,
              loginState: "LOGGED_IN",
            } as UiState,
            controller: {} as UiStateController,
          }}
        >
          <ListActionToolbar
            removable={true}
            onAddClick={mockOnAddClick}
            onRemoveClick={mockOnRemoveClick}
            data-testid="test-lat"
          >
            <p>test</p>
          </ListActionToolbar>
        </UiStateContext.Provider>
      );
      const lat = screen.queryByTestId("test-lat");
      expect(lat).not.toBeInTheDocument();
    }
  );

  it("renders buttons and children", () => {
    renderIt();
    const lat = screen.getByTestId("test-lat");
    expect(lat).toBeInTheDocument();

    const btnAdd = within(lat).getByTestId("lat-add");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeInstanceOf(HTMLButtonElement);
    expect(btnAdd).toBeEnabled();
    const addIcon = within(btnAdd).getByTestId("AddIcon");
    expect(addIcon).toBeInTheDocument();
    expect(addIcon).toBeInstanceOf(SVGElement);

    const btnRemove = within(lat).getByTestId("lat-remove");
    expect(btnRemove).toBeInTheDocument();
    expect(btnRemove).toBeInstanceOf(HTMLButtonElement);
    expect(btnRemove).toBeDisabled();
    const removeIcon = within(btnRemove).getByTestId("RemoveIcon");
    expect(removeIcon).toBeInTheDocument();
    expect(removeIcon).toBeInstanceOf(SVGElement);
  });

  it("enables remove button when removable=true", () => {
    renderIt(true);
    const lat = screen.getByTestId("test-lat");
    expect(lat).toBeInTheDocument();

    const btnRemove = within(lat).getByTestId("lat-remove");
    expect(btnRemove).toBeInTheDocument();
    expect(btnRemove).toBeInstanceOf(HTMLButtonElement);
    expect(btnRemove).not.toBeDisabled();
  });

  it("calls onAddClick when add button clicked", () => {
    renderIt();
    const lat = screen.getByTestId("test-lat");
    expect(lat).toBeInTheDocument();

    const btnAdd = within(lat).getByTestId("lat-add");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeInstanceOf(HTMLButtonElement);
    expect(btnAdd).toBeEnabled();

    fireEvent.click(btnAdd);
    expect(mockOnAddClick).toBeCalledTimes(1);
    expect(mockOnRemoveClick).not.toBeCalled();
  });

  it("calls onRemoveClick when enabled remove button clicked", () => {
    renderIt(true);
    const lat = screen.getByTestId("test-lat");
    expect(lat).toBeInTheDocument();

    const btnRemove = within(lat).getByTestId("lat-remove");
    expect(btnRemove).toBeInTheDocument();
    expect(btnRemove).toBeInstanceOf(HTMLButtonElement);
    expect(btnRemove).not.toBeDisabled();

    fireEvent.click(btnRemove);
    expect(mockOnRemoveClick).toBeCalledTimes(1);
    expect(mockOnAddClick).not.toBeCalled();
  });
});
