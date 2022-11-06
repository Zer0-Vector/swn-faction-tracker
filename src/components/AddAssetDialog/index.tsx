import React, { useState } from "react";
import ASSETS from "../../data/Assets";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string) => void;
}

export default function AddAssetDialog({ open, onClose, onAdd }: AddAssetDialogProps) {
  const names = Object.keys(ASSETS).filter(name => name !== "Base of Influence");
  console.debug(`Found ${names.length} assets: `);

  const [selection, setSelection] = useState<string>("");

  const handleClose = () => {
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

  const handleSelectionChanged = (evt: SelectChangeEvent) => {
    setSelection(evt.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Asset</DialogTitle>
      <DialogContent>
        <DialogContentText>Select an asset to add.</DialogContentText>
        <Select onChange={handleSelectionChanged} value={selection} error={selection === ""}>
          <MenuItem value="" selected><em>None</em></MenuItem>
          {
            names.map(name => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))
          }
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleAdd} disabled={selection === ""}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
