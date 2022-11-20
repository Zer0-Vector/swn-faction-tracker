import React from "react";

import { render, screen } from "@testing-library/react";

import ConfirmDialog from "./ConfirmDialog";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOP = ()=>{};

function renderDumb(open = true, id = "test") {
  render(<ConfirmDialog id={id} open={open} title="test-title" message="test-message" onCancel={NOP} onConfirm={NOP} />);
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

  it.todo('renders given button text');
  it.todo('renders buttons');
  it.todo('calls onClose when cancelled');
  it.todo('calls onConfirm when confirmed');
});
