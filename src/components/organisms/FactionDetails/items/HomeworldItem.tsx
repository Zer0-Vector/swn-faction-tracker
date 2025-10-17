import React from "react";

import type { HomeworldTextProps } from "@/components/molecules/HomeworldText";
import HomeworldText from "@/components/molecules/HomeworldText";

import { Item, ItemHeader } from "./helpers";

export type HomeworldItemProps = HomeworldTextProps;

export default function HomeworldItem(props: Readonly<HomeworldItemProps>) {
  return (
    <>
      <ItemHeader data-testid="homeworld-label">Homeworld:</ItemHeader>
      <Item data-testid="homeworld-item">
        <HomeworldText {...props} />
      </Item>
    </>
  );
}
