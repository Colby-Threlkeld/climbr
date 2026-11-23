import { useEffect, useState } from 'react';

// Web + fallback. Chrome/Edge/Android Chrome support this media query; iPhone Safari does NOT
// (it always reports no preference), which is why glass tints have a contrast floor.
const QUERY = '(prefers-reduced-transparency: reduce)';

export function useReduceTransparency(): boolean {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(QUERY).matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduce;
}
