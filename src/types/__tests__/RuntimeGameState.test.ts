import RuntimeGameState from "../RuntimeGameState";
import StoredGameState from "../StoredGameState";

let storedState: StoredGameState;
let state: RuntimeGameState;
beforeEach(() => {
  storedState = {
    mode: "EDIT",
    factions: [],
    assets: [],
    factionOrder: [],
    locations: [],
    locationsOrder: []
  };
  state = new RuntimeGameState(storedState);
});

describe('getFactions', () => {
  // TODO add assertions on StoredGameState
  it('is empty on init', () => {
    expect(state.getFactions()).toEqual([]);
  });

  it('has faction after adding one', () => {
    expect(state.getFactions().length).toBe(0);
    state.addFaction("test");
    const factions = state.getFactions();
    expect(factions.length).toBe(1);
    expect(factions.at(0)).toBeDefined();
    expect(factions.at(0)?.name).toBe("test");
  });

  it('is empty again after removing existing faction', () => {
    expect(state.getFactions().length).toBe(0);
    state.addFaction("test2");
    expect(state.getFactions().length).toBe(1);
    state.removeFaction("test2");
    expect(state.getFactions().length).toBe(0);
  });
});

describe('getFaction', () => {
  // TODO add assertions on StoredGameState
  it('is undefined when requesting a non-existant faction name', () => {
    expect(state.getFactions().length).toBe(0);
    state.addFaction("test3");
    expect(state.getFaction("test-does-not-exist")).not.toBeDefined();
  });
  
  it('returns faction by name', () => {
    expect(state.getFactions().length).toBe(0);
    state.addFaction("test4");
    expect(state.getFaction("test4")).toBeDefined();
    expect(state.getFaction("test4")?.name).toBe("test4");
  });
});

// TODO getAssets
// TODO getLocations
// TODO getLocation
// TODO reorderLocations
// TODO updateLocationName
// TODO removeLocation
// TODO addLocation
// TODO removeAsset
// TODO addAsset
// TODO updateTag
// TODO reorderFactions
// TODO addFaction
// TODO removeFaction
// TODO updateFactionName
// TODO updateForce
// TODO updateCunning
// TODO updateWealth
// TODO updateHp
// TODO updateMaxHp
// TODO updateHomeworld
