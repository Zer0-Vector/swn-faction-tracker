import React, { useCallback, useMemo } from "react";

import Card from "@mui/material/Card";
import Grid, { GridSize } from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled, SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import ASSETS, { isAsset } from "../../../data/Assets";
import { AssetAttackResult } from "../../../types/AssetInfo";
import { RequiredChildrenProps } from "../../../types/ChildrenProps";
import PurchasedAsset from "../../../types/PurchasedAsset";
import TestableProps from "../../../types/TestableProps";
import TextUtils from "../../../utils/TextUtils";

interface AssetDetailsProps {
  asset: PurchasedAsset;
}

const Item = React.memo(styled(Paper)(() => ({
  textAlign: "center",
  padding: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})));

interface LabeledItemProps extends RequiredChildrenProps, TestableProps{
  label: string;
  sx?: SxProps<Theme>;
  xsLabel?: GridSize;
  xsContent?: GridSize;
}

const LabeledItemComponent = ({ label, children, sx, xsLabel, xsContent, "data-testid": dtid }: LabeledItemProps) => {
  return (
    <Item sx={sx} data-testid={dtid}>
      <Grid container columnSpacing={2}>
        <Grid item
          xs={xsLabel || "auto"}
          fontWeight="bold"
          textAlign="right"
          overflow="clip"
          textOverflow="ellipsis"
          data-testid="label"
        >
          {label}
        </Grid>
        <Grid item xs={xsContent || "auto"} textAlign="left" data-testid="content">
          {children}
        </Grid>
      </Grid>
    </Item>
  );
};

const LabeledItem = React.memo(LabeledItemComponent);

const AssetDetailsComponent = ({ asset }: AssetDetailsProps) => {
  const cardSx = useMemo<SxProps>(() => ({
    backgroundColor: "background.paper2",
    display: "grid",
    gridTemplateColumns: "3fr 2fr",
    gap: 1.5,
    padding: 2,
  }), []);
  
  const descriptionSx = useMemo(() => ({
    textAlign: "justify",
    gridRow: "1 / 5",
    alignItems: "flex-start",
  }), []);

  const attributeSx = useMemo(() => ({
    textTransform: "uppercase",
    fontStyle: "italic",
  }), []);
  
  const dmgText = useCallback((result: AssetAttackResult) => (
    result.type === "DAMAGE" 
    ? result.damage 
    : "Special"
  ), []);
  

  
  if (!isAsset(asset.id.displayName)) {
    console.error(`Could not find asset named '${asset.id.displayName}'`);
    return (<Typography color="error" fontWeight="bold" fontStyle="italic">Could not load asset info</Typography>);
  }
  const assetInfo = ASSETS[asset.id.displayName];

  const { hp } = asset;
  const { description, attack, counter, attribute, level, maxHp, type, upkeep /*note*/ } = assetInfo;
  const attributeText = `${attribute} ${level}`;
  const attackText = attack ? `${TextUtils.titleCase(attack.offense)} vs. ${TextUtils.titleCase(attack.defense)}, ${dmgText(attack.result)}` : "None";
  const counterText = counter ? counter : "None";
  const typeText = TextUtils.titleCase(type.replaceAll(/_/g, " "));
  const upkeepText = upkeep === 0 ? "None" : `${upkeep} FacCred`;

  return (
    <Card sx={cardSx} data-testid="asset-details">
      <Item sx={descriptionSx} data-testid="description">{description}</Item>
      <Item sx={attributeSx} data-testid="attribute">{attributeText}</Item>
      {/* TODO use HealthDisplay or refactor it */}
      <Item data-testid="hp">{hp}/{maxHp}</Item>
      <Item data-testid="type">{typeText}</Item>
      <LabeledItem label="Upkeep" xsLabel={6} data-testid="upkeep">{upkeepText}</LabeledItem>
      <LabeledItem label="Attack" xsLabel={4} data-testid="attack">{attackText}</LabeledItem>
      <LabeledItem label="Counter" xsLabel={6} data-testid="counter">{counterText}</LabeledItem>
    </Card>
  );
};

const AssetDetails = React.memo(AssetDetailsComponent);

export default AssetDetails;
