import React from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { ValidationContext } from "../../../contexts/ValidationContext";
import { ValidationController } from "../../../controllers/ValidationController";

import { ValidatedTextField } from "./ValidatedTextField";
import { describe, expect, it } from "vitest";

describe("one ValidatedTextField", () => {
  const validator = new ValidationController({
    test1: (val: string) => {
      return val.length > 5;
    },
  });

  it("shows error only if changed and invalid", () => {
    render(
      <ValidationContext.Provider value={validator}>
        <ValidatedTextField
          id="test1"
          label="Test One"
          data-testid="test-one"
        />
      </ValidationContext.Provider>
    );
    const theDiv = screen.getByTestId("test-one");
    expect(theDiv).toBeInTheDocument();
    const field = within(theDiv).getByLabelText("Test One");
    expect(field).toBeInTheDocument();
    expect(field).toBeInstanceOf(HTMLInputElement);
    const label = within(theDiv).getAllByText("Test One")[0];
    expect(label).toBeInTheDocument();
    expect(label).toBeInstanceOf(HTMLLabelElement);
    expect(label).not.toHaveClass("Mui-error");

    expect(validator.isAllValid()).toBe(false);
    expect(validator.isValid("test1")).toBe(false);

    fireEvent.change(field, { target: { value: "1234" } });
    expect(label).toHaveClass("Mui-error");
    expect(validator.isAllValid()).toBe(false);
    expect(validator.isValid("test1")).toBe(false);

    fireEvent.change(field, { target: { value: "123456" } });
    expect(label).not.toHaveClass("Mui-error");
    expect(validator.isValid("test1")).toBe(true);
    expect(validator.isAllValid()).toBe(true);
  });
});

describe("two ValidatedTextField", () => {
  const validator = new ValidationController({
    test1: (val: string) => {
      return val.length > 5;
    },
    test2: (val: string) => {
      return val === "VALID_VALUE_123";
    },
  });

  it("is only valid if all fields are valid", () => {
    render(
      <ValidationContext.Provider value={validator}>
        <ValidatedTextField
          id="test1"
          label="Test One"
          data-testid="test-one"
        />
        <ValidatedTextField
          id="test2"
          label="Test Two"
          data-testid="test-two"
        />
      </ValidationContext.Provider>
    );
    // inspect the first field
    const theDiv1 = screen.getByTestId("test-one");
    expect(theDiv1).toBeInTheDocument();
    expect(theDiv1).toHaveClass("MuiTextField-root");
    const field1 = within(theDiv1).getByLabelText("Test One");
    expect(field1).toBeInTheDocument();
    expect(field1).toBeInstanceOf(HTMLInputElement);
    // eslint-disable-next-line testing-library/no-node-access
    const label1 = theDiv1.querySelector("label");
    expect(label1).toBeInTheDocument();
    expect(label1).toBeInstanceOf(HTMLLabelElement);
    expect(label1).not.toHaveClass("Mui-error");

    // inspect the second field
    const theDiv2 = screen.getByTestId("test-two");
    expect(theDiv2).toBeInTheDocument();
    expect(theDiv2).toHaveClass("MuiTextField-root");
    const field2 = within(theDiv2).getByLabelText("Test Two");
    expect(field2).toBeInTheDocument();
    expect(field2).toBeInstanceOf(HTMLInputElement);
    // eslint-disable-next-line testing-library/no-node-access
    const label2 = theDiv2.querySelector("label");
    expect(label2).toBeInTheDocument();
    expect(label2).toBeInstanceOf(HTMLLabelElement);
    expect(label2).not.toHaveClass("Mui-error");

    // inspect the validator
    expect(validator.isAllValid()).toBe(false);
    expect(validator.isValid("test1")).toBe(false);
    expect(validator.isValid("test2")).toBe(false);
    expect(() => validator.isValid("test3")).toThrowError();

    // update field1 to invalid value
    fireEvent.change(field1, { target: { value: "1234" } });
    expect(label1).toHaveClass("Mui-error");
    expect(label2).not.toHaveClass("Mui-error");
    expect(validator.isAllValid()).toBe(false);
    expect(validator.isValid("test1")).toBe(false);

    // update field1 to valid value
    fireEvent.change(field1, { target: { value: "123456" } });
    expect(label1).not.toHaveClass("Mui-error");
    expect(validator.isValid("test1")).toBe(true);
    expect(validator.isAllValid()).toBe(false);

    // update field2 to invalid value
    fireEvent.change(field2, { target: { value: "INVALID" } });
    expect(label2).toHaveClass("Mui-error");
    expect(validator.isAllValid()).toBe(false);
    expect(validator.isValid("test2")).toBe(false);

    // update field2 to valid value
    fireEvent.change(field2, { target: { value: "VALID_VALUE_123" } });
    expect(label2).not.toHaveClass("Mui-error");
    expect(validator.isValid("test2")).toBe(true);
    expect(validator.isAllValid()).toBe(true);
  });
});
