import { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import type FormInfo from "@/types/FormInfo";

export type FormInfoSetter = (val: FormInfo) => void;
export type StringValidator = (val: string) => boolean;

export const BLANK_FORM_INFO: FormInfo = { value: "", valid: false };

export interface LocationDialogFieldHandles {
  readonly getValue: () => string;
  readonly isValid: () => boolean;
  readonly reset: () => void;
  readonly focus: () => void;
}

export interface LocationDialogTextFieldProps {
  readonly onValidityChange?: (valid: boolean) => void;
}

export const isInteger = (val: string) => {
  try {
    Number.parseInt(val);
    return true;
  } catch {
    return false;
  }
};

/**
 * @returns A callback for onChange/onInput events
 */
export const getInputHandler =
  (setter: FormInfoSetter, validator?: StringValidator) =>
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newText = evt.target.value;
      const isValid = validator === undefined || validator(newText);
      const isNotBlank = newText !== undefined && newText.trim().length > 0;
      const newState = {
        value: newText,
        valid: isNotBlank && isValid,
      };

      setter(newState);
    };

export const useLocationDialogHooks =
  (
    validator: (value: string) => boolean,
    ref: React.ForwardedRef<LocationDialogFieldHandles>,
    onValidityChange: LocationDialogTextFieldProps["onValidityChange"],
  ) => {

    const [info, setInfo] = useState<FormInfo>(BLANK_FORM_INFO);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      onValidityChange?.(info.valid);
    }, [onValidityChange, info.valid]);

    useImperativeHandle(ref, () => ({
      getValue: () => info.value,
      isValid: () => info.valid,
      reset: () => setInfo(BLANK_FORM_INFO),
      focus: () => inputRef.current?.focus(),
    }), [info.value]);

    const inputHandler = useMemo(() => getInputHandler(setInfo, validator), [validator]);

    return { info, inputRef, inputHandler };
  };

