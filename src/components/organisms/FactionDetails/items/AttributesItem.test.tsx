import { FactionContext, FactionContextType, FactionPoset } from "@/contexts/FactionContext";
import { render, screen } from "@testing-library/react";
import AttributesItem from "./AttributesItem";

const mockContext: FactionContextType = {
  factions: {
    subscribe: vi.fn() as FactionPoset["subscribe"]
  } as FactionPoset,
};

function renderIt() {
  return {
    ...render(
      <FactionContext.Provider value={mockContext}>
        <AttributesItem id="test" force={4} cunning={5} wealth={6} />
      </FactionContext.Provider>
    )
  }
}


describe("AttributesItem", () => {
  it("renders", () => {
    renderIt();
    const label = screen.getByTestId("attr-label");
    expect(label).toBeInTheDocument();
    const item = screen.getByTestId("attr-item");
    expect(item).toBeInTheDocument();
  });
});
