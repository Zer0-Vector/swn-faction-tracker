export interface IObservable<A> {
  subscribe(callback: (action: A)=>void): ()=>void;
}

export abstract class Observable<A> implements IObservable<A> {
  
  private readonly observers: Set<(action: A)=>void>;
  
  constructor() {
    this.observers = new Set();
  }

  public subscribe(callback: (action: A)=>void): ()=>void {
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  protected notifyObservers(action: A) {
    this.observers.forEach(cb => cb(action));
  }

}
