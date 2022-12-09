import React, { ComponentProps } from "react";

import { Meta, Story } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import LocationInfo from "../../../types/LocationInfo";
import { IGameState } from "../../../types/RuntimeGameState";
import { generateId } from "../../../utils/IdGenerator";

import AddLocationDialog from "./AddLocationDialog";

type PropsType = ComponentProps<typeof AddLocationDialog>;

export default {
  component: AddLocationDialog,
} as Meta<PropsType>;

interface MockProviderProps extends RequiredChildrenProps {
  locations: LocationInfo[];
}

const MockProvider = ({ locations, children }: MockProviderProps) => (
  <GameContext.Provider value={{
    state: {
      getLocations() {
        return locations;
      },
      checkLocationName(locationName) {
        return !locations.map(info => info.id).includes(generateId(locationName));
      },
    } as IGameState,
    controller: {} as IGameController,
  }}>
    {children}
  </GameContext.Provider>
);

export const Default: Story<PropsType> = args => (
  <MockProvider locations={[
    {
      id: "existing-location",
      name: "Existing Location",
      tl: 0,
      x: 0,
      y: 0,
    },
  ]}>
    <AddLocationDialog {...args} />
  </MockProvider>
);
Default.args = {
  open: true,
};
