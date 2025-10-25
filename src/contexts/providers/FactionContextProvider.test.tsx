import React from "react";
import { describe, it, vi, afterEach } from "vitest";
import { FactionContextProvider } from "./FactionContextProvider";
import { render, screen, waitFor } from "@testing-library/react";
import { FactionContext } from "../FactionContext";
import { LocationContext } from "../LocationContext";
import { LocationContextProvider } from "./LocationContextProvider";
import userEvent from "@testing-library/user-event";
import type Nullable from "@/types/Nullable";



describe("FactionContextProvider", () => {

  function renderIt(children: React.ReactNode) {
    render(
      <LocationContextProvider>
        <FactionContextProvider>
          {children}
        </FactionContextProvider>
      </LocationContextProvider>
    );
  }
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

  afterEach(() => {
    setItemSpy.mockClear();
    localStorage.clear();
  })

  it("initializes factions from local storage via useLocalStorage: empty", () => {
    const Consumer = () => {
      const { factions } = React.useContext(FactionContext);
      return (<div data-testid="factions">{JSON.stringify(factions.getAll())}</div>);
    };

    renderIt(<Consumer />);

    expect(screen.getByTestId("factions").textContent).toBe("[]");

  });

  it("persists factions to local storage when the FactionPoset changes", async () => {
    const Consumer = () => {
      const { factions } = React.useContext(FactionContext);
      return (
        <div>
          <button
            data-testid="add-faction"
            onClick={() => {
              factions.add({ name: "Federation" });
            }}
          >
            Add Faction
          </button>
        </div>
      );
    };

    renderIt(<Consumer />);
    await waitFor(() => {
      expect(screen.getByTestId("add-faction")).toBeInTheDocument();
    });
    setItemSpy.mockClear();

    const user = userEvent.setup();
    const addButton = screen.getByTestId("add-faction");
    await user.click(addButton);

    expect(setItemSpy).toHaveBeenCalledOnce();
    const results = JSON.parse(setItemSpy.mock.calls[0][1])
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Federation");
  });

  it("clears faction.homeworldId when a Location is removed via locations subscription", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    let locationId: Nullable<string> = null;

    const Consumer = () => {
      const { factions } = React.useContext(FactionContext);
      const { locations } = React.useContext(LocationContext);
      return (
        <div>
          <button
            data-testid="add-faction"
            onClick={() => {
              const f = factions.add({ name: "Federation2" });
              const loc = locations.add({ name: "Earth", tl: 5, x: 0, y: 0, });
              locationId = loc.id;
              factions.update(f.id, "homeworldId", locationId);
            }}
          >
            Add Faction
          </button>
          <button
            data-testid="remove-location"
            onClick={() => {
              if (locationId) {
                locations.remove(locationId);
                locationId = null;
              }
            }}
          >
            Remove Location
          </button>
        </div>
      );
    };

    const user = userEvent.setup();
    renderIt(<Consumer />);

    await waitFor(() => {
      expect(screen.getByTestId("add-faction")).toBeInTheDocument();
    });
    setItemSpy.mockClear();

    await user.click(screen.getByTestId("add-faction"));
    expect(locationId).not.toBeNull();

    expect(setItemSpy).toHaveBeenCalledTimes(2);
    const results = JSON.parse(setItemSpy.mock.calls[0][1])
    console.log("results after adding faction with homeworld:", results);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Federation2");
    expect(results[0].homeworldId).toBe(locationId);

    // now remove location
    setItemSpy.mockClear();
    await user.click(screen.getByTestId("remove-location"));

    expect(setItemSpy).toHaveBeenCalledOnce();
    const updatedResults = JSON.parse(setItemSpy.mock.calls[0][1])
    expect(updatedResults).toHaveLength(1);
    expect(updatedResults[0].name).toBe("Federation2");
    expect(updatedResults[0].homeworldId).toBeUndefined();

  });
});
