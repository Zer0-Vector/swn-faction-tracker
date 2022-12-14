import FactionInfo from "../FactionInfo";

it('Recompute HP method sets maxhp', () => {
  const info = new FactionInfo("test", "test");
  expect(info.stats.maxHp).toBe(4);
  info.stats.cunning += 1;
  FactionInfo.recomputeMaxHp(info);
  expect(info.stats.maxHp).toBe(5);
});
