import React, { useMemo } from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AssetContext, AssetPoset } from "../../../contexts/AssetContext";
import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import FactionInfo from "../../../utils/FactionInfo";
import PurchasedAsset from "../../../utils/PurchasedAsset";

import AssetList from "./AssetList";

interface MockProviderProps extends RequiredChildrenProps {
  assetList: PurchasedAsset[];
}

const MockProvider = ({ children, assetList }: MockProviderProps) => {
  const factionContext = useMemo(() => ({
    factions: {
      slugGet: (_) => ({
        id: "test",
        slug: "test",
        name: "Test",
      } as FactionInfo),
    } as FactionPoset,
  }), []);

  const assetContext = useMemo(() => ({
    assets: {
      getAll() {
        return assetList;
      },
      subscribe(_) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => { };
      },
    } as AssetPoset,
  }), [assetList]);

  return (
    <FactionContext.Provider value={factionContext}>
      <AssetContext.Provider value={assetContext}>
        {children}
      </AssetContext.Provider>
    </FactionContext.Provider>
  );
};

export default {
  component: AssetList,
  decorators: [
    story => (
      <MemoryRouter initialEntries={["/factions/test"]}>
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
        factionId: "test",
        hp: 2,
      },
      {
        id: "3",
        name: "Blackmail",
        slug: "blackmail-1",
        factionId: "test",
        hp: 0,
      },
    ]}>
      {story()}
    </MockProvider>
  ),
];
