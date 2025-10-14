import React, { useMemo } from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";

import FactionListItem from "./FactionListItem";

interface MockProviderProps extends RequiredChildrenProps {
  factions: FactionPoset;
}

const MockProvider = ({ factions, children }: MockProviderProps) => {
  const context = useMemo(() => ({ factions }), [factions]);
  return (
    <FactionContext.Provider value={context}>
      {children}
    </FactionContext.Provider>
  );
};

const mockedFactions: FactionPoset = {
  getAll: () => {
    return [
      {
        slug: "test-faction-stored",
        name: "Test Faction Stored",
      },
    ];
  },
} as FactionPoset;

export default {
  component: FactionListItem,
  decorators: [
    (story) => <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>,
    (story) => <MockProvider factions={mockedFactions}>{story()}</MockProvider>,
  ],
} as ComponentMeta<typeof FactionListItem>;

const Template: ComponentStory<typeof FactionListItem> = (args) => {
  return <FactionListItem {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  faction: {
    id: "test",
    slug: "test-faction",
    name: "Test Faction",
    force: 11,
    cunning: 22,
    wealth: 33,
    hp: 8,
    maxHp: 16,
    xp: 999,
  },
};
