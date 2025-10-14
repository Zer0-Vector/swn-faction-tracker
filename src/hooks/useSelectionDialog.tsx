import React, { useCallback, useContext, useRef } from "react";

import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { DialogContext, DialogOptions } from "../contexts/DialogContext";
import Nullable from "../types/Nullable";

export type SelectionDialogOptions<T> = Omit<
  DialogOptions<T>,
  "children" | "fetchData"
> & {
  options: T[];
  getOptionLabel: (option: T) => string;
};

export function useSelectionDialog<T>() {
  const showDialog = useContext(DialogContext);
  const data = useRef<Nullable<T>>(null);
  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => <TextField {...params} />,
    []
  );

  return useCallback(
    (options: SelectionDialogOptions<T>) =>
      showDialog({
        title: options.title,
        message: options.message,
        buttons: options.buttons,
        closeable: options.closeable,
        fullWidth: options.fullWidth,
        modal: options.modal,
        fetchData: () => data.current,
        children: (
          <Autocomplete
            options={options.options}
            getOptionLabel={(opt) => options.getOptionLabel(opt)}
            renderInput={renderInput}
            onChange={(_, val) => (data.current = val)}
          />
        ),
      }),
    [data, renderInput, showDialog]
  );
}
