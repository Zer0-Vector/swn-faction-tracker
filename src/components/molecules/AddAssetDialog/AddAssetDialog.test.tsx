import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import AddAssetDialog from "./AddAssetDialog";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockClose = vi.fn();
const mockAdd = vi.fn();

function renderIt(open = true) {
  render(<AddAssetDialog open={open} onClose={mockClose} onAdd={mockAdd} />);
}

describe("default AddAssetDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when open=false", () => {
    renderIt(false);
    expect(screen.queryByTestId("add-asset-dialog")).not.toBeInTheDocument();
  });

  it("renders shown when open=true", () => {
    renderIt();
    expect(screen.getByTestId("add-asset-dialog")).toBeInTheDocument();
  });

  it("renders buttons", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");
    const btnAdd = within(dialog).getByText("Add");
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeInstanceOf(HTMLButtonElement);
    expect(btnAdd).toHaveTextContent("Add");

    const btnCancel = within(dialog).getByText("Cancel");
    expect(btnCancel).toBeInTheDocument();
    expect(btnCancel).toBeInstanceOf(HTMLButtonElement);
    expect(btnCancel).toHaveTextContent("Cancel");
  });

  it("renders title", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    const divTitle = within(dialog).getByTestId("message-dialog-title");
    expect(divTitle).toBeInTheDocument();
    expect(divTitle).toBeInstanceOf(HTMLHeadingElement);
    expect(divTitle.textContent).toEqual("Add Asset");
  });

  it("renders instructions content text", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    const divInst = within(dialog).getByTestId("message-dialog-message");
    expect(divInst).toBeInTheDocument();
    expect(divInst).toBeInstanceOf(HTMLParagraphElement);
    expect(divInst).toHaveTextContent("add");
    expect(divInst).toHaveTextContent("asset");
  });

  it("renders input field and autocomplete for asset selection", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    const inAsset = within(dialog).getByTestId("selection-field");
    expect(inAsset).toBeInTheDocument();
    expect(inAsset).toBeInstanceOf(HTMLDivElement);
    expect(inAsset).toHaveClass("MuiTextField-root");

    const field = within(inAsset).getByLabelText("Select Asset");
    expect(field).toBeInTheDocument();
    expect(field).not.toHaveValue();

    const divAuto = within(dialog).getByTestId("asset-autocomplete");
    expect(divAuto).toBeInTheDocument();
    expect(divAuto).toBeInstanceOf(HTMLDivElement);
    expect(divAuto).toHaveClass("MuiAutocomplete-root");
  });

  it("renders autocomplete dropdown when clicked", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const openAutocomplete = within(dialog).getByTitle("Open");
    expect(openAutocomplete).toBeInTheDocument();
    fireEvent.click(openAutocomplete);

    const list = screen.getByRole("listbox");
    expect(list).toBeInTheDocument();

    const hitmen = within(list).getByText("Hitmen");
    fireEvent.click(hitmen);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const inAsset = within(dialog).getByTestId("selection-field");
    expect(inAsset).toBeInTheDocument();
    const field = within(inAsset).getByLabelText("Select Asset");
    expect(field).toBeInTheDocument();
    expect(field).toHaveValue("Hitmen");
  });

  it("calls onClose when canceled", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    const btnCancel = within(dialog).getByText("Cancel");
    expect(btnCancel).toBeInTheDocument();

    fireEvent.click(btnCancel);
    expect(mockClose).toBeCalledTimes(1);
    expect(mockAdd).not.toBeCalled();
  });

  it("does nothing when nothing is selected", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    const btnAdd = within(dialog).getByText("Add");
    expect(btnAdd).toBeInTheDocument();

    fireEvent.click(btnAdd);
    expect(mockAdd).not.toBeCalled();
  });

  it("calls onAdd when confirming selection", () => {
    renderIt();
    const dialog = screen.getByTestId("add-asset-dialog");

    const btnAdd = within(dialog).getByText("Add");
    expect(btnAdd).toBeInTheDocument();

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    const openAutocomplete = within(dialog).getByTitle("Open");
    expect(openAutocomplete).toBeInTheDocument();
    fireEvent.click(openAutocomplete);

    const list = screen.getByRole("listbox");
    expect(list).toBeInTheDocument();

    const allOptions = within(list).getAllByRole("option");
    const option = allOptions[Math.floor(Math.random() * allOptions.length)];
    const optionText = option.textContent;
    fireEvent.click(option);
    expect(within(dialog).queryByRole("listbox")).not.toBeInTheDocument();

    const inAsset = within(dialog).getByTestId("selection-field");
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
