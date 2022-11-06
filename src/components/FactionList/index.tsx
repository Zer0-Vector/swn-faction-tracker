import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import FactionInfo from "../../types/FactionInfo";
import AssetList from "../AssetList";
import Faction from "../Faction";
import { GameContext } from "../../GameContext";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  color: theme.palette.secondary.main,
}));

export default function FactionList(): JSX.Element {
  const { state } = useContext(GameContext)
  return (
    <Stack spacing={1} marginTop="5rem" marginX="5rem">
      {[...Object.values(state.factions).sort((a: FactionInfo, b: FactionInfo) => a.rank - b.rank)].map((f, index) => {
          const bgColor = (index % 2 === 0) ? "#444" : "#333"
          return (
            <Item key={f.name}>
              <Faction info={f} bgColor={bgColor} />
              <AssetList />
            </Item>
          )
        }
      )}
    </Stack>
  );
}