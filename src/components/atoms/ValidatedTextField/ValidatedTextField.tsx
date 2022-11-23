import React, { useCallback, useContext, useState } from "react";

import TextField, { TextFieldProps } from "@mui/material/TextField";

import { ValidationContext } from "../../../contexts/ValidationContext";
import TestableProps from "../../../types/TestableProps";

type ValidatedTextFieldProps =
  & TextFieldProps
  & Required<Pick<TextFieldProps, "id">>
  & TestableProps;

export function ValidatedTextField({ onChange, error, id, ...others }: ValidatedTextFieldProps) {
  const validation = useContext(ValidationContext);
  const [valid, setValid] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    !changed && setChanged(true);
    const valid = !!evt.target.value || !others.required;
    const validationResult = validation.validate(id, evt.target.value);
    try {
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
      error={error === undefined ? changed && !valid : error}
    />
  );
}
