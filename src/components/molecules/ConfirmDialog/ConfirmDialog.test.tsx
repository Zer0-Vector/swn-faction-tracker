import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { Maybe } from "../../../types/Maybe";

import ConfirmDialog from "./ConfirmDialog";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const mockCancel = jest.fn();
const mockConfirm = jest.fn();

function renderIt(open = true, buttonText: Maybe<string> = undefined) {
  render(
    <ConfirmDialog
      open={open}
      title="test-title"
      message="test-message"
      onCancel={mockCancel}
      onConfirm={mockConfirm}
      buttonText={buttonText}
      data-testid="test-dialog"
    />
  );
}

describe('default ConfirmDialog', () => {
  it('does not render when open=false', () => {
    renderIt(false);
    expect(screen.queryByTestId("test-dialog")).not.toBeInTheDocument();
  });

  it('renders when open=true', () => {
    renderIt();
    expect(screen.getByTestId("test-dialog")).toBeInTheDocument();
  });

  it('renders given title', () => {
    renderIt();
    const dialog = screen.getByTestId("test-dialog");
    const title = within(dialog).getByTestId("title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toEqual("test-title");
  });

  it('renders given message', () => {
    renderIt();
    const dialog = screen.getByTestId("test-dialog");
    const message = within(dialog).getByTestId("content-text");
    expect(message).toBeInTheDocument();
    expect(message.textContent).toEqual("test-message");
  });

  it('renders buttons', () => {
    renderIt();
    const dialog = screen.getByTestId("test-dialog");
    const cancel = within(dialog).getByTestId("cancel-button");
    expect(cancel).toBeInTheDocument();
    expect(cancel).toBeInstanceOf(HTMLButtonElement);
    expect(cancel).not.toBeDisabled();
    expect(cancel.textContent).toEqual("Cancel");

    const confirm = within(dialog).getByTestId("confirm-button");
    expect(confirm).toBeInTheDocument();
    expect(confirm).toBeInstanceOf(HTMLButtonElement);
    expect(confirm).not.toBeDisabled();
    expect(confirm.textContent).toEqual("Confirm");
  });

  it('renders given button text', () => {
    renderIt(true, "OK");
    const dialog = screen.getByTestId("test-dialog");
    const confirm = within(dialog).getByTestId("confirm-button");
    expect(confirm).toBeInTheDocument();
    expect(confirm).toBeInstanceOf(HTMLButtonElement);
    expect(confirm).not.toBeDisabled();
    expect(confirm.textContent).toEqual("OK");
  });

  it('calls onCancel when cancelled', () => {
    renderIt();
    const dialog = screen.getByTestId("test-dialog");
    const cancel = within(dialog).getByTestId("cancel-button");
    fireEvent.click(cancel);
    expect(mockCancel).toBeCalledTimes(1);
    expect(mockConfirm).not.toBeCalled();
  });
  
  it('calls onConfirm when confirmed', () => {
    renderIt();
    const dialog = screen.getByTestId("test-dialog");
    const confirm = within(dialog).getByTestId("confirm-button");
    fireEvent.click(confirm);
    expect(mockConfirm).toBeCalledTimes(1);
    expect(mockCancel).not.toBeCalled();
  });
});
