import React from "react";

import Card from "@mui/material/Card";
import Grid, { GridSize } from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled, SxProps, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import ASSETS from "../../data/Assets";
import { AssetAttackResult } from "../../types/AssetInfo";
import PurchasedAsset from "../../types/PurchasedAsset";
import TextUtils from "../../utils/TextUtils";

interface AssetDetailsProps {
  asset: PurchasedAsset;
}

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

interface LabeledItemProps {
  label: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  xsLabel?: GridSize;
  xsContent?: GridSize;
}

function LabeledItem({ label, children, sx, xsLabel, xsContent }: LabeledItemProps) {
  return (
    <Item sx={sx}>
      <Grid container columnSpacing={2}>
        <Grid item xs={xsLabel || "auto"} sx={{
          fontWeight: "bold",
          textAlign: "right",
          overflow: "clip",
          textOverflow: "ellipsis",
        }}>
          {label}
        </Grid>
        <Grid item xs={xsContent || "auto"} sx={{
          textAlign: "left",
        }}>
          {children}
        </Grid>
      </Grid>
    </Item>
  );
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const assetInfo = ASSETS[asset.name];
  if (!assetInfo) {
    console.error(`Could not find asset named '${asset.name}'`);
    return (<Typography color="error.main" fontWeight="bold" fontStyle="italic">Could not load asset info</Typography>);
  }

  const { hp } = asset;
  const { description, attack, counter, attribute, level, maxHp, type, upkeep, /*note*/ } = assetInfo;
  const attributeText = `${attribute} ${level}`;
  const dmgText = (result: AssetAttackResult) => result.type === "DAMAGE" ? result.damage : "Special";
  const attackText = attack ? `${TextUtils.titleCase(attack.offense)} vs. ${TextUtils.titleCase(attack.defense)}, ${dmgText(attack.result)}` : "None";
  const counterText = counter ? counter : "None";
  const typeText = TextUtils.titleCase(type.replaceAll(/_/g, " "));
  const upkeepText = upkeep === 0 ? "None" : `${upkeep} FacCred`;

  return (
    <Card sx={{
      backgroundColor: "background.paper2",
      display: "grid",
      gridTemplateColumns: "3fr 2fr",
      gap: 1.5,
      padding: 2,
    }}>
      <Item sx={{ textAlign: "justify", gridRow: "1 / 5", alignItems: "flex-start" }}>{description}</Item>
      <Item sx={{ textTransform: "uppercase", fontStyle: "italic" }}>{attributeText}</Item>
      {/* TODO use HealthDisplay or refactor it */}
      <Item>{hp}/{maxHp}</Item>
      <Item>{typeText}</Item>
      <LabeledItem label="Upkeep" xsLabel={6}>{upkeepText}</LabeledItem>
      <LabeledItem label="Attack" xsLabel={4}>{attackText}</LabeledItem>
      <LabeledItem label="Counter" xsLabel={6}>{counterText}</LabeledItem>
    </Card>
  );
}
