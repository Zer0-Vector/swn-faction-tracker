import React from "react";

import { render } from "@testing-library/react";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";

import HealthDisplay from "./HealthDisplay";

const mockContext: FactionContextType = {
  factions: {} as FactionPoset,
};

function renderIt() {
  render(
    <FactionContext.Provider value={mockContext}>
      <HealthDisplay factionId="testFactionId" hp={11} maxHp={22} />
    </FactionContext.Provider>
  );
}

describe('HealthDisplay', () => {
  it.todo('renders faction hp and maxHp');
  it.todo('render tooltip on hover');
});
