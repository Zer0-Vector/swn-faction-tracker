import React, { useCallback, useContext, useMemo } from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { GameContext } from "../../../contexts/GameContext";
import { TAGS } from "../../../data/Tags";
import FactionInfo from "../../../types/FactionInfo";
import { ControlledDropDown } from "../../molecules/ControlledDropDown";
import FactionHpSummary from "../../molecules/FactionHpSummary";
import FactionStatSummary from "../../molecules/FactionStatSummary";
import GoalProgress from "../../molecules/GoalProgress";
import GoalText from "../../molecules/GoalText";

interface FactionDetailsProps {
  faction: FactionInfo;
}

const Item = React.memo(styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(0.5),
  margin: theme.spacing(0.5),
})));

const ItemHeader = React.memo(styled(Item)(() => ({
  fontWeight: "bold",
  textAlign: "right",
})));

export default function FactionDetails({ faction }: FactionDetailsProps) {
  const { state, controller } = useContext(GameContext);
  const isSmallViewport = useMediaQuery("(max-width:600px)");

  
  const homeworldText = state.getLocation(faction.homeworldId || "")?.name || "Unknown";
  const tagText = faction.tag ? faction.tag : "Unknown";

  const updateHomeworld = useCallback((val: string) => {
    controller.updateHomeworld(faction.id, val);
  }, [controller, faction.id]);

  const updateTag = useCallback((val: string) => {
    controller.updateTag(faction.id, val);
  }, [controller, faction.id]);

  const homeworldOptions = useMemo(() => state.getLocations().map(loc => loc.name), [state]);

  const containerSx = useMemo(() => ({
    backgroundColor: "background.paper2",
    display: "grid",
    gridTemplateColumns: isSmallViewport ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gap: 0.25,
  }), [isSmallViewport]);
  
  const tagOptions = useMemo(() => Object.keys(TAGS), []);

  return (
    <Container disableGutters={true} sx={containerSx} data-testid="faction-details">
      <ItemHeader data-testid="homeworld-label">Homeworld:</ItemHeader>
      <Item data-testid="homeworld-item"><ControlledDropDown onUpdate={updateHomeworld} selectableOptions={homeworldOptions} data-testid="homeworld">{homeworldText}</ControlledDropDown></Item>
      <ItemHeader data-testid="tag-label">Tag:</ItemHeader>
      <Item data-testid="tag-item"><ControlledDropDown onUpdate={updateTag} selectableOptions={tagOptions} data-testid="tag">{tagText}</ControlledDropDown></Item>

      <ItemHeader data-testid="hp-label">HP:</ItemHeader>
      <Item data-testid="hp-item"><FactionHpSummary factionId={faction.id} hp={faction.hp} maxHp={faction.maxHp} data-testid="hp-summary" /></Item>
      <ItemHeader data-testid="attr-label">F/C/W:</ItemHeader>
      <Item data-testid="attr-item">
        <FactionStatSummary
          cunning={faction.cunning}
          wealth={faction.wealth}
          force={faction.force}
          factionId={faction.id}
        />
      </Item>

      <ItemHeader data-testid="goal-label">Goal:</ItemHeader>
      <Item data-testid="goal-item"><GoalText faction={faction} /></Item>
      <ItemHeader data-testid="goal-progress-label">Progress:</ItemHeader>
      <Item data-testid="goal-progress-item"><GoalProgress faction={faction} /></Item>
    </Container>
  );
}
