import React from "react";
import { MemoryRouter } from "react-router-dom";

import { render, screen } from "@testing-library/react";

import { AssetContext, AssetPoset } from "../../../contexts/AssetContext";
import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import PurchasedAsset from "../../../utils/PurchasedAsset";

import AssetList from "./AssetList";
import { describe, expect, it } from "vitest";

function renderIt(assets: PurchasedAsset[], route = "/factions/test-faction") {
  render(
    <MemoryRouter initialEntries={[route]}>
      <FactionContext.Provider value={{
        factions: {
          slugGet: (factionSlug) => ({
            id: "123",
            slug: factionSlug,
            name: factionSlug.replaceAll(/-/g, " "),
          }),
          subscribe: vi.fn() as FactionPoset['subscribe'],
        } as FactionPoset,
      }}>
        <AssetContext.Provider value={{
          assets: {
            getAll: () => assets,
            subscribe(callback) {
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              return () => {};
            },
          } as AssetPoset,
        }}>
          <AssetList />
        </AssetContext.Provider>
      </FactionContext.Provider>
    </MemoryRouter>
  );
}

describe('AssetList', () => {
  it('renders with no assets', () => {
    renderIt([]);
    expect(screen.getByText("No Assets")).toBeInTheDocument();
  });

  it('renders with no faction', () => {
    renderIt([], "/factions");
    expect(screen.getByText("No faction selected!")).toBeInTheDocument();
  });

  it.todo('renders with one asset');
  it.todo('renders with three assets');
  it.todo('renders expanded when asset is selected');
});
