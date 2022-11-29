import React, { useState } from "react";

// import { useState } from "@storybook/addons";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import EditableDropDownText from "./EditableDropDownText";

export default {
  component: EditableDropDownText,
} as ComponentMeta<typeof EditableDropDownText>;

export const Default: ComponentStory<typeof EditableDropDownText> = args => {
  const [text, setText] = useState<string>(args.children);
  return (
    <EditableDropDownText {...args} onUpdate={s => { setText(s); args.onUpdate(s); }}>
      {text}
    </EditableDropDownText>
  );
};
Default.args = {
  children: "one",
  selectableOptions: ["one", "two", "three", "four"],
};
