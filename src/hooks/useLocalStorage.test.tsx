import React, { JSX, act } from "react";

import { render, screen } from "@testing-library/react";

import { useLocalStorage } from "./useLocalStorage";
import { beforeEach, expect, test } from "vitest";

function TestComponent(): JSX.Element {
  const [value, setValue] = useLocalStorage<string>(
    "TestKey",
    "default test value 123"
  );

  return (
    <div>
      <p data-testid="test-value">{value}</p>
      <button
        onClick={() => act(() => setValue("new test value 4567"))}
        data-testid="test-button"
      >
        DoSetValue
      </button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test("useLocalStorage returns default value if unset", () => {
  render(<TestComponent />);
  const value = screen.getByTestId("test-value").textContent;
  expect(value).toBe("default test value 123");
});

test("useLocalStorage setValue changes output", () => {
  render(<TestComponent />);
  const value1 = screen.getByTestId("test-value").textContent;
  expect(value1).toBe("default test value 123");

  const button = screen.getByTestId("test-button");
  expect(button).toBeDefined();
  button.click();

  const value = screen.getByTestId("test-value").textContent;
  expect(value).toBe("new test value 4567");
});

test("rerender does not change data", () => {
  const { unmount } = render(<TestComponent />);
  const testElement = screen.getByTestId("test-value");
  const value1 = testElement.textContent;
  expect(value1).toBe("default test value 123");

  const button = screen.getByTestId("test-button");
  expect(button).toBeDefined();
  button.click();

  const value = testElement.textContent;
  expect(value).toBe("new test value 4567");
  unmount();
  expect(testElement).not.toBeInTheDocument();

  render(<TestComponent />);
  const value2 = testElement.textContent;
  expect(value2).toBe("new test value 4567");
});
