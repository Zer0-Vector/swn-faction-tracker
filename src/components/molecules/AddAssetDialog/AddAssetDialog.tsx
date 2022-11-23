import React, { useCallback, useMemo, useState } from "react";

import { SxProps } from "@mui/material";
import Autocomplete, { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import ASSETS from "../../../data/Assets";
import Nullable from "../../../types/Nullable";
import TextUtils from "../../../utils/TextUtils";

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string) => void;
}

interface AssetOption {
  name: string;
  group: string;
  disabled: boolean;
}

export default function AddAssetDialog({ open, onClose, onAdd }: AddAssetDialogProps) {
  const [selection, setSelection] = useState<string>("");
  
  const options = useMemo(() => (
    Object.entries(ASSETS)
      .filter(([name, _]) => name !== "Base of Influence")
      .map(([name, item]) => {
        const group = `${TextUtils.titleCase(item.attribute)} ${item.level}`;
        return {
          name: name,
          group: group,
        } as AssetOption;
      })
  ), []);

  const handleClose = useCallback(() => {
    setSelection("");
    onClose();
  }, [onClose]);

  const handleCancel = useCallback((evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    handleClose();
  }, [handleClose]);

  const handleAdd = useCallback((evt: React.FormEvent<HTMLElement>) => {
    evt.stopPropagation();
    if (selection !== "") {
      onAdd(selection);
      handleClose();
    }
  }, [handleClose, onAdd, selection]);

  const handleSelectionChanged = useCallback((_evt: React.SyntheticEvent, value: Nullable<AssetOption>) => {
    if (value === null) {
      setSelection("");
    } else {
      setSelection(value.name);
    }
  }, []);

  const formControlSx = useMemo<SxProps>(() => ({ my: 1, minWidth: 200 }), []);
  const autoGroupBy = useCallback((o: AssetOption): string => o.group, []);
  const autoOptLabel = useCallback((o: AssetOption): string => o.name, []);
  const optionsAreEqual = useCallback((o: AssetOption, v: AssetOption): boolean => o.group === v.group && o.name === v.name, []);
  // ? extract TextField to custom component with React.memo?
  const autoRenderInput = useCallback((params: AutocompleteRenderInputParams) => <TextField {...params} label="Select Asset" data-testid="selection-field" />, []);
  
  return (
    <Dialog open={open} onClose={handleClose} data-testid="add-asset-dialog">
      <DialogTitle data-testid="title">Add Asset</DialogTitle>
      <DialogContent data-testid="content">
        <DialogContentText data-testid="content-text">Select an asset to add.</DialogContentText>
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
      </DialogContent>
      <DialogActions data-testid="actions">
        <Button onClick={handleCancel} data-testid="cancel-button">Cancel</Button>
        <Button onClick={handleAdd} disabled={selection === ""} data-testid="add-button">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
