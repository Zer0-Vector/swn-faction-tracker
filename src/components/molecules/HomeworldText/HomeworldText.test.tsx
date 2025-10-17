import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomeworldText, { HomeworldTextProps } from "./HomeworldText";
const allLocations = [
  { id: "loc1", name: "Earth" },
  { id: "loc2", name: "Mars" },
];
// Mocks
const mockLocations = {
  getAll: vi.fn(() => allLocations),
  get: vi.fn((id: string) => allLocations.find((loc) => loc.id === id)),
};
const mockUpdate = vi.fn();
const mockFactions = {
  update: mockUpdate,
};

vi.mock("@/contexts/LocationContext", () => ({
  useLocations: () => mockLocations,
}));
vi.mock("@/contexts/FactionContext", () => ({
  useFactions: () => mockFactions,
}));

describe("HomeworldText", () => {
  const defaultProps: HomeworldTextProps = {
    factionId: "f1",
    homeworldId: "loc1",
  };

  it("renders with the correct homeworld name", () => {
    render(<HomeworldText {...defaultProps} />);

    const component = screen.getByTestId("homeworld");
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent("Earth");
  });

  it("shows 'Unknown' if homeworldId is missing", () => {
    render(<HomeworldText factionId="f1" homeworldId={undefined} />);
    const component = screen.getByTestId("homeworld");
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent("Unknown");
  });

  it.todo("calls update when a new homeworld is selected", () => {
    render(<HomeworldText {...defaultProps} />);
    // TODO: mock UI events to edit homeworld text
    expect(mockUpdate).toHaveBeenCalledWith("f1", "homeworldId", "loc2");
  });
});
