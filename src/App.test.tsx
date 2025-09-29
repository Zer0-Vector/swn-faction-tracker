import React from 'react';

import { render, screen } from '@testing-library/react';

import { test, expect } from "vitest";

import App from './App';

test('renders without crashing', () => {
  render(<App />);
  const appRoot = screen.getByTestId("page-container");
  expect(appRoot).toBeDefined();
  expect(appRoot).not.toBeEmptyDOMElement();
});
