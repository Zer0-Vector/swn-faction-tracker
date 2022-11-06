type NamedCounterMap = { [key: string]: number };

export default class NamedCounter {
    
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  
  private static COUNTS: NamedCounterMap = localStorage.getItem("Faction-counts") ? JSON.parse(localStorage.getItem("Faction-counts") as string) : {};

  static increment(key: string): number {
    if (key in NamedCounter.COUNTS) {
      NamedCounter.COUNTS[key]++;
    } else {
      NamedCounter.COUNTS[key] = 1;
    }
    localStorage.setItem("Faction-counts", JSON.stringify(NamedCounter.COUNTS));
    return NamedCounter.COUNTS[key];
  }
  
  static decrement(key: string): number {
    if (key in NamedCounter.COUNTS && NamedCounter.COUNTS[key] > 0) {
      NamedCounter.COUNTS[key]--;
    } else {
      NamedCounter.COUNTS[key] = 0;
    }
    localStorage.setItem("Faction-counts", JSON.stringify(NamedCounter.COUNTS));
    return NamedCounter.COUNTS[key];
  }
  
  static get(key: string): number {
    return NamedCounter.COUNTS[key] || 0;
  }
  
  static reset() {
    NamedCounter.COUNTS = {};
    localStorage.setItem("Faction-counts", JSON.stringify(NamedCounter.COUNTS));
  }

}
