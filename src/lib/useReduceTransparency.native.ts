import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// iOS Settings → Accessibility → Display & Text Size → Reduce Transparency.
// Android has no such setting, so React Native always reports false there.
export function useReduceTransparency(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceTransparencyEnabled().then((v) => alive && setReduce(v));
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduce;
}
