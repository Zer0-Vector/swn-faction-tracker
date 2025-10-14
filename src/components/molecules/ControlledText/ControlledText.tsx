import React, { useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import EditableText, { EditableTextProps } from "../../atoms/EditableText";

export type ControlledTextProps = Readonly<Omit<EditableTextProps, "editable">>;

export function ControlledText(props: ControlledTextProps) {
  const { state } = useContext(UiStateContext);
  return <EditableText {...props} editable={state.editMode === "EDIT"} />;
}
