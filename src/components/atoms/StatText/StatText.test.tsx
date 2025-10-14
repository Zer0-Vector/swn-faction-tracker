import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import StatText from "./StatText";

describe("default StatText component", () => {
  it("renders a span with children text", () => {
    render(<StatText data-testid="stattext-1">test 123</StatText>);
    const component = screen.getByTestId("stattext-1");
    expect(component).toBeDefined();
    expect(component.textContent).toBe("test 123");
    expect(component).toBeInstanceOf(HTMLSpanElement);
  });
});

describe("StatText component with custom component", () => {
  it("renders using specified component", () => {
    render(
      <StatText component="p" data-testid="stattext-2">
        test 456
      </StatText>
    );
    const component = screen.getByTestId("stattext-2");
    expect(component).toBeDefined();
    expect(component.textContent).toBe("test 456");
    expect(component).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe("StatText component with custom variant", () => {
  it("renders with variant class", () => {
    render(
      <StatText variant="subtitle1" data-testid="stattext-3">
        test 789
      </StatText>
    );
    const component = screen.getByTestId("stattext-3");
    expect(component).toBeDefined();
    expect(component.textContent).toBe("test 789");
    expect(component).toBeInstanceOf(HTMLSpanElement);
    expect(component.classList.value).toContain("MuiTypography-subtitle1");
    expect(component.classList.value).not.toContain("MuiTypography-body2");
  });
});
