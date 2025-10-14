import React from "react";
import { describe, it, vi, expect } from "vitest";

import { fireEvent, render, screen, within } from "@testing-library/react";

import EditableText from "./EditableText";

describe("default EditableText", () => {
  const mockUpdate = vi.fn();

  function renderIt(text: string) {
    render(
      <EditableText id="test" data-testid="test-text" onUpdate={mockUpdate}>
        {text}
      </EditableText>
    );
  }

  it("displays children", () => {
    renderIt("Test 123");
    const component = screen.getByTestId("test-text");
    expect(component).toBeInTheDocument();
    expect(component).toBeInstanceOf(HTMLDivElement);
    const text = within(component).getByTestId("editable-text-text");
    expect(text).toHaveTextContent("Test 123");
  });

  it("changes to text input after edit button click", () => {
    renderIt("Test 456");
    const theDiv = screen.getByTestId("test-text");
    expect(theDiv).toBeInstanceOf(HTMLDivElement);

    const button = within(theDiv).getByTestId("editable-text-button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();

    fireEvent.click(button);
    expect(screen.queryByText("Test 456")).toBeNull();

    const textfield = within(theDiv).getByTestId("editable-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access
    const input = textfield.querySelector("input");
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveValue("Test 456");
  });

  it("calls onUpdate on `Enter`", () => {
    renderIt("Test 789");

    const theDiv = screen.getByTestId("test-text");
    const button = within(theDiv).getByTestId("editable-text-button");
    fireEvent.click(button);
    const textfield = within(theDiv).getByTestId("editable-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access
    const input = textfield.querySelector("input") as HTMLInputElement;
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: "Test 101112" } });
    fireEvent.keyUp(input, { key: "Enter" });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith("Test 101112");
  });
});
