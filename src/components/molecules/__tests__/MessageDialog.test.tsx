import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import MessageDialog from "../MessageDialog";

describe('<MessageDialog />', () => {
  it('renders with title, message, and default button', () => {
    const closer = jest.fn();
    const titleText = "Test Title";
    const messageText = "Hello, World!";

    render(<MessageDialog open={true} id="test" title={titleText} message={messageText} onClose={closer} />);
    
    const dialog = screen.getByTestId("test-dialog");
    expect(dialog).toBeInTheDocument();
    
    const title = screen.getByTestId("test-dialog-title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toEqual(titleText);

    const message = screen.getByTestId("test-dialog-message");
    expect(message).toBeInTheDocument();
    expect(message.textContent).toEqual(messageText);

    const button = screen.getByTestId("test-dialog-close-button");
    expect(button).toBeInTheDocument();
    expect(button.textContent).toEqual("Close");
  });

  it('does not render when not open', () => {
    render(<MessageDialog open={false} id="test2" title="test2-title" message="test2-message" onClose={jest.fn()} />);
    expect(screen.queryByTestId("test2-dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("test2-title")).not.toBeInTheDocument();
    expect(screen.queryByText("test2-message")).not.toBeInTheDocument();
  });
  
  it('can use custom button text', () => {
    render(<MessageDialog open={true} id="test3" title="test3-title" message="test3-message" onClose={jest.fn()} buttonText="OK-Test3" />);
    const button = screen.getByTestId("test3-dialog-close-button");
    expect(button).toBeInTheDocument();
    expect(button.textContent).toEqual("OK-Test3");
  });
  
  it('calls onClose callback when close button clicked', () => {
    const closer = jest.fn();
    render(<MessageDialog open={true} id="test4" title="test4-title" message="test4-message" onClose={closer} />);
    const button = screen.getByTestId("test4-dialog-close-button");
    fireEvent.click(button);
    expect(closer).toBeCalledTimes(1);
  });
});
