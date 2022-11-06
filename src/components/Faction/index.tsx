import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";
import FactionInfo from "../../types/FactionInfo";
import EditableNameText from "../EditableNameText";
import EditableStatText from "../EditableStatText";
import { GameContext } from "../../GameContext";
import HealthDisplay from "../HealthDisplay";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";


type FactionProps = {
  info: FactionInfo,
  bgColor: string,
}

export default function Faction({ info, bgColor }: FactionProps) {
  const Item = styled(Box)(({ theme }) =>({
    backgroundColor: bgColor,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    minHeight: '3rem',
    maxHeight: '3rem',
    fontSize: '2rem',
  }));
  
  const { controller } = useContext(GameContext);
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState<boolean>(false);

  const doRemoveFaction = () => {
    controller.removeFaction(info.name);
  };

  const editNameHandler = (val: string) => {
    controller.updateFactionName(info.name, val);
  }

  const confirmRemoveFaction = () => {
    setRemoveConfirmationOpen(true);
  }

  const cancelRemoveFaction = () => {
    setRemoveConfirmationOpen(false);
  }

  const dialogCloseHandler = (evt: object, reason: "backdropClick"|"escapeKeyDown") => {
    if (reason === "escapeKeyDown") {
      cancelRemoveFaction();
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="space-around" width="100%">
        <Box width="80%" display="flex">
          <Item flexGrow={1} minWidth="300px" width="70%">
            <EditableNameText updateValue={editNameHandler} divStyle={{ textOverflow: "ellipsis", overflow: "clip"}}>
              {info.name}
            </EditableNameText>
          </Item>
          <Item minWidth="16rem" width="17rem" display="flex" alignItems="center" justifyContent="space-between">
            <HealthDisplay faction={info} />
          </Item>
          <Item minWidth="150px" display="flex" alignItems="center" justifyContent="center">
            <EditableStatText updateValue={val => controller.updateForce(info.name, +val)}>
              {info.stats?.force.toString()}
            </EditableStatText> / 
            <EditableStatText updateValue={val => controller.updateCunning(info.name, +val)}>
              {info.stats?.cunning.toString()}
            </EditableStatText> /
            <EditableStatText updateValue={val => controller.updateWealth(info.name, +val)}>
              {info.stats?.wealth.toString()}
            </EditableStatText>
          </Item>
        </Box>
        <Box flexGrow={1} width="20%">
          <Item display="flex" alignItems="center" justifyContent="center">
            <Button variant="outlined" onClick={confirmRemoveFaction}>Remove</Button>
          </Item>
        </Box>
      </Box>
      <Dialog open={removeConfirmationOpen} onClose={dialogCloseHandler} maxWidth="xs" fullWidth={true}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <b>{info.name}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelRemoveFaction}>Cancel</Button>
          <Button onClick={doRemoveFaction} variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}