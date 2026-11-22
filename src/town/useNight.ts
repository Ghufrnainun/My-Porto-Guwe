import { useEffect, useState } from 'react';

const NIGHT_KEY = 'town-night';

const stored = () => {
  try {
    return window.localStorage.getItem(NIGHT_KEY) === '1';
  } catch {
    return false; // storage blocked: start in daylight
  }
};

/** Day or night, shared by the town and the pages around it (blog, resume, 404) through localStorage. */
export function useTownNight() {
  const [night, setNight] = useState(() => typeof window !== 'undefined' && stored());

  useEffect(() => {
    try {
      window.localStorage.setItem(NIGHT_KEY, night ? '1' : '0');
    } catch {
      // private mode: the choice just does not persist
    }
  }, [night]);

  return [night, setNight] as const;
}
