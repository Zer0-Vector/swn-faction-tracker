import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useLocalStorage } from "./useLocalStorage";

function setup() {
  localStorage.clear();
  function TestComponent(): JSX.Element {
    const [value, setValue] = useLocalStorage<string>("TestKey", "default test value 123") as [value: string, setValue: React.Dispatch<React.SetStateAction<string>>];

    return (
      <div>
        <p data-testid="test-value">{value}</p>
        <button onClick={() => act(() => setValue("new test value 4567"))} data-testid="test-button">DoSetValue</button>
      </div>
    );
  }
  render(<TestComponent />);
}

test('useLocalStorage returns default value if unset', () => {
  setup();
  const value = screen.getByTestId("test-value").textContent;
  expect(value).toBe("default test value 123")
});

test('useLocalStorage setValue changes output', () => {
  setup();
  const button = screen.getByTestId("test-button");
  expect(button).toBeDefined();
  button.click();
  const value = screen.getByTestId("test-value").textContent;
  expect(value).toBe("new test value 4567");
});
