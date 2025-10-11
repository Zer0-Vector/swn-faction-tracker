import FactionStatSummary from "../../../molecules/FactionStatSummary";
import { Item, ItemHeader } from "./helpers";

type AttributesItemProps = {
  id: string,
  force: number,
  cunning: number,
  wealth: number,
};

export default function AttributesItem({ id, force, cunning, wealth }: Readonly<AttributesItemProps>) {
  return (
    <>
      <ItemHeader data-testid="attr-label">Force/Cunning/Wealth:</ItemHeader>
      <Item data-testid="attr-item">
        <FactionStatSummary
          cunning={cunning}
          wealth={wealth}
          force={force}
          factionId={id}
        />
      </Item>
    </>
  )
}
