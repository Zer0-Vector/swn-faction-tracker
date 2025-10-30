// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { act } from "react";

import "@testing-library/jest-dom/vitest";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

globalThis.yieldToEventLoop = async (delay: number = 0) => await act(async () => await new Promise((r) => setTimeout(r, delay)));
