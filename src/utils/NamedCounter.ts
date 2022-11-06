export default class NamedCounter {
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  
  private static COUNTS: { [key: string]: number };

  static increment(key: string): number {
    if (key in NamedCounter.COUNTS) {
      NamedCounter.COUNTS[key]++;
    } else {
      NamedCounter.COUNTS[key] = 1;
    }
    return NamedCounter.COUNTS[key];
  }
  
  static decrement(key: string): number {
    if (key in NamedCounter.COUNTS && NamedCounter.COUNTS[key] > 0) {
      NamedCounter.COUNTS[key]--;
    } else {
      NamedCounter.COUNTS[key] = 0;
    }
    return NamedCounter.COUNTS[key];
  }

  static get(key: string): number {
    return NamedCounter.COUNTS[key] || 0;
  }

}
