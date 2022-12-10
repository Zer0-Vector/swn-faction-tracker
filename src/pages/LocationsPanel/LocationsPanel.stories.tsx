import React from "react";
import { MemoryRouter } from "react-router-dom";

import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { IGameController } from "../../controllers/GameController";
import { UiStateController } from "../../controllers/UiStateController";
import { RequiredChildrenProps } from "../../types/ChildrenProps";
import LocationInfo from "../../types/LocationInfo";
import { IGameState } from "../../types/RuntimeGameState";
import UiState from "../../types/UiState";
import { generateId } from "../../utils/IdGenerator";

import LocationsPanel from "./LocationsPanel";

interface MockProviderProps extends RequiredChildrenProps {
  state: IGameState;
  controller: IGameController;
}

const MockProvider = ({ children, state, controller }: MockProviderProps) => (
  <GameContext.Provider value={{
    state,
    controller,
  }}>
    {children}
  </GameContext.Provider>
);

const locations = [
  {
    id: "test-loc-1",
    name: "Test Loc 1",
    tl: 1,
    x: 0,
    y: 1,
  },
  {
    id: "test-loc-2",
    name: "Test Loc 2 has a Medium Length Name",
    tl: 2,
    x: 2,
    y: 3,
  },
  {
    id: "test-loc-3",
    name: "Test Loc 3 has a Really Long Name That Continues On and On For a Long Time",
    tl: 3,
    x: 4,
    y: 5,
  },
];

const getMockedState = (locations: LocationInfo[]) => ({
  getLocations() {
    return locations;
  },
  getLocation(locationId) {
    return locations.find(v => v.id === locationId);
  },
  checkLocationName(locationName) {
    return !locations.map(l => l.id).includes(generateId(locationName));
  },
} as IGameState);

const MockedController = {
  addLocation(info) {
    action("addLocation")(info);
  },
  reorderLocations(source, destination?) {
    action("reorderLocations")(source, destination);
  },
  removeLocation(selectedLocation) {
    action("removeLocation")(selectedLocation);
  },
  updateLocationName(curr, val) {
    action("updateLocationName")(curr, val);
  },
} as IGameController;

export default {
  component: LocationsPanel,
  decorators: [
    story => (
      <MemoryRouter initialEntries={["/"]}>
        {story()}
      </MemoryRouter>
    ),
    story => <UiStateContext.Provider value={{
      state: {
        editMode: "EDIT",
      } as UiState,
      controller: {} as UiStateController,
    }}>
      {story()}
    </UiStateContext.Provider>,
  ],
} as ComponentMeta<typeof LocationsPanel>;

const Template: ComponentStory<typeof LocationsPanel> = () => <LocationsPanel />;

export const Default = Template.bind({});
Default.decorators = [
  story => (
    <MockProvider state={getMockedState(locations)} controller={MockedController}>
      {story()}
    </MockProvider>
  ),
];

export const Empty = Template.bind({});
Empty.decorators = [
  story => (
    <MockProvider state={getMockedState([])} controller={MockedController}>
      {story()}
    </MockProvider>
  ),
];
