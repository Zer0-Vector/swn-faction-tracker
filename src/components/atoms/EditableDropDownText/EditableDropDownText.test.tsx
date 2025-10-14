import React from "react";

import { render, screen, waitFor, within } from "@testing-library/react";

import EditableDropDownText from "./EditableDropDownText";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

const options = [
  "test-one",
  "test-two",
  "test-three",
  "test-four",
  "test-five",
];

const mockOnUpdate = vi.fn();

function renderIt() {
  return {
    user: userEvent.setup({ delay: 1500 }),

    ...render(
      <EditableDropDownText
        onUpdate={mockOnUpdate}
        selectableOptions={options}
        data-testid="test-eddt"
      >
        test-one
      </EditableDropDownText>
    ),
  };
}

describe("default EditableDropDownText", { timeout: 20000 }, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders text on init", () => {
    renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const text = within(outer).getByTestId("editable-dropdown-text");
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent("test-one");
    expect(
      within(outer).queryByTestId("editable-dropdown-textfield")
    ).not.toBeInTheDocument();
    expect(
      within(outer).queryByTestId("editable-dropdown-autocomplete")
    ).not.toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
  });

  it("renders dropdown after edit button clicked", async () => {
    const { user } = renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
    await user.click(button);

    expect(
      within(outer).queryByTestId("editable-dropdown-text")
    ).not.toBeInTheDocument();
    expect(
      within(outer).getByTestId("editable-dropdown-autocomplete")
    ).toBeInTheDocument();
    expect(
      within(outer).getByTestId("editable-dropdown-textfield")
    ).toBeInTheDocument();
  });

  // FIXME: RACE CONDITION
  it.todo("calls onUpdate if option clicked", async () => {
    const { user } = renderIt();

    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();

    const setupDropdownForSelection = async () => {
      const button = within(outer).getByTestId("editable-dropdown-button");
      expect(button).toBeInTheDocument();
      await user.click(button);

      const autocomplete = within(outer).getByTestId(
        "editable-dropdown-autocomplete"
      );
      expect(autocomplete).toBeInTheDocument();
    };

    await setupDropdownForSelection();

    let listbox = within(outer).getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    let optionItems = within(listbox).getAllByRole("option");
    expect(optionItems.length).toBe(options.length);

    const selectedIndex = Math.floor(Math.random() * optionItems.length);
    const selection = optionItems[selectedIndex]; // NOSONAR
    await user.click(selection);

    await waitFor(() => expect(mockOnUpdate).toBeCalledTimes(1));
    await waitFor(() => expect(listbox).not.toBeInTheDocument());

    expect(mockOnUpdate).toBeCalledWith(selection.textContent);

    mockOnUpdate.mockClear();
    await setupDropdownForSelection();

    listbox = within(outer).getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    optionItems = within(listbox).getAllByRole("option");
    expect(optionItems.length).toBe(options.length);

    const selection2 = optionItems[(selectedIndex + 1) % optionItems.length];
    await user.click(selection2);

    await waitFor(() => expect(mockOnUpdate).toBeCalledTimes(1));
    await waitFor(() => expect(listbox).not.toBeInTheDocument());

    expect(mockOnUpdate).toBeCalledWith(selection2.textContent);
  });

  it("cancels update on Escape", async () => {
    const { user } = renderIt();
    const outer = screen.getByTestId("test-eddt");
    expect(outer).toBeInTheDocument();
    const button = within(outer).getByTestId("editable-dropdown-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
    await user.click(button);

    const autocomplete = within(outer).getByTestId(
      "editable-dropdown-autocomplete"
    );
    expect(autocomplete).toBeInTheDocument();

    const listbox = within(outer).getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    const textfield = within(outer).getByTestId("editable-dropdown-textfield");
    expect(textfield).toBeInTheDocument();
    await user.keyboard("{Escape}");

    expect(listbox).not.toBeInTheDocument();
    expect(mockOnUpdate).not.toBeCalled();
  });
});
