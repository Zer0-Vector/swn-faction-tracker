declare global {
  function yieldToEventLoop(timeout?: number): Promise<void>;

  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

export {};
