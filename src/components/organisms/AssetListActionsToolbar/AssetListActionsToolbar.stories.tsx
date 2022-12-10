import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import FactionInfo from "../../../types/FactionInfo";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockActionController } from "../../__mocks__/MockActionController";

import AssetListActionsToolbar from "./AssetListActionsToolbar";
import { UiStateContext } from "../../../contexts/UiStateContext";
import UiState from "../../../types/UiState";
import { UiStateController } from "../../../controllers/UiStateController";

export default {
  component: AssetListActionsToolbar,
  decorators: [
    story => (
      <GameContext.Provider value={{
        state: {
          getFaction(factionId) {
            return {} as FactionInfo;
          },
          getAsset(factionId, assetId) {
            return {
              hp: 1,
              id: {
                displayName: "Smugglers",
                index: 1,
              },
            };
          },
        } as IGameState,
        controller: MockActionController,
      }}>
        {story()}
      </GameContext.Provider>
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
} as ComponentMeta<typeof AssetListActionsToolbar>;

const Template: ComponentStory<typeof AssetListActionsToolbar> = () => <AssetListActionsToolbar />;

export const Default = Template.bind({});
Default.decorators = [
  story => (
    <MemoryRouter>
      {story()}
    </MemoryRouter>
  ),
];

export const Removable = Template.bind({});
Removable.decorators = [
  story => (
    <MemoryRouter
      initialEntries={["/factions/test-faction/assets/smugglers-1"]}
      initialIndex={0}
    >
      {story()}
    </MemoryRouter>
  ),
];
