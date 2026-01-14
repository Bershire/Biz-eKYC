import { useCallback, useRef } from 'react';

export type EventListener<T = void> = (data: T) => void;

export function useEventEmitter<T = void>() {
  const subscribersRef = useRef<EventListener<T>[]>([]);

  const subscribe = useCallback((listener: EventListener<T>) => {
    subscribersRef.current.push(listener);

    return () => {
      subscribersRef.current = subscribersRef.current.filter(l => l !== listener);
    };
  }, []);

  const emit = useCallback((data: T) => {
    for (const listener of subscribersRef.current) listener(data);
  }, []);

  return [subscribe, emit] as const;
}
