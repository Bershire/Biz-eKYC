import { useMemo } from 'react';

export const debounce = (bounceRate: number = 1000) => {
  let busy = false;
  let timeout: NodeJS.Timeout | undefined;

  return (callback: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      busy = false;
    }, bounceRate);

    if (!busy) {
      busy = true;
      callback();
    }
  };
};

/**
 * Debounce hook.
 * Taken from https://stackoverflow.com/questions/47102946/prevent-double-tap-in-react-native
 */
export const useDebounce = (bounceRate: number = 1000) => {
  return useMemo(() => debounce(bounceRate), [bounceRate]);
};

export const delayDebounce = (bounceRate: number = 1000) => {
  let busy = false;
  let timeout: NodeJS.Timeout | undefined;

  return (callback: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      busy = false;
      callback();
    }, bounceRate);

    if (!busy) {
      busy = true;
    }
  };
};

/**
 * Debounce hook but it runs the callback after the timeout.
 * Modified from https://stackoverflow.com/questions/47102946/prevent-double-tap-in-react-native
 */
export const useDelayDebounce = (bounceRate: number = 1000) => {
  return useMemo(() => delayDebounce(bounceRate), [bounceRate]);
};
