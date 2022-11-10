const GoalTypes = [
  "Military Conquest",
  "Commercial Expansion",
  "Intelligence Coup",
  "Planetary Seizure",
  "Expand Influence",
  "Blood the Enemy",
  "Peaceable Kingdom",
  "Destroy the Foe",
  "Inside Enemy Territory",
  "Invincible Valor",
  "Wealth of Worlds",
] as const;

type GoalType = typeof GoalTypes[number];

export function isGoalType(maybeGoal: unknown): maybeGoal is GoalType {
  return typeof maybeGoal === "string" && GoalTypes.includes(maybeGoal as GoalType);
}

export default GoalType;
