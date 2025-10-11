import React from "react";
import { Item, ItemHeader } from "./helpers";
import TagText, { TagTextProps } from "@/components/molecules/TagText/TagText";

type TagItemProps = TagTextProps

export default function TagItem(props: Readonly<TagItemProps>) {
  return (
    <>
      <ItemHeader data-testid="tag-label">Tag:</ItemHeader>
      <Item data-testid="tag-item">
        <TagText {...props} />
      </Item>
    </>
  );
}
