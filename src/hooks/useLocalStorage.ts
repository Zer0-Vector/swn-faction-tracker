import { useEffect, useState } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved) as T;
  } else {
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T):
    [value: T, setValue: React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
