import { useMemo } from 'react';

export const throttle = (interval: number = 1000) => {
  let lastUpdated: number | undefined;
  let timeout: NodeJS.Timeout | undefined;

  return (callback: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
    const now = Date.now();

    if (lastUpdated === undefined || now >= lastUpdated + interval) {
      lastUpdated = now;
      callback();
    } else {
      timeout = setTimeout(() => {
        lastUpdated = now;
      }, interval);
    }
  };
};

/**
 * Throttle hook.
 * Taken and modified from https://github.com/uidotdev/usehooks/blob/main/index.js#L1241
 */
export const useThrottle = (interval: number = 1000) => {
  return useMemo(() => throttle(interval), [interval]);
};

export const delayThrottle = (interval: number = 1000) => {
  let lastUpdated: number | undefined;
  let timeout: NodeJS.Timeout | undefined;

  return (callback: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
    const now = Date.now();

    if (lastUpdated === undefined) {
      lastUpdated = now;
    } else if (now >= lastUpdated + interval) {
      callback();
    } else {
      timeout = setTimeout(() => {
        lastUpdated = now;
      }, interval);
    }
  };
};

/**
 * Throttle hook but it runs the callback after the timeout.
 * Modified from https://github.com/uidotdev/usehooks/blob/main/index.js#L1241
 */
export const useDelayThrottle = (interval: number = 1000) => {
  return useMemo(() => delayThrottle(interval), [interval]);
};
