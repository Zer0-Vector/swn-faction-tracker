import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { IGameState } from "../../../types/RuntimeGameState";
import { MockAction } from "../../__mocks__/MockAction";

import FactionListActionToolbar from "./FactionListActionToolbar";

export default {
  component: FactionListActionToolbar,
  decorators: [
    story => (
      <GameContext.Provider value={{
        controller: {
          ...MockAction("addFaction"),
          ...MockAction("removeFaction"),
        } as unknown as IGameController,
        state: {
          getFactions() {
            return [
              {
                id: "existing-faction",
                name: "Existing Faction",
              },
            ];
          },
          getFaction(factionId) {
            return {
              id: "test-faction",
              name: "Test Faction",
            };
          },
          getAsset(factionId, assetId) {
            return {};
          },
        } as IGameState,
      }}>
        {story()}
      </GameContext.Provider>
    ),
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
