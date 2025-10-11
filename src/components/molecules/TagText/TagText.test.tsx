import React from "react";

import { render, screen } from "@testing-library/react";
import TagText from "./TagText";
import { TAGS } from "@/data/Tags";
import { FactionContext, FactionContextType, FactionPoset } from "@/contexts/FactionContext";
import FactionInfo from "@/utils/FactionInfo";

const mockContext: FactionContextType = {
  factions: {
    subscribe: vi.fn() as FactionPoset["subscribe"],
  } as FactionPoset
}

function renderIt() {
  return {
    ...render(
      <FactionContext.Provider value={mockContext}>
        <TagText factionId="test" tag={TAGS.Colonists.name} />
      </FactionContext.Provider>
    )
  }
}

describe("TagText", () => {
  it("renders", () => {
    renderIt();
    const component = screen.getByTestId("tag");
    expect(component).toBeInTheDocument();
    expect(component).not.toBeEmptyDOMElement();
    expect(component).toHaveTextContent(TAGS.Colonists.name);
  });
  
  it.todo("updates tag on edit");
});
