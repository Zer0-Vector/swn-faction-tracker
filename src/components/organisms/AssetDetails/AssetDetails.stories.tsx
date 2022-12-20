import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import AssetDetails from "./AssetDetails";

export default {
  component: AssetDetails,
} as ComponentMeta<typeof AssetDetails>;

const Template: ComponentStory<typeof AssetDetails> = args => <AssetDetails {...args} />;

export const SmugglersDetails = Template.bind({});
SmugglersDetails.args = {
  asset: {
    hp: 2,
    id: "test",
    name: "Smugglers",
    slug: "smugglers-1",
    factionId: "test",
  },
};
