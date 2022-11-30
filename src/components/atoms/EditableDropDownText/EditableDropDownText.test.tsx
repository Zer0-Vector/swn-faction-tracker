import React from "react";

import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import EditableDropDownText from "./EditableDropDownText";

const options = [
  "test-one",
  "test-two",
  "test-three",
  "test-four",
  "test-five",
];

const mockOnUpdate = jest.fn();

function renderIt() {
  render(<EditableDropDownText onUpdate={mockOnUpdate} selectableOptions={options} data-testid="test-eddt">test-one</EditableDropDownText>);
}

describe('default EditableDropDownText', () => {
  it('renders text on init', () => {
    renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const text = within(outer).getByTestId("editable-dropdown-text");
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent("test-one");
    expect(within(outer).queryByTestId("editable-dropdown-textfield")).not.toBeInTheDocument();
    expect(within(outer).queryByTestId("editable-dropdown-autocomplete")).not.toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
  });

  it('redners dropdown after edit button clicked', () => {
    renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
    fireEvent.click(button);

    expect(within(outer).queryByTestId("editable-dropdown-text")).not.toBeInTheDocument();
    expect(within(outer).getByTestId("editable-dropdown-autocomplete")).toBeInTheDocument();
    expect(within(outer).getByTestId("editable-dropdown-textfield")).toBeInTheDocument();
  });

  it('calls onUpdate if option clicked', async () => {
    renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
    fireEvent.click(button);

    const autocomplete = within(outer).getByTestId("editable-dropdown-autocomplete");
    expect(autocomplete).toBeInTheDocument();
    
    const listbox = within(outer).getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    const options = within(listbox).getAllByRole("option");
    expect(options.length).toBe(5);
    const selection = options[Math.floor(Math.random() * 4) + 1];
    fireEvent.click(selection);

    await waitFor(() => expect(listbox).not.toBeInTheDocument());

    expect(mockOnUpdate).toBeCalledTimes(1);
    expect(mockOnUpdate).toBeCalledWith(selection.textContent);
  });

  it('cancels update on Escape keyUp', () => {
    renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
    fireEvent.click(button);

    const autocomplete = within(outer).getByTestId("editable-dropdown-autocomplete");
    expect(autocomplete).toBeInTheDocument();
    
    const listbox = within(outer).getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    const textfield = within(outer).getByTestId("editable-dropdown-textfield");
    expect(textfield).toBeInTheDocument();
    fireEvent.keyUp(textfield, { key: 'Escape' });

    expect(listbox).not.toBeInTheDocument();
    expect(mockOnUpdate).not.toBeCalled();
  });
});
