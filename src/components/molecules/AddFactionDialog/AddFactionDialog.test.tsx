import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import AddFactionDialog from "./AddFactionDialog";

const EMPTY_CONTEXT: GameContextType = {
  state: {} as IGameState,
  controller: {} as IGameController,
};

function renderWithContext(context?: GameContextType) {
  const mockClose = jest.fn();
  const mockCreate = jest.fn();
  render(
    <GameContext.Provider value={context || EMPTY_CONTEXT}>
      <AddFactionDialog open={true} onClose={mockClose} onCreate={mockCreate} />
    </GameContext.Provider>
  );
  return { mockClose, mockCreate };
}

describe('default AddFactionDialog', () => {
  it('does not render when open=false', () => {
    render(
      <GameContext.Provider value={EMPTY_CONTEXT}>
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <AddFactionDialog open={false} onClose={()=>{}} onCreate={()=>{}} />
      </GameContext.Provider>
    );
    expect(screen.queryByTestId("add-faction-dialog")).not.toBeInTheDocument();
  });
  
  it('renders shown when open=true', () => {
    renderWithContext();
    expect(screen.getByTestId("add-faction-dialog")).toBeInTheDocument();
  });
  
  it('renders buttons', () => {
    renderWithContext();
    const dialog = screen.getByTestId("add-faction-dialog");
    const btnAdd = within(dialog).getByText("Create");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeInstanceOf(HTMLButtonElement);
    expect(btnAdd).toHaveTextContent("Create");
    
    const btnCancel = within(dialog).getByText("Cancel");
    expect(btnCancel).toBeInTheDocument();
    expect(btnCancel).toBeInstanceOf(HTMLButtonElement);
    expect(btnCancel).toHaveTextContent("Cancel");
  });
  
  it('renders title', () => {
    renderWithContext();
    const divTitle = screen.getByTestId("message-dialog-title");
    expect(divTitle).toBeInTheDocument();
    expect(divTitle).toBeInstanceOf(HTMLHeadingElement);
    expect(divTitle.textContent).toEqual("Add Faction");
  });
  
  it('renders instructions content text', () => {
    renderWithContext();
    const divInst = screen.getByTestId("message-dialog-message");
    expect(divInst).toBeInTheDocument();
    expect(divInst).toBeInstanceOf(HTMLParagraphElement);
    expect(divInst).toHaveTextContent("name");
    expect(divInst).toHaveTextContent("new faction");
  });

  it('renders input field faction name', () => {
    renderWithContext();
    const inAsset = screen.getByTestId("faction-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Faction Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
  });

  it('does nothing when the field is empty', () => {
    const { mockCreate, mockClose } = renderWithContext();
    const dialog = screen.getByTestId("add-faction-dialog");
    const inAsset = within(dialog).getByTestId("faction-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Faction Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
    
    const btnCreate = within(dialog).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).toBeDisabled();
    fireEvent.click(btnCreate);

    expect(mockCreate).not.toBeCalled();
    expect(mockClose).not.toBeCalled();
  });

  it('enables Create button when field is non-empty', () => {
    renderWithContext({
      state: {
        checkFactionName: (s: string) => true,
      } as IGameState,
      controller: {} as IGameController,
    });
    const dialog = screen.getByTestId("add-faction-dialog");
    const inAsset = within(dialog).getByTestId("faction-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Faction Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();

    fireEvent.input(field, { target: { value: "abc" } });
    expect(field).toHaveValue("abc");
    
    const btnCreate = within(dialog).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).not.toBeDisabled();
  });

  it('marks the field with error class when duplicate name given', () => {
    const context: GameContextType = {
      state: {
        checkFactionName: (s: string) => false,
      } as IGameState,
      controller: {} as IGameController,
    };
    renderWithContext(context);
    const inAsset = screen.getByTestId("faction-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Faction Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();

    // eslint-disable-next-line testing-library/no-node-access
    const wrapperDiv = field.closest("div");
    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv).not.toHaveClass("Mui-error");

    fireEvent.input(field, { target: { value: "abc" } });
    expect(field).toHaveValue("abc");

    const dialog = screen.getByTestId("add-faction-dialog");
    const btnCreate = within(dialog).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).toBeDisabled();
    
    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv).toHaveClass("Mui-error");
  });

  it('calls onClose when cancelled', () => {
    const { mockCreate, mockClose } = renderWithContext();
    const inAsset = screen.getByTestId("faction-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Faction Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
    
    const dialog = screen.getByTestId("add-faction-dialog");
    const btnCancel = within(dialog).getByText("Cancel");
    expect(btnCancel).toBeInTheDocument();
    expect(btnCancel).toBeInstanceOf(HTMLButtonElement);
    expect(btnCancel).not.toBeDisabled();
    fireEvent.click(btnCancel);

    expect(mockCreate).not.toBeCalled();
    expect(mockClose).toBeCalledTimes(1);
  });

  it('calls onCreate when given a unique name', () => {
    const { mockClose, mockCreate } = renderWithContext({
      state: {
        getFactions: () => ([] as FactionInfo[]),
        checkFactionName: (s: string) => true,
      } as IGameState,
      controller: {} as IGameController,
    });
    const inAsset = screen.getByTestId("faction-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Faction Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();

    fireEvent.input(field, { target: { value: "abc" } });
    expect(field).toHaveValue("abc");
    
    const dialog = screen.getByTestId("add-faction-dialog");
    const btnCreate = within(dialog).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).not.toBeDisabled();

    fireEvent.click(btnCreate);
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledWith("abc");
    expect(mockClose).toBeCalledTimes(1);
  });
});
