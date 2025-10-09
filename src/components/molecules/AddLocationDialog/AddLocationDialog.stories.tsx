import React, { useMemo } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LocationContext, LocationsPoset } from "../../../contexts/LocationContext";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import LocationInfo from "../../../utils/LocationInfo";
import { generateSlug } from "../../../utils/SlugGenerator";

import AddLocationDialog from "./AddLocationDialog";

export default {
  component: AddLocationDialog,
} as ComponentMeta<typeof AddLocationDialog>;

interface MockProviderProps extends RequiredChildrenProps {
  locations: LocationInfo[];
}

const MockProvider = ({ locations, children }: MockProviderProps) => {
  const locationContext = useMemo(() => ({
    locations: {
      getAll() {
        return locations;
      },
      checkName(args) {
        return !locations.map(info => info.slug).includes(generateSlug(args.name));
      },
    } as LocationsPoset,
  }), [locations]);

  return (
    <LocationContext.Provider value={locationContext}>
      {children}
    </LocationContext.Provider>
  );
};

export const Default: ComponentStory<typeof AddLocationDialog> = args => (
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
