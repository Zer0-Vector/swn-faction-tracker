import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import EditableText from "./EditableText";

describe('default EditableNameText', () => {
  it('displays children', () => {
    render(<EditableText onUpdate={jest.fn()}>Test 123</EditableText>);
    const component = screen.queryByText("Test 123");
    expect(component).not.toBeNull();
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });
  
  it('changes to text input after doubleclick', () => {
    render(<EditableText onUpdate={jest.fn()}>Test 456</EditableText>);
    let component = screen.getByText("Test 456");
    expect(component).toBeInstanceOf(HTMLSpanElement);
    
    fireEvent.doubleClick(component);
    expect(screen.queryByText("Test 456")).toBeNull();

    component = screen.getByDisplayValue("Test 456");
    expect(component).toBeInstanceOf(HTMLInputElement);
  });
});
