import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import EditableStatText from "../EditableStatText";

describe('default EditableStatText', () => {
  it('renders StatText initially', () => {
    const updateMethod = jest.fn();
    render(<EditableStatText updateValue={updateMethod} data-testid="edit-stattext-1">TEST 111</EditableStatText>);
    const component = screen.getByText("TEST 111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });
  
  it('renders input after double-click', () => {
    const updateMethod = jest.fn();
    render(<EditableStatText updateValue={updateMethod} data-testid="edit-stattext-1">TEST 111</EditableStatText>);
    let component = screen.getByText("TEST 111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
    fireEvent.doubleClick(component);
    
    component = screen.getByDisplayValue("TEST 111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLInputElement);
  });

  it('calls updateValue callback after Enter key', async () => {
    const updateMethod = jest.fn();
    render(<EditableStatText updateValue={updateMethod} data-testid="edit-stattext-1">TEST 111</EditableStatText>);
    let component = screen.getByText("TEST 111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
    fireEvent.doubleClick(component);
    
    component = screen.getByDisplayValue("TEST 111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLInputElement);

    fireEvent.input(component, { target: { value: "TEST 222" } });
    await waitFor(() => {
      expect((component as HTMLInputElement).value).toBe("TEST 222");
    });
    component = screen.getByDisplayValue("TEST 222");
    expect(component).toBeDefined();
    fireEvent.keyUp(component, { key: "Enter", code: "Enter", charCode: 13 });
    expect(updateMethod).toBeCalledTimes(1);

    // value doesn't change because children="TEST 111".
    component = screen.getByText("TEST 111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });
});
