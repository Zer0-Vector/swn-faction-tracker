import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import FactionInfo from "../../types/FactionInfo";
import EditableNameText from "../EditableNameText";
import EditableStatText from "../EditableStatText";
import { GameContext } from "../../GameContext";
import HealthDisplay from "../HealthDisplay";


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
  const removeFactionHandler = () => {
    controller.removeFaction(info.name);
  };

  const editNameHandler = (val: string) => {
    controller.updateFactionName(info.name, val);
  }

  return (
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
          <Button variant="outlined" onClick={removeFactionHandler}>Remove</Button>
        </Item>
      </Box>
    </Box>
  );
}