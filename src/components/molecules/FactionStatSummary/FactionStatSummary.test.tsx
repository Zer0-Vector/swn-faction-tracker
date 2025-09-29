import React from "react";

import { render } from "@testing-library/react";

import { FactionContext, FactionContextType, FactionPoset } from "../../../contexts/FactionContext";

import FactionStatSummary from "./FactionStatSummary";
import { describe, it, vi } from "vitest";

const mockContext: FactionContextType = {
  factions: {
    update: vi.fn() as FactionPoset['update'],
  } as FactionPoset,
};

function renderIt() {
  render(
    <FactionContext.Provider value={mockContext}>
      <FactionStatSummary factionId="test" force={11} cunning={22} wealth={33} />
    </FactionContext.Provider>
  );
}

describe('FactionStatSummary', () => {
  it.todo('renders given stats');
  it.todo('calls controller on update force');
  it.todo('calls controller on update cunning');
  it.todo('calls controller on update wealth');
});
