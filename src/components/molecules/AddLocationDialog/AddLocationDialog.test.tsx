import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import LocationInfo from "../../../types/LocationInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import AddLocationDialog from "./AddLocationDialog";

const EMPTY_CONTEXT: GameContextType = {
  state: {} as IGameState,
  controller: {} as IGameController,
};

function renderWithContext(context?: GameContextType, open?: boolean) {
  const mockClose = jest.fn();
  const mockCreate = jest.fn();
  const mockCheckLocationName = jest.fn();
  render(
    <GameContext.Provider value={context || {
      state: {
        checkLocationName: mockCheckLocationName as (s:string)=>boolean,
      } as IGameState,
      controller: {} as IGameController,
    }}>
      <AddLocationDialog open={true} onClose={mockClose} onCreate={mockCreate} />
    </GameContext.Provider>
  );
  return { mockClose, mockCreate, mockCheckLocationName };
}

describe('default AddLocationDialog', () => {
  it('does not render when open=false', () => {
    render(
      <GameContext.Provider value={{
        state: {
          checkLocationName: jest.fn() as (s:string)=>boolean,
        } as IGameState,
        controller: {} as IGameController,
      }}>
        <AddLocationDialog open={false} onClose={jest.fn()} onCreate={jest.fn()} />
      </GameContext.Provider>
    );
    expect(screen.queryByTestId("add-location-dialog")).not.toBeInTheDocument();
  });
  
  it('renders shown when open=true', () => {
    renderWithContext();
    expect(screen.getByTestId("add-location-dialog")).toBeInTheDocument();
  });
  
  it('renders buttons', () => {
    renderWithContext();
    const dialog = screen.getByTestId("add-location-dialog");
    const btnAdd = within(dialog).getByText("Create");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeInstanceOf(HTMLButtonElement);
    
    const btnCancel = within(dialog).getByText("Cancel");
    expect(btnCancel).toBeInTheDocument();
    expect(btnCancel).toBeInstanceOf(HTMLButtonElement);
  });
  
  it('renders title', () => {
    renderWithContext();
    const divTitle = screen.getByTestId("message-dialog-title");
    expect(divTitle).toBeInTheDocument();
    expect(divTitle).toBeInstanceOf(HTMLHeadingElement);
    expect(divTitle.textContent).toEqual("Add Location");
  });
  
  it('renders instructions content text', () => {
    renderWithContext();
    const divInst = screen.getByTestId("message-dialog-message");
    expect(divInst).toBeInTheDocument();
    expect(divInst).toBeInstanceOf(HTMLParagraphElement);
    expect(divInst).toHaveTextContent("new location");
  });

  it('renders input field location name', () => {
    renderWithContext();
    const inAsset = screen.getByTestId("location-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Location Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
  });

  it('does nothing when the field is empty', () => {
    const { mockCreate, mockClose } = renderWithContext();
    const inAsset = screen.getByTestId("location-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Location Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
    
    const dialog = screen.getByTestId("add-location-dialog");
    const btnCreate = within(dialog).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).toBeDisabled();
    fireEvent.click(btnCreate);

    expect(mockCreate).not.toBeCalled();
    expect(mockClose).not.toBeCalled();
  });

  function assertEmptyField(testId: string, labelText: string) {
    const textField = screen.getByTestId(testId);
    expect(textField).toBeInTheDocument();
    expect(textField).toBeInstanceOf(HTMLDivElement);
    expect(textField).toHaveClass("MuiTextField-root");

    const input = within(textField).getByLabelText(labelText);
    expect(input).toBeInTheDocument();
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).not.toHaveValue();

    return { textField, input };
  }

  it('enables Create button when all fields are non-empty', () => {
    const { mockCheckLocationName } = renderWithContext();
    mockCheckLocationName.mockImplementation(() => true);
    const { input: nameField } = assertEmptyField("location-name-field", "Location Name");
    fireEvent.input(nameField, { target: { value: "abc" } });
    expect(nameField).toHaveValue("abc");

    const textField = screen.getByTestId("location-tl-field");
    expect(textField).toBeInTheDocument();
    expect(textField).toBeInstanceOf(HTMLDivElement);
    expect(textField).toHaveClass("MuiTextField-root");

    const tlField = within(textField).getByDisplayValue("");
    expect(tlField).toBeInTheDocument();
    expect(tlField).toBeInstanceOf(HTMLInputElement);
    fireEvent.change(tlField, { target : { value: "1" } });
    expect(tlField).toHaveValue("1");
    
    const { input: xField } = assertEmptyField("location-x-field", "X");
    fireEvent.input(xField, { target : { value: "2" } });
    expect(xField).toHaveValue(2);
    
    const { input: yField } = assertEmptyField("location-y-field", "Y");
    fireEvent.input(yField, { target : { value: "3" } });
    expect(yField).toHaveValue(3);
    
    const actions = screen.getByTestId("message-dialog-actions");
    const btnCreate = within(actions).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).not.toBeDisabled();
  });

  it('marks the field with error class when duplicate name given', () => {
    const { mockCheckLocationName } = renderWithContext();
    mockCheckLocationName.mockImplementation(() => false);
    
    const inAsset = screen.getByTestId("location-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Location Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();

    fireEvent.input(field, { target: { value: "abc" } });
    expect(field).toHaveValue("abc");
    
    const actions = screen.getByTestId("message-dialog-actions");
    const btnCreate = within(actions).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).toBeDisabled();
    
    // eslint-disable-next-line testing-library/no-node-access
    const wrapperDiv = field.closest("div");
    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv).toHaveClass("Mui-error");
  });

  it('calls onClose when cancelled', () => {
    const { mockCreate, mockClose } = renderWithContext();
    const inAsset = screen.getByTestId("location-name-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Location Name");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
    
    const actions = screen.getByTestId("message-dialog-actions");
    const btnCancel = within(actions).getByText("Cancel");
    expect(btnCancel).toBeInTheDocument();
    expect(btnCancel).toBeInstanceOf(HTMLButtonElement);
    expect(btnCancel).not.toBeDisabled();
    fireEvent.click(btnCancel);

    expect(mockCreate).not.toBeCalled();
    expect(mockClose).toBeCalledTimes(1);
  });

  it('calls onCreate when given a unique name and other non-empty details', () => {
    const { mockClose, mockCreate } = renderWithContext({
      state: {
        checkLocationName: (s: string) => true,
      } as IGameState,
      controller: {} as IGameController,
    });
    const { input: nameField } = assertEmptyField("location-name-field", "Location Name");
    fireEvent.input(nameField, { target: { value: "abc" } });
    expect(nameField).toHaveValue("abc");

    const textField = screen.getByTestId("location-tl-field");
    expect(textField).toBeInTheDocument();
    expect(textField).toBeInstanceOf(HTMLDivElement);
    expect(textField).toHaveClass("MuiTextField-root");

    const tlField = within(textField).getByDisplayValue("");
    expect(tlField).toBeInTheDocument();
    expect(tlField).toBeInstanceOf(HTMLInputElement);
    fireEvent.change(tlField, { target : { value: "1" } });
    expect(tlField).toHaveValue("1");
    
    const { input: xField } = assertEmptyField("location-x-field", "X");
    fireEvent.input(xField, { target : { value: "2" } });
    expect(xField).toHaveValue(2);
    
    const { input: yField } = assertEmptyField("location-y-field", "Y");
    fireEvent.input(yField, { target : { value: "3" } });
    expect(yField).toHaveValue(3);
    
    const actions = screen.getByTestId("message-dialog-actions");
    const btnCreate = within(actions).getByText("Create");
    expect(btnCreate).toBeInTheDocument();
    expect(btnCreate).toBeInstanceOf(HTMLButtonElement);
    expect(btnCreate).not.toBeDisabled();

    fireEvent.click(btnCreate);
    expect(mockClose).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledTimes(1);
  });
});
