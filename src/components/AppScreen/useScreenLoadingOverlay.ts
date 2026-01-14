import { useContext, useEffect } from 'react';
import { noop } from 'src/utils/noop';
import { isSafe } from 'src/utils/safety';
import { AppScreenContext } from './AppScreen';

export function useScreenLoadingOverlay(): (show: boolean) => void;
export function useScreenLoadingOverlay(isLoading: boolean): void;
export function useScreenLoadingOverlay(isLoading?: boolean): ((show: boolean) => void) | void {
  const screenContext = useContext(AppScreenContext);
  if (!screenContext)
    console.warn(`'${useScreenLoadingOverlay.name}' is used outside of 'AppScreen'`);

  const setLoading = screenContext?.setShowOverlayLoading ?? noop;
  useEffect(() => {
    if (isSafe(isLoading)) {
      setLoading(isLoading);
    }
  }, [isLoading, setLoading]);

  return isSafe(isLoading) ? undefined : setLoading;
}
