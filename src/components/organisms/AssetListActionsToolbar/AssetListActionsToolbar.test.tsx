import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import FactionInfo from "../../../types/FactionInfo";
import PurchasedAsset from "../../../types/PurchasedAsset";
import { IGameState } from "../../../types/RuntimeGameState";

import AssetListActionsToolbar from "./AssetListActionsToolbar";

const mockAddAsset = jest.fn();
const mockRemoveAsset = jest.fn();
const mockGetFaction = jest.fn();
const mockGetAsset = jest.fn();

const mockContext: GameContextType = {
  state: {
    getFaction: mockGetFaction as (fid:string)=>FactionInfo,
    getAsset: mockGetAsset as (fid:string,aid:string)=>PurchasedAsset,
  } as IGameState,
  controller: {
    addAsset: mockAddAsset as (fid: string, an: string)=>PurchasedAsset,
    removeAsset: mockRemoveAsset as (fid: string, aid: string)=>void,
  } as IGameController,
};

const mockFaction = {
  id: "test-faction",
  name: "Test Faction",
} as FactionInfo;

const  TestComp = () => {
  const { pathname } = useLocation();
  return (
    <>
      <div data-testid="test-location">{pathname}</div>
      <GameContext.Provider value={mockContext}>
        <AssetListActionsToolbar />
      </GameContext.Provider>
    </>
  );
};

function renderIt(routes = ["/"]) {
  render(
    <MemoryRouter initialEntries={routes}>
      <TestComp />
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockGetFaction.mockImplementationOnce(() => mockFaction);
});

describe('default AssetListActionsToolbar', () => {
  it('renders', () => {
    renderIt();
    const alat = screen.getByTestId("asset-lat");
    expect(alat).toBeInTheDocument();
  });

  it('when location does not have assetId, remove button is disabled', () => {
    renderIt();
    const alat = screen.getByTestId("asset-lat");
    const add = within(alat).getByTestId("lat-add");
    expect(add).toBeInTheDocument();
    expect(add).not.toBeDisabled();

    const remove = within(alat).getByTestId("lat-remove");
    expect(remove).toBeInTheDocument();
    expect(remove).toBeDisabled();
  });

  it('add button opens AddAssetDialog', () => {
    renderIt();
    const alat = screen.getByTestId("asset-lat");
    const add = within(alat).getByTestId("lat-add");
    let dialog = screen.queryByTestId("add-asset-dialog");
    expect(dialog).not.toBeInTheDocument();
    fireEvent.click(add);
    
    dialog = screen.getByTestId("add-asset-dialog");
    expect(dialog).toBeInTheDocument();
  });

  it('adding asset calls controller', () => {
    renderIt(["/factions/test-faction"]);
    const alat = screen.getByTestId("asset-lat");
    const add = within(alat).getByTestId("lat-add");
    fireEvent.click(add);
    const dialog = screen.getByTestId("add-asset-dialog");
    
    // open drop down
    const openAutocomplete = within(dialog).getByTitle("Open");
    fireEvent.click(openAutocomplete);
    
    // select option
    const list = screen.getByRole("listbox");
    const allOptions = within(list).getAllByRole("option");
    const option = allOptions[Math.floor(Math.random() * allOptions.length)];
    const optionText = option.textContent;
    fireEvent.click(option);

    const btnAdd = within(dialog).getByText("Add");
    fireEvent.click(btnAdd);
    expect(mockContext.controller.addAsset).toBeCalledTimes(1);
    expect(mockContext.controller.addAsset).toBeCalledWith("test-faction", optionText);
  });
});

describe('asset selected AssetListActionsToolbar', () => {
  it('when asset selected, remove button is enabled', () => {
    renderIt(["/factions/test-faction/assets/test-asset-1"]);
    const alat = screen.getByTestId("asset-lat");
    const add = within(alat).getByTestId("lat-add");
    expect(add).toBeInTheDocument();
    expect(add).not.toBeDisabled();

    const remove = within(alat).getByTestId("lat-remove");
    expect(remove).toBeInTheDocument();
    expect(remove).not.toBeDisabled();
  });

  it('when remove button enabled, click shows confirm dialog', () => {
    renderIt(["/factions/test-faction/assets/test-asset-1"]);
    const alat = screen.getByTestId("asset-lat");
    const fabRemove = within(alat).getByTestId("lat-remove");
    let dlgRemove = screen.queryByTestId("remove-asset-dialog");
    expect(dlgRemove).not.toBeInTheDocument();
    fireEvent.click(fabRemove);

    dlgRemove = screen.getByTestId("remove-asset-dialog");
    expect(dlgRemove).toBeInTheDocument();
  });

  it('confirm remove asset calls controller and navs to faction', () => {
    renderIt(["/factions/test-faction/assets/test-asset-1"]);
    const alat = screen.getByTestId("asset-lat");
    const fabRemove = within(alat).getByTestId("lat-remove");
    expect(fabRemove).not.toBeDisabled();
    fireEvent.click(fabRemove);
    const dlgRemove = screen.getByTestId("remove-asset-dialog");
    expect(dlgRemove).toBeInTheDocument();
    const btnConfirm = within(dlgRemove).getByText("Remove");
    expect(btnConfirm).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(btnConfirm);
    expect(mockContext.controller.removeAsset).toBeCalledTimes(1);
    expect(mockContext.controller.removeAsset).toBeCalledWith("test-faction", "test-asset-1");
    const loc = screen.getByTestId("test-location");
    expect(loc.textContent).toBe("/factions/test-faction");
  });
});
