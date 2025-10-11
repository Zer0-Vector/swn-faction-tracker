import React from "react";
import { Item, ItemHeader } from "./helpers";
import HomeworldText from "@/components/molecules/HomeworldText";
import type { HomeworldTextProps } from "@/components/molecules/HomeworldText";

export type HomeworldItemProps = HomeworldTextProps;

export default function HomeworldItem(props: Readonly<HomeworldItemProps>) {
  return (
    <>
      <ItemHeader data-testid="homeworld-label">Homeworld:</ItemHeader>
      <Item data-testid="homeworld-item">
        <HomeworldText {...props} />
      </Item>
    </>
  )
}
