declare global {
  function yieldToEventLoop(delay?: number): Promise<void>;

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

export {};
