import { useState } from 'react';

/**
 * Hooks to use with refresh control.
 */
export const useRefreshControl = (
  refetch: (() => void) | (() => void)[],
  isFetching: boolean | boolean[],
  skip?: boolean | boolean[],
): { refreshing: boolean; onRefresh: () => void } => {
  const [refreshing, setRefreshing] = useState(false);
  const isSomeFetching = Array.isArray(isFetching) ? isFetching.some(Boolean) : isFetching;
  const skipList = Array.isArray(skip) ? skip : [skip];

  if (refreshing && !isSomeFetching) {
    setRefreshing(false);
  }

  return {
    refreshing: refreshing && isSomeFetching,
    onRefresh: () => {
      setRefreshing(true);
      if (Array.isArray(refetch)) {
        for (const [index, cb] of refetch.entries())
          if (!skipList[index]) {
            cb();
          }
      } else if (!skipList[0]) {
        refetch();
      }
    },
  };
};
