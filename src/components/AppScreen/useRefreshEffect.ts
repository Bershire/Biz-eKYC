import { useContext, useEffect, useRef } from 'react';
import { AppScreenContext } from './AppScreen';

export const useRefreshEffect = (
  callback: () => void,
  refreshing: boolean,
  config?: { skip?: boolean },
) => {
  const screenContext = useContext(AppScreenContext);
  if (!screenContext) console.warn(`'${useRefreshEffect.name}' is used outside of 'AppScreen'`);
  const callbackIndex = useRef<number>();

  useEffect(() => {
    if (!config?.skip) {
      callbackIndex.current = screenContext?.refreshingManager.registerRefreshCallback(
        callback,
        callbackIndex.current,
      );

      return () => {
        if (callbackIndex.current !== undefined)
          screenContext?.refreshingManager.unregisterRefreshCallback(callbackIndex.current);
      };
    }
  }, [callback, config?.skip, screenContext?.refreshingManager]);

  useEffect(() => {
    if (!refreshing && callbackIndex.current !== undefined)
      screenContext?.refreshingManager.finishRefreshing(callbackIndex.current);
  }, [refreshing, screenContext?.refreshingManager]);
};
