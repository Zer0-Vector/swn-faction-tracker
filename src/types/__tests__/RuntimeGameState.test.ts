import AssetId from "../AssetId";
import LocationInfo from "../LocationInfo";
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
    locationsOrder: [],
  };
  state = new RuntimeGameState(storedState);
});

describe('getFactions', () => {
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

describe('getAssets', () => {
  it('is empty if factionId=undefined', () => {
    expect(state.getAssets(undefined).length).toEqual(0);
  });
  
  it('is empty on init', () => {
    state.addFaction("Test One");
    expect(state.getAssets("test-one").length).toEqual(0);
  });

  it('is empty if faction DNE', () => {
    expect(state.getAssets("test-dne").length).toEqual(0);
  });

  it('contains asset after adding one', () => {
    const faction = state.addFaction("Test Two");
    const asset = state.addAsset(faction.id, "Test Asset");
    const assets = state.getAssets(faction.id);
    expect(assets.length).toEqual(1);
    expect(assets.at(0)?.id).toEqual(asset.id);
  });

  it('does not contain asset after removing it', () => {
    const faction = state.addFaction("Test Two");
    const asset = state.addAsset(faction.id, "Test Asset");
    state.addAsset(faction.id, "Asset 2");
    expect(state.getAssets(faction.id).length).toEqual(2);
    state.removeAsset(faction.id, AssetId.toRefFormat(asset.id));
    const assets = state.getAssets(faction.id);
    expect(assets.length).toEqual(1);
    expect(assets.at(0)?.id).not.toEqual(asset.id);
  });
});

describe('getLocations', () => {
  it.todo('is empty on init');
  it.todo('contains location after adding one');
  it.todo('does not contain location after removing it');
});

describe('getLocation', () => {
  it.todo('is undefined if locationId DNE');
  it.todo('returns location');
});

describe('reorderLocations', () => {
  it.todo('updates location order array');
});

describe('updateLocationName', () => {
  beforeEach(() => {
    state.addLocation(new LocationInfo("Location One", 1, 1, 1));
  });
  
  it('updates location id and name in locations map', () => {
    const oldInfo = state.getLocation("location-one");
    expect(oldInfo).not.toBeUndefined();
    expect(state.getLocation("location-two")).toBeUndefined();
    state.updateLocationName("location-one", "Location Two");
    expect(state.getLocation("location-one")).toBeUndefined();
    
    const info = state.getLocation("location-two");
    expect(info).not.toBeUndefined();
    expect(info?.name).toBe("Location Two");
    expect(info?.tl).toBe(oldInfo?.tl);
    expect(info?.x).toBe(oldInfo?.x);
    expect(info?.y).toBe(oldInfo?.y);
  });

  it('updates locationId in locationsOrder array', () => {
    expect(storedState.locationsOrder.length).toBe(1);
    expect(storedState.locationsOrder).toContain("location-one");
    state.updateLocationName("location-one", "Location Two");
    expect(storedState.locationsOrder.length).toBe(1);
    expect(storedState.locationsOrder).toContain("location-two");
  });
  
  it('updates any factions which reference updated location', () => {
    const faction = state.addFaction("Faction One");
    faction.homeworldId = "location-one";
    state.updateLocationName("location-one", "Location Two");
    const updatedFaction = state.getFaction("faction-one");
    expect(updatedFaction?.homeworldId).toBe("location-two");
  });

  it('updates any assets which reference updated location', () => {
    const faction = state.addFaction("Faction Two");
    const asset = state.addAsset(faction.id, "Smugglers");
    asset.locationId = "location-one";
    state.updateLocationName("location-one", "Location Three");
    const updatedAsset = state.getAsset(faction.id, "smugglers-1");
    expect(updatedAsset?.locationId).toBe("location-three");
  });
});

describe('removeLocation', () => {
  it.todo('removes location from location map');
  it.todo('updates any factions which reference removed location');
});

describe('addLocation', () => {
  it.todo('adds location to location map and locationsOrder array');
});

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
