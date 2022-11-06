import React, { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import ASSETS from "../../data/Assets";
import Nullable from "../../types/Nullable";
import TextUtils from "../../utils/TextUtils";

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
  
  const options = Object.entries(ASSETS)
      .filter(([name, _]) => name !== "Base of Influence")
      .map(([name, item]) => {
        const group = `${TextUtils.titleCase(item.attribute)} ${item.level}`;
        return {
          name: name,
          group: group,
        } as AssetOption;
      });

  const handleClose = () => {
    setSelection("");
    onClose();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    handleClose();
  };

  const handleAdd = (evt: React.FormEvent<HTMLElement>) => {
    evt.stopPropagation();
    if (selection !== "") {
      onAdd(selection);
      handleClose();
    }
  };

  const handleSelectionChanged = (_evt: React.SyntheticEvent, value: Nullable<AssetOption>) => {
    if (value === null) {
      setSelection("");
    } else {
      setSelection(value.name);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Asset</DialogTitle>
      <DialogContent>
        <DialogContentText>Select an asset to add.</DialogContentText>
        <FormControl sx={{ my: 1, minWidth: 200 }}>
          <Autocomplete
            id="asset-select-field"
            options={options}
            groupBy={o => o.group}
            getOptionLabel={o => o.name}
            isOptionEqualToValue={(o, v) => o.group === v.group && o.name === v.name}
            disableClearable={true}
            onChange={handleSelectionChanged}
            renderInput={params => <TextField {...params} label="Select Asset" />}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleAdd} disabled={selection === ""}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
