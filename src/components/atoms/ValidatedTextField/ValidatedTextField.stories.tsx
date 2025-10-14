import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";

import { ValidatedTextField } from "./ValidatedTextField";

export default {
  component: ValidatedTextField,
} as ComponentMeta<typeof ValidatedTextField>;

const Template: ComponentStory<typeof ValidatedTextField> = (args) => {
  return (
    <ValidationContext.Provider
      value={
        new ValidationController({
          ["test-123"]: (val) => val.length > 0 && val !== "fail",
        })
      }
    >
      <ValidatedTextField {...args} />
    </ValidationContext.Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  id: "test-123",
};
