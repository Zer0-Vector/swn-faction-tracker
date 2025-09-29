import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import MessageDialog from "./MessageDialog";
import { describe, expect, it, vi } from "vitest";

describe('<MessageDialog />', () => {
  it('renders with title, message, and default button', () => {
    const closer = vi.fn();
    const titleText = "Test Title";
    const messageText = "Hello, World!";

    render(<MessageDialog open={true} data-testid="test" title={titleText} message={messageText} onAction={closer} />);

    const dialog = screen.getByTestId("test");
    expect(dialog).toBeInTheDocument();

    const title = within(dialog).getByTestId("message-dialog-title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toEqual(titleText);

    const message = within(dialog).getByTestId("message-dialog-message");
    expect(message).toBeInTheDocument();
    expect(message.textContent).toEqual(messageText);

    const button = within(dialog).getByTestId("message-dialog-close-button");
    expect(button).toBeInTheDocument();
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('does not render when not open', () => {
    render(<MessageDialog open={false} data-testid="test2" title="test2-title" message="test2-message" onAction={vi.fn()} />);
    expect(screen.queryByTestId("test2")).not.toBeInTheDocument();
    expect(screen.queryByText("message-dialog-title")).not.toBeInTheDocument();
    expect(screen.queryByText("message-dialog-message")).not.toBeInTheDocument();
  });

  it('can use custom button text', () => {
    render(<MessageDialog open={true} data-testid="test3" title="test3-title" message="test3-message" onAction={vi.fn()} buttons={["OK-Test3"]} />);
    const dialog = screen.getByTestId("test3");
    const actions = within(dialog).getByTestId("message-dialog-actions");
    const button = within(actions).getByText("OK-Test3");
    expect(button).toBeInTheDocument();
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClose callback when close button clicked', () => {
    const closer = vi.fn();
    render(<MessageDialog open={true} data-testid="test4" title="test4-title" message="test4-message" onAction={closer} />);
    const dialog = screen.getByTestId("test4");
    const button = within(dialog).getByTestId("message-dialog-close-button");
    fireEvent.click(button);
    expect(closer).toBeCalledTimes(1);
  });
});
