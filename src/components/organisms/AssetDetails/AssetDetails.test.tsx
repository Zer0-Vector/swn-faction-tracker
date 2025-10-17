import React from "react";

import { render, screen, within } from "@testing-library/react";

import PurchasedAsset from "../../../utils/PurchasedAsset";

import AssetDetails from "./AssetDetails";
import { describe, expect, it } from "vitest";

const mockAsset: PurchasedAsset = {
  id: "test",
  name: "Covert Shipping",
  slug: "covert-shipping-77",
  factionId: "test",
  hp: 11,
};

function renderIt() {
  render(<AssetDetails asset={mockAsset} />);
}

describe("AssetDetails", () => {
  it("renders card", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();
  });

  it("renders description", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const desc = within(card).getByTestId("description");
    expect(desc).toBeInTheDocument();
    expect(desc.textContent).toBeTruthy();
  });

  it("renders attribute text", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const attr = within(card).getByTestId("attribute");
    expect(attr).toBeInTheDocument();
    expect(attr.textContent).toBeTruthy();
  });

  it("renders hp summary", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const hp = within(card).getByTestId("hp");
    expect(hp).toBeInTheDocument();
    expect(hp.textContent).toBeTruthy();
    expect(hp.textContent).toContain("/");
  });

  it("renders type", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const type = within(card).getByTestId("type");
    expect(type).toBeInTheDocument();
    expect(type.textContent).toBeTruthy();
  });

  it("renders upkeep", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const upkeep = within(card).getByTestId("upkeep");
    expect(upkeep).toBeInTheDocument();
    const label = within(upkeep).getByTestId("label");
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBeTruthy();

    const content = within(upkeep).getByTestId("content");
    expect(content).toBeInTheDocument();
    expect(content.textContent).toBeTruthy();
  });

  it("renders attack", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const attack = within(card).getByTestId("attack");
    expect(attack).toBeInTheDocument();
    const label = within(attack).getByTestId("label");
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBeTruthy();

    const content = within(attack).getByTestId("content");
    expect(content).toBeInTheDocument();
    expect(content.textContent).toBeTruthy();
  });

  it("renders counter", () => {
    renderIt();
    const card = screen.getByTestId("asset-details");
    expect(card).toBeInTheDocument();

    const counter = within(card).getByTestId("counter");
    expect(counter).toBeInTheDocument();
    const label = within(counter).getByTestId("label");
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBeTruthy();

    const content = within(counter).getByTestId("content");
    expect(content).toBeInTheDocument();
    expect(content.textContent).toBeTruthy();
  });
});
