import React, { useCallback, useContext, useState } from "react";

import TextField, { TextFieldProps } from "@mui/material/TextField";

import { ValidationContext } from "../../../contexts/ValidationContext";
import TestableProps from "../../../types/TestableProps";

type ValidatedTextFieldProps =
  & TextFieldProps
  & Required<Pick<TextFieldProps, "id">>
  & TestableProps;

export function ValidatedTextField({ onChange, id, error, ...others }: ValidatedTextFieldProps) {
  const validation = useContext(ValidationContext);
  const [valid, setValid] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    !changed && setChanged(true);
    const valid = !!evt.target.value || !others.required;
    try {
      const validationResult = validation.validate(id, evt.target.value);
      setValid(valid && validationResult);
    } catch (e) {
      console.error(e);
    } finally {
      onChange && onChange(evt);
    }
  }, [changed, id, onChange, others.required, validation]);

  return (
    <TextField
      {...others}
      onChange={handleChange}
      error={changed && !valid && (error === undefined || error)}
    />
  );
}
