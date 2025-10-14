import React, { useContext } from "react";

import { UiStateContext } from "../../../contexts/UiStateContext";
import EditableDropDownText, {
  EditableDropDownTextProps,
} from "../../atoms/EditableDropDownText";

export type ControlledDropDownProps = Readonly<
  Omit<EditableDropDownTextProps, "editable">
>;

export function ControlledDropDown(props: ControlledDropDownProps) {
  const { state } = useContext(UiStateContext);
  return (
    <EditableDropDownText {...props} editable={state.editMode === "EDIT"} />
  );
}
