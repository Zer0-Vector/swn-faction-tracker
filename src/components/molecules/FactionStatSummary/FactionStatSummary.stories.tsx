import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { FactionContext, FactionPoset } from "../../../contexts/FactionContext";
import { MockAction } from "../../__mocks__/MockAction";

import FactionStatSummary from "./FactionStatSummary";

export default {
  component: FactionStatSummary,
  decorators: [
    story => (
      <FactionContext.Provider value={{
        factions: {
          ...MockAction("update"),
        } as unknown as FactionPoset,
      }}>
        {story()}
      </FactionContext.Provider>
    ),
  ],
} as ComponentMeta<typeof FactionStatSummary>;

const Template: ComponentStory<typeof FactionStatSummary> = args => <FactionStatSummary {...args} />;

export const Default = Template.bind({});
Default.args = {
  factionId: "test-123",
  force: 1,
  cunning: 2,
  wealth: 3,
};
