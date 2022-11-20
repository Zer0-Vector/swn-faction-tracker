import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import AddAssetDialog from "./AddAssetDialog";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOP = ()=>{};

describe('default AddAssetDialog', () => {
  it('does not render when open=false', () => {
    render(<AddAssetDialog open={false} onClose={NOP} onAdd={NOP} />);
    expect(screen.queryByTestId("add-asset-dialog")).not.toBeInTheDocument();
  });
  
  it('renders shown when open=true', () => {
    render(<AddAssetDialog open={true} onClose={NOP} onAdd={NOP} />);
    expect(screen.getByTestId("add-asset-dialog")).toBeInTheDocument();
  });
  
  it('renders buttons', () => {
    render(<AddAssetDialog open={true} onClose={NOP} onAdd={NOP} />);
    const btnAdd = screen.getByTestId("add-asset-dialog-confirm-button");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeInstanceOf(HTMLButtonElement);
    expect(btnAdd).toHaveTextContent("Add");
    
    const btnCancel = screen.getByTestId("add-asset-dialog-cancel-button");
    expect(btnCancel).toBeInTheDocument();
    expect(btnCancel).toBeInstanceOf(HTMLButtonElement);
    expect(btnCancel).toHaveTextContent("Cancel");
  });
  
  it('renders title', () => {
    render(<AddAssetDialog open={true} onClose={NOP} onAdd={NOP} />);
    const divTitle = screen.getByTestId("add-asset-dialog-title-text");
    expect(divTitle).toBeInTheDocument();
    expect(divTitle).toBeInstanceOf(HTMLHeadingElement);
    expect(divTitle.textContent).toEqual("Add Asset");
  });
  
  it('renders instructions content text', () => {
    render(<AddAssetDialog open={true} onClose={NOP} onAdd={NOP} />);
    const divInst = screen.getByTestId("add-asset-dialog-content-text");
    expect(divInst).toBeInTheDocument();
    expect(divInst).toBeInstanceOf(HTMLParagraphElement);
    expect(divInst).toHaveTextContent("add");
    expect(divInst).toHaveTextContent("asset");
  });

  it('renders input field and autocomplete for asset selection', () => {
    render(<AddAssetDialog open={true} onClose={NOP} onAdd={NOP} />);
    const inAsset = screen.getByTestId("add-asset-dialog-asset-selection-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Select Asset");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();
    
    const divAuto = screen.getByTestId("add-asset-dialog-asset-autocomplete");
    expect(divAuto).toBeInTheDocument();
    expect(divAuto).toBeInstanceOf(HTMLDivElement);
    expect(divAuto).toHaveClass("MuiAutocomplete-root");
  });
  
  it('renders autocomplete dropdown when clicked', () => {
    render(<AddAssetDialog open={true} onClose={NOP} onAdd={NOP} />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const openAutocomplete = screen.getByTitle("Open");
    expect(openAutocomplete).toBeInTheDocument();
    fireEvent.click(openAutocomplete);
    
    const list = screen.getByRole("listbox");
    expect(list).toBeInTheDocument();
    
    const hitmen = within(list).getByText("Hitmen");
    fireEvent.click(hitmen);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const inAsset = screen.getByTestId("add-asset-dialog-asset-selection-field");
    expect(inAsset).toBeInTheDocument();
    const field = within(inAsset).getByLabelText("Select Asset");
    expect(field).toBeInTheDocument();
    expect(field).toHaveValue("Hitmen");
  });
  
  it('calls onClose when canceled', () => {
    const mockClose = jest.fn();
    const mockAdd = jest.fn();
    render(<AddAssetDialog open={true} onClose={mockClose} onAdd={mockAdd} />);
    const btnCancel = screen.getByTestId("add-asset-dialog-cancel-button");
    expect(btnCancel).toBeInTheDocument();
    
    fireEvent.click(btnCancel);
    expect(mockClose).toBeCalledTimes(1);
    expect(mockAdd).not.toBeCalled();
  });
  
  it('does nothing when nothing is selected', () => {
    const mockClose = jest.fn();
    const mockAdd = jest.fn();
    render(<AddAssetDialog open={true} onClose={mockClose} onAdd={mockAdd} />);
    const btnAdd = screen.getByTestId("add-asset-dialog-confirm-button");
    expect(btnAdd).toBeInTheDocument();
    
    fireEvent.click(btnAdd);
    expect(mockAdd).not.toBeCalled();
    expect(mockClose).not.toBeCalled();
  });
  
  it('calls onAdd when confirming selection', () => {
    const mockClose = jest.fn();
    const mockAdd = jest.fn();
    render(<AddAssetDialog open={true} onClose={mockClose} onAdd={mockAdd} />);
    const btnAdd = screen.getByTestId("add-asset-dialog-confirm-button");
    expect(btnAdd).toBeInTheDocument();

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const openAutocomplete = screen.getByTitle("Open");
    expect(openAutocomplete).toBeInTheDocument();
    fireEvent.click(openAutocomplete);
    
    const list = screen.getByRole("listbox");
    expect(list).toBeInTheDocument();
    
    const allOptions = within(list).getAllByRole("option");
    const option = allOptions[Math.floor(Math.random() * allOptions.length)];
    const optionText = option.textContent;
    fireEvent.click(option);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const inAsset = screen.getByTestId("add-asset-dialog-asset-selection-field");
    expect(inAsset).toBeInTheDocument();
    const field = within(inAsset).getByLabelText("Select Asset");
    expect(field).toBeInTheDocument();
    expect(field).toHaveValue(optionText);

    fireEvent.click(btnAdd);
    expect(mockAdd).toBeCalledTimes(1);
    expect(mockClose).toBeCalledTimes(1);
    expect(mockAdd).toBeCalledWith(optionText);
  });
});
