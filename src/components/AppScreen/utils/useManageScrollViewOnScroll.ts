import { useCallback, useMemo, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type OnScrollManager = {
  /**
   * Register the onScroll callback to be called when the Screen is onScrolled
   *
   * @param callback The callback.
   *
   * @return The index of the callback inside the callback array.
   */
  registerOnScrollCallback: (
    callback: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
  ) => number;

  /**
   * Unregister the onScroll callback.
   *
   * @param index The index of the callback.
   */
  unregisterOnScrollCallback: (index: number) => void;
};

export const useManageScrollViewOnScroll = (): [
  (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
  OnScrollManager,
] => {
  const onScrollCallbacks = useRef<
    (((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined)[]
  >([]);
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (onScrollCallbacks.current.length > 0) {
      for (const callback of onScrollCallbacks.current) {
        callback?.(event);
      }
    }
  }, []);

  const registerOnScrollCallback: OnScrollManager['registerOnScrollCallback'] = useCallback(
    callback => {
      onScrollCallbacks.current.push(callback);
      return onScrollCallbacks.current.length - 1;
    },
    [],
  );

  const unregisterOnScrollCallback: OnScrollManager['unregisterOnScrollCallback'] = useCallback(
    index => {
      onScrollCallbacks.current[index] = undefined;
    },
    [],
  );

  return [
    handleScroll,
    useMemo(
      () => ({ registerOnScrollCallback, unregisterOnScrollCallback }),
      [registerOnScrollCallback, unregisterOnScrollCallback],
    ),
  ];
};
