const GameModes = [ "EDIT", "VIEW", "TURN" ] as const;

export function isGameMode(maybeGameMode: unknown): maybeGameMode is GameMode {
  return typeof maybeGameMode === "string" && GameModes.includes(maybeGameMode as GameMode);
}

type GameMode = typeof GameModes[number];

export default GameMode;
