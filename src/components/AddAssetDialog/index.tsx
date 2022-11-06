import React from "react";
import ASSETS from "../../data/Assets";
import Dialog from "@mui/material/Dialog";

interface AddAssetDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string) => void;
}

export default function AddAssetDialog({ open, onClose, onAdd }: AddAssetDialogProps) {
  const names = Object.keys(ASSETS);
  console.log(`Found ${names.length} assets: `, names);

  const handleClose = () => {
    onClose();
  };

  const handleCancel = (evt: React.MouseEvent<HTMLElement>) => {

  };

  const handleAdd = (evt: React.MouseEvent<HTMLElement>) => {

  };

  return (
    <Dialog open={open} onClose={handleClose}>
      
    </Dialog>
  );
}
