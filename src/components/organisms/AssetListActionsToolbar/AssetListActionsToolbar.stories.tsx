import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AssetContext, AssetPoset } from "../../../contexts/AssetContext";
import {
  FactionContext,
  FactionContextType,
  FactionPoset,
} from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import FactionInfo from "../../../utils/FactionInfo";
import PurchasedAsset from "../../../utils/PurchasedAsset";
import UiState from "../../../types/UiState";

import AssetListActionsToolbar from "./AssetListActionsToolbar";

export default {
  component: AssetListActionsToolbar,
  decorators: [
    (story) => (
      <FactionContext.Provider
        value={
          {
            factions: {
              slugGet(_) {
                return {} as FactionInfo;
              },
            } as FactionPoset,
          } as FactionContextType
        }
      >
        <AssetContext.Provider
          value={{
            assets: {
              slugGet(_) {
                return {
                  hp: 1,
                  id: "1",
                  name: "Smugglers",
                  slug: "smugglers-1",
                  factionId: "test",
                } as PurchasedAsset;
              },
            } as AssetPoset,
          }}
        >
          {story()}
        </AssetContext.Provider>
      </FactionContext.Provider>
    ),
    (story) => (
      <UiStateContext.Provider
        value={{
          state: {
            editMode: "EDIT",
          } as UiState,
          controller: {} as UiStateController,
        }}
      >
        {story()}
      </UiStateContext.Provider>
    ),
  ],
} as ComponentMeta<typeof AssetListActionsToolbar>;

const Template: ComponentStory<typeof AssetListActionsToolbar> = () => (
  <AssetListActionsToolbar />
);

export const Default = Template.bind({});
Default.decorators = [(story) => <MemoryRouter>{story()}</MemoryRouter>];

export const Removable = Template.bind({});
Removable.decorators = [
  (story) => (
    <MemoryRouter
      initialEntries={["/factions/test-faction/assets/smugglers-1"]}
      initialIndex={0}
    >
      {story()}
    </MemoryRouter>
  ),
];
