import React, { useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import EditableStatText, { EditableStatTextProps } from "../../atoms/EditableStatText";

export type ControlledStatProps = Omit<EditableStatTextProps, "editable">;

export function ControlledStat(props: ControlledStatProps) {
  const { state } = useContext(UiStateContext);
  return (
    <EditableStatText {...props} editable={state.editMode === "EDIT"} />
  );
}
