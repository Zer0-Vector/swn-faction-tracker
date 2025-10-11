import { expect, it } from "vitest";
import FactionInfo from "../FactionInfo";

it('Recompute HP method sets maxhp', () => {
  const info = new FactionInfo("123", "test", "test");
  expect(info.maxHp).toBe(4);
  info.cunning += 1;
  expect(info.maxHp).toBe(5);
});
