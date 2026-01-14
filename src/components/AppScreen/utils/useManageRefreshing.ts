import { useCallback, useMemo, useRef, useState } from 'react';

export type RefreshingManager = {
  /**
   * Register the refresh callback to be called when the Screen is refreshed
   *
   * @param callback The callback.
   * @param index The index the callback will be stored inside the callback array.
   *  Default to the end of the array.
   *  Use to replace old callback with the new one.
   *
   * @return The index of the callback inside the callback array.
   */
  registerRefreshCallback: (callback: () => void, index?: number) => number;

  /**
   * Unregister the refresh callback.
   *
   * @param index The index of the callback.
   */
  unregisterRefreshCallback: (index: number) => void;

  /**
   * Confirm that the callback at the specified index finished its job.
   *
   * @param index
   */
  finishRefreshing: (index: number) => void;
};

export type RefreshingData = {
  isRefreshing: boolean;
  enableRefreshing: boolean;
  handleRefresh: () => void;
};

export const useManageRefreshing = (refreshControl?: {
  refreshing: boolean;
  onRefresh?: () => void;
}): [RefreshingData, RefreshingManager] => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [enableRefreshing, setEnableRefreshing] = useState(false);
  const refreshingCallbacks = useRef<({ callback: () => void; refreshing: boolean } | undefined)[]>(
    [],
  );
  const onRefresh = refreshControl?.onRefresh;

  const handleRefresh = useCallback(() => {
    onRefresh?.();

    if (refreshingCallbacks.current.length > 0) {
      setIsRefreshing(true);
      for (const callback of refreshingCallbacks.current) {
        if (callback) {
          callback.refreshing = true;
          callback.callback();
        }
      }
    }
  }, [onRefresh]);

  const registerRefreshCallback: RefreshingManager['registerRefreshCallback'] = useCallback(
    (callback, index) => {
      setEnableRefreshing(true);

      if (index === undefined) {
        refreshingCallbacks.current.push({ callback, refreshing: false });
        return refreshingCallbacks.current.length - 1;
      }

      if (index < 0 || index >= refreshingCallbacks.current.length)
        throw new Error('Refreshing callback index is out of bounds');
      refreshingCallbacks.current[index] = {
        callback,
        refreshing: refreshingCallbacks.current[index]?.refreshing ?? false,
      };
      return index;
    },
    [],
  );

  const unregisterRefreshCallback: RefreshingManager['unregisterRefreshCallback'] = useCallback(
    index => {
      refreshingCallbacks.current[index] = undefined;
      setEnableRefreshing(refreshingCallbacks.current.length > 0);
    },
    [],
  );

  const finishRefreshing: RefreshingManager['finishRefreshing'] = useCallback(index => {
    const currentCallback = refreshingCallbacks.current[index];
    if (currentCallback) currentCallback.refreshing = false;

    setIsRefreshing(refreshingCallbacks.current.some(callback => callback?.refreshing));
  }, []);

  return [
    { isRefreshing, enableRefreshing, handleRefresh },
    useMemo(
      () => ({ registerRefreshCallback, unregisterRefreshCallback, finishRefreshing }),
      [finishRefreshing, registerRefreshCallback, unregisterRefreshCallback],
    ),
  ];
};
