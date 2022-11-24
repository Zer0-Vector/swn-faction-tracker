import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import EditableText from "./EditableText";

describe('default EditableText', () => {
  const mockUpdate = jest.fn();

  function renderIt(text: string) {
    render(<EditableText id="test" data-testid="test-text" onUpdate={mockUpdate}>{text}</EditableText>);
  }

  it('displays children', () => {
    renderIt("Test 123");
    const component = screen.getByTestId("test-text");
    expect(component).toBeInTheDocument();
    expect(component).toBeInstanceOf(HTMLSpanElement);
    expect(component).toHaveTextContent("Test 123");
  });
  
  it('changes to text input after doubleclick', () => {
    renderIt("Test 456");
    let component: HTMLElement | null = screen.getByTestId("test-text");
    expect(component).toBeInstanceOf(HTMLSpanElement);
    
    fireEvent.doubleClick(component);
    expect(screen.queryByText("Test 456")).toBeNull();

    component = screen.getByTestId("test-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access 
    component = component.querySelector("input");
    expect(component).toBeInstanceOf(HTMLInputElement);
    expect(component).toHaveValue("Test 456");
  });

  it('calls onUpdate on `Enter`', () => {
    renderIt("Test 789");
    let component = screen.getByTestId("test-text");
    fireEvent.doubleClick(component);
    component = screen.getByTestId("test-text-textfield");
    // eslint-disable-next-line testing-library/no-node-access 
    const input = component.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Test 101112" } });
    fireEvent.keyUp(input, { key: "Enter" });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith("Test 101112");
  });
});
