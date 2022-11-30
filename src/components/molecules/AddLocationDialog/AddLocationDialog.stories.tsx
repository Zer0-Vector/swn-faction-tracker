import React, { ComponentProps } from "react";

import { Meta, Story } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import LocationInfo from "../../../types/LocationInfo";
import { IGameState } from "../../../types/RuntimeGameState";

import AddLocationDialog from "./AddLocationDialog";

type PropsType = ComponentProps<typeof AddLocationDialog>;

export default {
  component: AddLocationDialog,
} as Meta<PropsType>;

interface MockProviderProps {
  children: React.ReactNode;
  locations: LocationInfo[];
}

const MockProvider = ({ locations, children }: MockProviderProps) => (
  <GameContext.Provider value={{
    state: {
      getLocations() {
        return locations;
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
