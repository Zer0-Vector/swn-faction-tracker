import React, { ComponentProps } from "react";

import { Meta, Story } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import LocationInfo from "../../../types/LocationInfo";
import { IGameState } from "../../../types/RuntimeGameState";
import { generateSlug } from "../../../utils/SlugGenerator";

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
        return !locations.map(info => info.slug).includes(generateSlug(locationName));
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
      slug: "existing-location",
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
