import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import AddAssetDialog from "./AddAssetDialog";

export default {
  component: AddAssetDialog,
} as ComponentMeta<typeof AddAssetDialog>;

export const Default: ComponentStory<typeof AddAssetDialog> = args => <AddAssetDialog {...args} />;
Default.args = {
  open: true,
};
