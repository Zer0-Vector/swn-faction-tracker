import React from "react";
import { MemoryRouter, useLocation } from "react-router-dom";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { AssetContext, AssetContextType, AssetPoset } from "../../../contexts/AssetContext";
import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../types/FactionInfo";
import UiState from "../../../types/UiState";

import AssetListActionsToolbar from "./AssetListActionsToolbar";

const mockAddAsset = jest.fn();
const mockRemoveAsset = jest.fn();
const mockGetFaction = jest.fn();
const mockGetAsset = jest.fn();
const mockGetId = jest.fn();

const mockFactionContext: FactionContextType = {
  factions: {
    slugGet: mockGetFaction as FactionPoset['slugGet'],
  } as FactionPoset,
};

const mockContext: AssetContextType = {
  assets: {
    slugGet: mockGetAsset as AssetPoset['slugGet'],
    add: mockAddAsset as AssetPoset['add'],
    remove: mockRemoveAsset as AssetPoset['remove'],
    getId: mockGetId as AssetPoset['getId'],
  } as AssetPoset,
};

const mockFaction = {
  id: "test-faction-1234",
  slug: "test-faction",
  name: "Test Faction",
} as FactionInfo;

const  TestComp = () => {
  const { pathname } = useLocation();
  const uiStateContext = React.useMemo(() => ({
      state: {
        editMode: "EDIT",
        loginState: "LOGGED_IN",
      } as UiState,
      controller: {} as UiStateController,
    }), []);
  return (
    <UiStateContext.Provider value={uiStateContext}>
      <div data-testid="test-location">{pathname}</div>
      <FactionContext.Provider value={mockFactionContext}>
        <AssetContext.Provider value={mockContext}>
          <AssetListActionsToolbar />
        </AssetContext.Provider>
      </FactionContext.Provider>
    </UiStateContext.Provider>
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
    mockGetFaction.mockImplementationOnce(() => mockFaction);
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
    expect(mockContext.assets.add).toBeCalledTimes(1);
    expect(mockContext.assets.add).toBeCalledWith({ factionId: "test-faction-1234", name: optionText });
  });
});

describe('asset selected AssetListActionsToolbar', () => {
  beforeEach(() => {
    mockGetId.mockImplementationOnce(() => "test-1234");
  });
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
    expect(mockContext.assets.remove).toBeCalledTimes(1);
    expect(mockContext.assets.remove).toBeCalledWith("test-1234");
    const loc = screen.getByTestId("test-location");
    expect(loc.textContent).toBe("/factions/test-faction");
  });
});
