import FactionInfo from "../FactionInfo";

it('Recompute HP method sets maxhp', () => {
  const info = new FactionInfo("test", "test");
  expect(info.maxHp).toBe(4);
  info.cunning += 1;
  FactionInfo.recomputeMaxHp(info);
  expect(info.maxHp).toBe(5);
});
