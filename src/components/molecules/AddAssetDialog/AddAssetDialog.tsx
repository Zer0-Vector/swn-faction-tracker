import React, { useCallback, useMemo, useState } from "react";

import { Container, SxProps, Theme, Typography } from "@mui/material";
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
  description: string;
  disabled: boolean;
}

export default function AddAssetDialog({
  open,
  onClose,
  onAdd,
}: AddAssetDialogProps) {
  const [selection, setSelection] = useState<Nullable<AssetOption>>(null);

  const options = useMemo(
    () =>
      Object.entries(ASSETS)
        .filter(([name]) => name !== "Base of Influence")
        .map(([name, item]) => {
          const group = `${TextUtils.titleCase(item.attribute)} ${item.level}`;
          return {
            name: name,
            group: group,
            description: item.description,
          } as AssetOption;
        }),
    []
  );

  const handleSelectionChanged = useCallback(
    (_evt: React.SyntheticEvent, value: Nullable<AssetOption>) => {
      setSelection(value);
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelection(null);
    onClose();
  }, [onClose]);

  const formControlSx: SxProps<Theme> = (theme) => ({ my: 1, minWidth: theme.breakpoints.values.xs });
  const autoGroupBy = (o: AssetOption): string => o.group;
  const autoOptLabel = (o: AssetOption): string => o.name;
  const optionsAreEqual = (o: AssetOption, v: AssetOption): boolean => o.group === v.group && o.name === v.name
  // Q: extract TextField to custom component with React.memo?
  const autoRenderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label="Select Asset"
      data-testid="selection-field"
    />
  );

  const handleAction = useCallback<DialogActionHandler>(
    (result) => {
      handleClose();
      if (result.reason === "Add" && selection !== null) {
        onAdd(selection.name);
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
      disabledButtons={selection ? undefined : ["Add"]}
      onAction={handleAction}
      data-testid="add-asset-dialog"
      fullWidth={true}
      maxWidth="sm"
    >
      <Container sx={{
        display: "grid",
        gridTemplateRows: "1fr 12.5rem",
        gridTemplateColumns: "1fr 45ch",
        width: "100%",
        columnGap: "1rem",
        overflow: "hidden"
      }} fixed>
        <FormControl sx={formControlSx}>
          <Autocomplete
            id="asset-select-field"
            options={options}
            groupBy={autoGroupBy}
            getOptionLabel={autoOptLabel}
            isOptionEqualToValue={optionsAreEqual}
            disableClearable={true}
            onChange={handleSelectionChanged}
            selectOnFocus
            clearOnEscape
            renderInput={autoRenderInput}
            data-testid="asset-autocomplete"
          />
        </FormControl>


        <Typography fontSize={28} alignSelf="center" color={selection ? undefined : "warning"}>{selection ? selection.name : "Make a selection"}</Typography>
        <Typography
          variant="body2"
          overflow="scroll"
          gridColumn="2"
        >
          {selection?.description}
        </Typography>
      </Container>
    </MessageDialog>
  );
}
