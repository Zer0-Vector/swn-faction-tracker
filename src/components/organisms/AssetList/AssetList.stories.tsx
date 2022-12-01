import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { GameContext } from "../../../contexts/GameContext";
import { IGameController } from "../../../controllers/GameController";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import PurchasedAsset from "../../../types/PurchasedAsset";
import { IGameState } from "../../../types/RuntimeGameState";

import AssetList from "./AssetList";

interface MockProviderProps extends RequiredChildrenProps {
  assetList: PurchasedAsset[];
}

const MockProvider = ({ children, assetList }: MockProviderProps) => (
  <GameContext.Provider value={{
    controller: {} as IGameController,
    state: {
      getAssets(factionId) {
        return assetList;
      },
    } as IGameState,
  }}>
    {children}
  </GameContext.Provider>
);

export default {
  component: AssetList,
  decorators: [
    story => (
      <MemoryRouter>
        {story()}
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof AssetList>;

const Template: ComponentStory<typeof AssetList> = () => <AssetList />;

export const Empty = Template.bind({});
Empty.decorators = [
  story => (
    <MockProvider assetList={[]}>
      {story()}
    </MockProvider>
  ),
];

export const OneAsset = Template.bind({});
OneAsset.decorators = [
  story => (
    <MockProvider assetList={[
      {
        id: {
          displayName: "Smugglers",
          index: 1,
        },
        hp: 1,
      },
    ]}>
      {story()}
    </MockProvider>
  ),
];

export const ThreeAssets = Template.bind({});
ThreeAssets.decorators = [
  story => (
    <MockProvider assetList={[
      {
        id: {
          displayName: "Smugglers",
          index: 1,
        },
        hp: 1,
      },
      {
        id: {
          displayName: "Informers",
          index: 1,
        },
        hp: 2,
      },
      {
        id: {
          displayName: "Blackmail",
          index: 1,
        },
        hp: 0,
      },
    ]}>
      {story()}
    </MockProvider>
  ),
];
