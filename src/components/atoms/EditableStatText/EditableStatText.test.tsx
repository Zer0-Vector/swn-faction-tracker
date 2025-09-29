import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import EditableStatText from "./EditableStatText";
import { describe, expect, it, vi } from "vitest";

describe('default EditableStatText', () => {
  it('renders StatText initially', () => {
    const updateMethod = vi.fn();
    render(<EditableStatText onUpdate={updateMethod} data-testid="test1">{111}</EditableStatText>);
    const component = screen.getByText("111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });

  it('renders input after double-click', () => {
    const updateMethod = vi.fn();
    render(<EditableStatText onUpdate={updateMethod} data-testid="test2">{111}</EditableStatText>);
    let component = screen.getByText("111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLSpanElement);
    fireEvent.doubleClick(component);

    component = screen.getByDisplayValue("111");
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(HTMLInputElement);
  });

  it('calls updateValue callback after Enter key', async () => {
    const updateMethod = vi.fn();
    render(<EditableStatText data-testid="test3" onUpdate={updateMethod}>{111}</EditableStatText>);
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
    render(<EditableStatText data-testid="test4" onUpdate={vi.fn()}>{321}</EditableStatText>);
    let component = screen.getByText("321");
    expect(component).toBeInstanceOf(HTMLSpanElement);
    fireEvent.doubleClick(component);
    component = screen.getByDisplayValue("321");
    expect(component).toBeInstanceOf(HTMLInputElement);

    fireEvent.input(component, { target: { value: "113" } });
    // eslint-disable-next-line testing-library/no-node-access
    let outer = screen.getByDisplayValue("113").closest("div");
    expect(outer).toBeInstanceOf(HTMLDivElement);
    expect(outer?.classList.value).toContain("MuiInputBase-root");
    expect(outer?.classList.value).not.toContain("Mui-error");

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
