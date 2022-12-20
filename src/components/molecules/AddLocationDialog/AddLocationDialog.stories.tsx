import React, { ComponentProps } from "react";

import { Meta, Story } from "@storybook/react";

import { LocationContext, LocationsPoset } from "../../../contexts/LocationContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import LocationInfo from "../../../types/LocationInfo";
import { generateSlug } from "../../../utils/SlugGenerator";

import AddLocationDialog from "./AddLocationDialog";

type PropsType = ComponentProps<typeof AddLocationDialog>;

export default {
  component: AddLocationDialog,
} as Meta<PropsType>;

interface MockProviderProps extends RequiredChildrenProps {
  locations: LocationInfo[];
}

const MockProvider = ({ locations, children }: MockProviderProps) => (
  <LocationContext.Provider value={{
    locations: {
      getAll() {
        return locations;
      },
      checkName(args) {
        return !locations.map(info => info.slug).includes(generateSlug(args.name));
      },
    } as LocationsPoset,
  }}>
    {children}
  </LocationContext.Provider>
);

export const Default: Story<PropsType> = args => (
  <MockProvider locations={[
    {
      id: "123",
      slug: "existing-location",
      name: "Existing Location",
      tl: 0,
      x: 0,
      y: 0,
    },
  ]}>
    <AddLocationDialog {...args} />
  </MockProvider>
);
Default.args = {
  open: true,
};
