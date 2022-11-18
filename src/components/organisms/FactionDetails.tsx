import React, { useContext } from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { GameContext } from "../../contexts/GameContext";
import { TAGS } from "../../data/Tags";
import { useSelection } from "../../hooks/useSelection";
import EditableNameText from "../atoms/EditableNameText";
import FactionHpSummary from "../molecules/FactionHpSummary";
import FactionStatSummary from "../molecules/FactionStatSummary";
import GoalProgress from "../molecules/GoalProgress";
import GoalText from "../molecules/GoalText";

export default function FactionDetails() {
  const { state, controller } = useContext(GameContext);
  const { faction } = useSelection();

  if (!faction) {
    return (
      <Typography color="info.main">No Faction Selected</Typography>
    );
  }

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.5),
  }));

  const ItemHeader = styled(Item)(({ theme }) => ({
    fontWeight: "bold",
    textAlign: "right",
  }));

  const homeworldText = faction.homeworld ? faction.homeworld : "Unknown";
  const tagText = faction.tag ? faction.tag : "Unknown";

  const updateHomeworld = (val: string) => {
    if (faction) {
      controller.updateHomeworld(faction.id, val);
    } else {
      console.warn("Cannot updateHomeworld. No faction selected");
    }
  };

  const updateTag = (val: string) => {
    if (faction) {
      controller.updateTag(faction.id, val);
    } else {
      console.warn("Cannot updateTag. No faction selected.");
    }
  };

  return (
    <Container disableGutters={true}
      sx={{ 
        backgroundColor: "background.paper2",
        m: 2,
        p: 2,
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0.5,
      }}
    >
      {/* ROW 1 */}
        <ItemHeader>Homeworld:</ItemHeader>
        <Item><EditableNameText onUpdate={updateHomeworld} selectableOptions={state.getLocations().map(loc => loc.name)}>{homeworldText}</EditableNameText></Item>
        <ItemHeader>Tag:</ItemHeader>
        <Item><EditableNameText onUpdate={updateTag} selectableOptions={Object.keys(TAGS)}>{tagText}</EditableNameText></Item>

      {/* ROW 2 */}
        <ItemHeader>HP:</ItemHeader>
        <Item><FactionHpSummary factionId={faction.id} /></Item>
        <ItemHeader>F/C/W:</ItemHeader>
        <Item>
          <FactionStatSummary
            {...faction.stats}
            factionId={faction.id}
          />
        </Item>

      {/* ROW 3 */}
        <ItemHeader>Goal:</ItemHeader>
        <Item><GoalText faction={faction} /></Item>
        <ItemHeader>Progress:</ItemHeader>
        <Item><GoalProgress faction={faction} /></Item>
    </Container>
  );
}
