import React, { useMemo } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import { Named } from "../../../utils/NamedElementPoset";
import { generateSlug } from "../../../utils/SlugGenerator";

import AddFactionDialog from "./AddFactionDialog";

export default {
  component: AddFactionDialog,
} as ComponentMeta<typeof AddFactionDialog>;

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

const MockFactions = {
  checkName: (s: Named<{}>) => generateSlug(s.name) !== "test-1" && generateSlug(s.name) !== "test-2",
} as FactionPoset;

export const Default: ComponentStory<typeof AddFactionDialog> = args => <AddFactionDialog {...args} />;
Default.args = {
  open: true,
};
Default.decorators = [
  story => (
    <MockProvider factions={MockFactions}>
      {story()}
    </MockProvider>
  ),
];
