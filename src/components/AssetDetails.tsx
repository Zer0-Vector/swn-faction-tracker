import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ASSETS from "../data/Assets";
import PurchasedAsset from "../types/PurchasedAsset";
import TextUtils from "../utils/TextUtils";
import { AssetAttackResult } from "../types/AssetInfo";

interface AssetDetailsProps {
  asset: PurchasedAsset;
}

function AssetDetailItem({ label, content }: { label?: React.ReactNode, content: React.ReactNode}) {
  const Item = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.25),
  }));
  
  const ItemHeader = styled(Item)(({ theme }) => ({
    fontWeight: "bold",
    textAlign: "right",
    overflow: "clip",
    textOverflow: "ellipsis",
  }));

  if (!label) {
    return (
      <Grid item xs={6}>
        <Item textAlign="center">{content}</Item>
      </Grid>
    );
  } else {
    return (
      <>
        <Grid item xs={2}>
          <ItemHeader>{label}</ItemHeader>
        </Grid>
        <Grid item xs={4}>
         <Item>{content}</Item>
        </Grid>
      </>
    );
  }
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const theme = useTheme();
  const assetInfo = ASSETS[asset.name];
  if (!assetInfo) {
    console.error(`Could not find asset named '${asset.name}'`);
    return (<Typography color="error.main" fontWeight="bold" fontStyle="italic">Could not load asset info</Typography>);
  }

  const { hp } = asset;
  const { attack, counter, attribute, level, maxHp, type, upkeep, note } = assetInfo;
  const attributeText = (<em>{`${TextUtils.titleCase(attribute)} ${level}`}</em>);
  const dmgText = (result: AssetAttackResult) => result.type === "DAMAGE" ? result.damage : "Special";
  const attackText = attack ? `${TextUtils.titleCase(attack.offense)} vs. ${TextUtils.titleCase(attack.defense)}, ${dmgText(attack.result)}` : "None";
  const counterText = counter ? counter : "None";
  const typeText = TextUtils.titleCase(type.replaceAll(/_/g, " "));
  const upkeepText = upkeep === 0 ? "None" : `${upkeep} FacCred`;
  const permissionText = note.includes("P") ? "Government Permission Required" : "";
  // const hasAction = note.includes("A");
  // const hasSpecial = note.includes("S");

  return (
    <Grid container spacing={1} sx={{
      backgroundColor: "background.paper",
      margin: theme.spacing(1),
      width: "97%"
    }}>
      <AssetDetailItem content={attributeText} />
      <AssetDetailItem label="Type" content={typeText} />
      <AssetDetailItem label="HP" content={`${hp}/${maxHp}`} />
      <AssetDetailItem label="Upkeep" content={upkeepText} />
      <AssetDetailItem label="Attack" content={attackText} />
      <AssetDetailItem label="Counterattack" content={counterText} />
      <AssetDetailItem content={permissionText} />
      <AssetDetailItem label="Note" content={note.filter(val => val !== "P").join(", ")} />
    </Grid>
  );
}
