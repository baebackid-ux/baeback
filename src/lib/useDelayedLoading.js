import { useEffect, useState } from 'react';

/**
 * Custom hook to delay loading state to avoid skeleton/spinner flicker on fast loads.
 * @param {boolean} loading The original loading state.
 * @param {number} delay Delay in milliseconds.
 * @returns {boolean} The delayed loading state.
 */
export function useDelayedLoading(loading, delay = 200) {
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setDelayedLoading(true);
      }, delay);
    } else {
      setDelayedLoading(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loading, delay]);

  return delayedLoading;
}
