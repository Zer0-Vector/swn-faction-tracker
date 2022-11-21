import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { Maybe } from "../../../types/Maybe";

import ConfirmDialog from "./ConfirmDialog";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const mockCancel = jest.fn();
const mockConfirm = jest.fn();

function renderDumb(open = true, buttonText: Maybe<string> = undefined, id = "test") {
  render(
    <ConfirmDialog
      id={id}
      open={open}
      title="test-title"
      message="test-message"
      onCancel={mockCancel}
      onConfirm={mockConfirm}
      buttonText={buttonText}
    />
  );
}

describe('default ConfirmDialog', () => {
  it('does not render when open=false', () => {
    renderDumb(false);
    expect(screen.queryByTestId("test-confirm-dialog")).not.toBeInTheDocument();
  });

  it('renders when open=true', () => {
    renderDumb();
    expect(screen.getByTestId("test-confirm-dialog")).toBeInTheDocument();
  });

  it('renders given title', () => {
    renderDumb();
    const title = screen.getByTestId("test-confirm-dialog-title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toEqual("test-title");
  });

  it('renders given message', () => {
    renderDumb();
    const message = screen.getByTestId("test-confirm-dialog-content-text");
    expect(message).toBeInTheDocument();
    expect(message.textContent).toEqual("test-message");
  });

  it('renders buttons', () => {
    renderDumb();
    const cancel = screen.getByTestId("test-confirm-dialog-cancel-button");
    expect(cancel).toBeInTheDocument();
    expect(cancel).toBeInstanceOf(HTMLButtonElement);
    expect(cancel).not.toBeDisabled();
    expect(cancel.textContent).toEqual("Cancel");

    const confirm = screen.getByTestId("test-confirm-dialog-confirm-button");
    expect(confirm).toBeInTheDocument();
    expect(confirm).toBeInstanceOf(HTMLButtonElement);
    expect(confirm).not.toBeDisabled();
    expect(confirm.textContent).toEqual("Confirm");
  });

  it('renders given button text', () => {
    renderDumb(true, "OK");
    const confirm = screen.getByTestId("test-confirm-dialog-confirm-button");
    expect(confirm).toBeInTheDocument();
    expect(confirm).toBeInstanceOf(HTMLButtonElement);
    expect(confirm).not.toBeDisabled();
    expect(confirm.textContent).toEqual("OK");
  });

  it('calls onCancel when cancelled', () => {
    renderDumb();
    const cancel = screen.getByTestId("test-confirm-dialog-cancel-button");
    fireEvent.click(cancel);
    expect(mockCancel).toBeCalledTimes(1);
    expect(mockConfirm).not.toBeCalled();
  });
  
  it('calls onConfirm when confirmed', () => {
    renderDumb();
    const confirm = screen.getByTestId("test-confirm-dialog-confirm-button");
    fireEvent.click(confirm);
    expect(mockConfirm).toBeCalledTimes(1);
    expect(mockCancel).not.toBeCalled();
  });
});
