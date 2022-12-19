import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AssetContext, AssetPoset } from "../../../contexts/AssetContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import PurchasedAsset from "../../../types/PurchasedAsset";

import AssetList from "./AssetList";

interface MockProviderProps extends RequiredChildrenProps {
  assetList: PurchasedAsset[];
}

const MockProvider = ({ children, assetList }: MockProviderProps) => (
  <AssetContext.Provider value={{
    assets: {
      getAll() {
        return assetList;
      },
    } as AssetPoset,
  }}>
    {children}
  </AssetContext.Provider>
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
        id: "1",
        name: "Smugglers",
        factionId: "test",
        slug: "smugglers-1",
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
        id: "1",
        name: "Smugglers",
        slug: "smugglers-1",
        factionId: "test",
        hp: 1,
      },
      {
        id: "2",
        name: "Informers",
        slug: "informers-1",
        factionId: "test2",
        hp: 2,
      },
      {
        id: "3",
        name: "Blackmail",
        slug: "blackmail-1",
        factionId: "test3",
        hp: 0,
      },
    ]}>
      {story()}
    </MockProvider>
  ),
];
