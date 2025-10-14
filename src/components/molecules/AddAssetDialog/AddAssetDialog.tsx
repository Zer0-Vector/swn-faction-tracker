import React, { useCallback, useMemo, useState } from "react";

import { SxProps } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import ASSETS from "../../../data/Assets";
import type Nullable from "../../../types/Nullable";
import TextUtils from "../../../utils/TextUtils";
import MessageDialog from "../../atoms/MessageDialog";
import type { DialogActionHandler } from "../../atoms/MessageDialog/MessageDialog";

interface AddAssetDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onAdd: (key: string) => void;
}

interface AssetOption {
  name: string;
  group: string;
  disabled: boolean;
}

export default function AddAssetDialog({
  open,
  onClose,
  onAdd,
}: AddAssetDialogProps) {
  const [selection, setSelection] = useState<string>("");

  const options = useMemo(
    () =>
      Object.entries(ASSETS)
        .filter(([name]) => name !== "Base of Influence")
        .map(([name, item]) => {
          const group = `${TextUtils.titleCase(item.attribute)} ${item.level}`;
          return {
            name: name,
            group: group,
          } as AssetOption;
        }),
    []
  );

  const handleSelectionChanged = useCallback(
    (_evt: React.SyntheticEvent, value: Nullable<AssetOption>) => {
      if (value === null) {
        setSelection("");
      } else {
        setSelection(value.name);
      }
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelection("");
    onClose();
  }, [onClose]);

  const formControlSx = useMemo<SxProps>(() => ({ my: 1, minWidth: 200 }), []);
  const autoGroupBy = useCallback((o: AssetOption): string => o.group, []);
  const autoOptLabel = useCallback((o: AssetOption): string => o.name, []);
  const optionsAreEqual = useCallback(
    (o: AssetOption, v: AssetOption): boolean =>
      o.group === v.group && o.name === v.name,
    []
  );
  // ? extract TextField to custom component with React.memo?
  const autoRenderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        label="Select Asset"
        data-testid="selection-field"
      />
    ),
    []
  );

  const handleAction = useCallback<DialogActionHandler>(
    (result) => {
      handleClose();
      if (result.reason === "Add" && selection !== "") {
        onAdd(selection);
      }
    },
    [handleClose, onAdd, selection]
  );

  return (
    <MessageDialog
      open={open}
      title="Add Asset"
      message="Select an asset to add."
      buttons={["Cancel", "Add"]}
      onAction={handleAction}
      data-testid="add-asset-dialog"
      fullWidth={false}
    >
      <FormControl sx={formControlSx}>
        <Autocomplete
          id="asset-select-field"
          options={options}
          groupBy={autoGroupBy}
          getOptionLabel={autoOptLabel}
          isOptionEqualToValue={optionsAreEqual}
          disableClearable={true}
          onChange={handleSelectionChanged}
          renderInput={autoRenderInput}
          data-testid="asset-autocomplete"
        />
      </FormControl>
    </MessageDialog>
  );
}
