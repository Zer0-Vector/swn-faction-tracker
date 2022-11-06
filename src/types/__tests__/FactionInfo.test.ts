import FactionInfo from "../FactionInfo";

it('Copy method makes deep copy', () => {
  const info1 = new FactionInfo("test1");
  const info2 = FactionInfo.copy(info1);
  expect(info1).not.toBe(info2);
  expect(info1.name).toBe(info2.name);
  info2.name = "test2";
  expect(info1.name).toBe("test1");
  expect(info2.name).toBe("test2");

  expect(info1.stats).not.toBe(info2.stats);
  expect(info2.stats.hp).not.toBe(10);
  expect(info1.stats.hp).not.toBe(10);
  info1.stats.hp = 10;
  expect(info2.stats.hp).not.toBe(10);
});

it('Recompute HP method sets maxhp', () => {
  const info = new FactionInfo("test");
  expect(info.stats.maxHp).toBe(4);
  info.stats.cunning += 1;
  FactionInfo.recomputeMaxHp(info);
  expect(info.stats.maxHp).toBe(5);
});
