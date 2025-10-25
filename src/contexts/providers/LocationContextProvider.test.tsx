import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, it } from "vitest";
import { LocationContextProvider } from "./LocationContextProvider";
import { LocationContext } from "../LocationContext";



describe("LocationContextProvider", () => {

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("renders children without crashing", () => {

    render(
      <LocationContextProvider>
        <div>Test child</div>
      </LocationContextProvider>
    );

    expect(screen.getByText("Test child")).toBeDefined();
  });

  it("creates a LocationsPoset from stored locations (uses useLocalStorage initial value)", () => {
    const stored = [{ id: "loc-1", slug: "alpha", name: "Alpha" }];
    const storageKey = "swn-faction-tracker.locations";
    localStorage.setItem(storageKey, JSON.stringify(stored));

    function Consumer() {
      const { locations } = React.useContext(LocationContext);
      const items = locations.getAll();
      return (
        <div data-testid="items">
          {JSON.stringify(items)}
        </div>
      );
    }

    render(
      <LocationContextProvider>
        <Consumer />
      </LocationContextProvider>
    );

    const text = screen.getByTestId("items").textContent || "[]";
    expect(JSON.parse(text)).toEqual(stored);
  });

  it('persists poset changes to local storage using the key "swn-faction-tracker.locations"', async () => {
    let item = { id: "loc-1", slug: "alpha", name: "Alpha" };
    const mockLocalStorage = vi.mockObject({
      getItem: vi.fn((key: string) => {
        console.log("mockLocalStorage.getItem called with key:", key);
        return JSON.stringify([item]);
      }),
      setItem: vi.fn((key: string, value: string) => {
        console.log("mockLocalStorage.setItem called with key:", key, "value:", value);
        item = JSON.parse(value)[0];
      }),
    });
    vi.stubGlobal("localStorage", mockLocalStorage);

    function Consumer() {
      const { locations } = React.useContext(LocationContext);
      console.log("Rendering Consumer...");
      return <button data-testid="done" onClick={() => locations.update("loc-1", "name", "Alpha Updated")}>done</button>;
    }

    const user = userEvent.setup();
    render(
      <LocationContextProvider>
        <Consumer />
      </LocationContextProvider>
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledOnce();
    expect(mockLocalStorage.setItem).toHaveBeenCalledOnce();

    user.click(screen.getByTestId("done"));

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
    });

    const saved = JSON.parse(mockLocalStorage.setItem.mock.calls[1][1]);
    console.log("Saved to localStorage:", saved);
    expect(item.name).toBe("Alpha Updated");
    expect(saved[0].name).toBe("Alpha Updated");
  });
});
