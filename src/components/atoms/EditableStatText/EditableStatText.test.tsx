import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import EditableStatText from "./EditableStatText";

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
    render(<EditableStatText updateValue={updateMethod} data-testid="edit-stattext-1">111</EditableStatText>);
    let component = screen.getByText("111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
    fireEvent.doubleClick(component);
    
    component = screen.getByDisplayValue("111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLInputElement);

    fireEvent.input(component, { target: { value: "222" } });
    await waitFor(() => {
      expect((component as HTMLInputElement).value).toBe("222");
    });
    component = screen.getByDisplayValue("222");
    expect(component).toBeDefined();
    expect(updateMethod).not.toBeCalled();
    fireEvent.keyUp(component, { key: "Enter", code: "Enter", charCode: 13 });
    expect(updateMethod).toBeCalledTimes(1);

    // value doesn't change because children="TEST 111".
    component = screen.getByText("111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });

  it('sets error when invalid input is given', () => {
    render(<EditableStatText updateValue={jest.fn()}>321</EditableStatText>);
    let component = screen.getByText("321");
    expect(component).toBeInstanceOf(HTMLSpanElement);
    fireEvent.doubleClick(component);
    component = screen.getByDisplayValue("321");
    expect(component).toBeInstanceOf(HTMLInputElement);
    
    fireEvent.input(component, { target: { value: "113" } });
    // eslint-disable-next-line testing-library/no-node-access
    let outer = screen.getByDisplayValue("113").closest("div");
    expect(outer).toBeInstanceOf(HTMLDivElement);
    expect(outer).toHaveClass("MuiInputBase-root");
    expect(outer).not.toHaveClass("Mui-error");
    
    component = screen.getByDisplayValue("113");
    fireEvent.input(component, { target: { value: "blah" } });
    // eslint-disable-next-line testing-library/no-node-access
    outer = screen.getByDisplayValue("blah").closest("div");
    expect(outer).toBeInstanceOf(HTMLDivElement);
    expect(outer).toHaveClass("MuiInputBase-root");
    expect(outer).toHaveClass("Mui-error");

    component = screen.getByDisplayValue("blah");
    fireEvent.input(component, { target: { value: "3333" } });
    // eslint-disable-next-line testing-library/no-node-access
    outer = screen.getByDisplayValue("3333").closest("div");
    expect(outer).toBeInstanceOf(HTMLDivElement);
    expect(outer).toHaveClass("MuiInputBase-root");
    expect(outer).not.toHaveClass("Mui-error");
  });
});
