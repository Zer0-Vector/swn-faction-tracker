import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AssetContext, AssetPoset } from "../../../contexts/AssetContext";
import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { UiStateContext } from "../../../contexts/UiStateContext";
import { UiStateController } from "../../../controllers/UiStateController";
import UiState from "../../../types/UiState";

import FactionListActionToolbar from "./FactionListActionToolbar";

export default {
  component: FactionListActionToolbar,
  decorators: [
    story => (
      <FactionContext.Provider value={{
        factions: {
          getAll() {
            return [
              {
                id: "1",
                slug: "existing-faction",
                name: "Existing Faction",
              },
            ];
          },
          get(factionId) {
            return {
              id: "2",
              slug: "test-faction",
              name: "Test Faction",
            };
          },
        } as FactionPoset,
      }}>
        <AssetContext.Provider value={{
          assets: {
            get(_) {
              return {};
            },
          } as AssetPoset,
        }}>
          {story()}
        </AssetContext.Provider>
      </FactionContext.Provider>
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
} as ComponentMeta<typeof FactionListActionToolbar>;

const Template: ComponentStory<typeof FactionListActionToolbar> = () => <FactionListActionToolbar />;

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
      initialEntries={["/factions/test-faction/assets/informers-1"]}
      initialIndex={0}
    >
      {story()}
    </MemoryRouter>
  ),
];
