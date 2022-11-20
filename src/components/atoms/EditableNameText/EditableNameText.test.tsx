import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import EditableNameText from "./EditableNameText";

describe('default EditableNameText', () => {
  it('displays children', () => {
    render(<EditableNameText onUpdate={jest.fn()}>Test 123</EditableNameText>);
    const component = screen.queryByText("Test 123");
    expect(component).not.toBeNull();
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });
  
  it('changes to text input after doubleclick', () => {
    render(<EditableNameText onUpdate={jest.fn()}>Test 456</EditableNameText>);
    let component = screen.getByText("Test 456");
    expect(component).toBeInstanceOf(HTMLSpanElement);
    
    fireEvent.doubleClick(component);
    expect(screen.queryByText("Test 456")).toBeNull();

    component = screen.getByDisplayValue("Test 456");
    expect(component).toBeInstanceOf(HTMLInputElement);
  });
});
