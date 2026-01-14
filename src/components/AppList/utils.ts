import { QueryDefinition, skipToken } from '@reduxjs/toolkit/query';
import { ViewToken } from '@shopify/flash-list';
import { UseQuery } from 'node_modules/@reduxjs/toolkit/dist/query/react/buildHooks';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { usePrevious } from 'react-delta';
import { shallowCompare } from 'src/utils/shallowCompare';
import { useDelayDebounce } from 'src/utils/useDebounce';
import { useRefreshControl } from '../AppRefreshControl/utils/useRefreshControl';
import { AppListProps } from './AppList';

export type GetUseQueryDefinition<T> = T extends UseQuery<infer U> ? U : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- I copied this from redux source code
export type DefaultQueryDefinition = QueryDefinition<any, any, any, any>;

// Reduce main function's complexity
// TODO: Make this code spliting more reasonable
export const useFullArgs = (
  page: number,
  pageSize: number,
  args: unknown,
  getPageArgs: AppListProps<DefaultQueryDefinition, unknown>['getPageArgs'],
  reset: () => void,
) => {
  const prevArgs = usePrevious(args);
  const pageArgs = getPageArgs?.(page, pageSize);

  useEffect(() => {
    if (
      prevArgs !== undefined &&
      prevArgs !== skipToken &&
      (typeof args === 'object' ?
        !shallowCompare(
          args as { [key: string]: unknown },
          prevArgs as { [key: string]: unknown },
          pageArgs && Object.keys(pageArgs),
        )
      : args !== prevArgs)
    ) {
      reset();
    }
  });

  if (args !== undefined && typeof args !== 'symbol' && typeof args !== 'object' && pageArgs) {
    console.warn('Cannot apply `pageArgs` to a non-object `args`');
  }

  return (
    typeof args === 'symbol' ? args
    : args || pageArgs ?
      typeof args === 'object' || args === undefined ?
        { ...args, ...pageArgs }
      : args
    : undefined) as unknown;
};

// Reduce main function's complexity
export const usePaging = (
  fullData: unknown[] | undefined | null,
  currentData: unknown[] | undefined | null,
  page: number,
  pageSize: number,
  mode: 'fresh' | 'concat',
  setFullData: Dispatch<SetStateAction<unknown[] | undefined>>,
  setPage: Dispatch<SetStateAction<number>>,
  setMode: Dispatch<SetStateAction<'fresh' | 'concat'>>,
  paging: boolean,
  pageEnd: boolean,
  errorMessage: string | undefined,
  isUninitialized: boolean,
  isFetching: boolean,
  onEndReached: (() => void) | null | undefined,
  onViewableItemsChanged:
    | ((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void)
    | null
    | undefined,
  refetch: () => void,
  filterResult?: (item: unknown) => boolean,
  transformData?: (item: unknown[]) => unknown[],
  onFullRawDataUpdate?: (items: unknown[] | undefined) => void,
) => {
  const filteredData = useMemo(
    () => (filterResult ? fullData?.filter(item => filterResult(item)) : fullData),
    [fullData, filterResult],
  );
  const transformedData = useMemo(
    () => (transformData && filteredData ? transformData(filteredData) : filteredData),
    [filteredData, transformData],
  );

  useEffect(() => {
    if (currentData) {
      setFullData(pre => {
        if (paging && pre && mode === 'concat') {
          const res = Array.from(pre);
          res.splice(
            page * pageSize,
            currentData.length < pageSize ? res.length : pageSize,
            ...currentData,
          );
          return res;
        }

        return currentData;
      });
    }
  }, [currentData, mode, page, pageSize, paging, setFullData]);

  const handleEndReached = useCallback(() => {
    if (paging && !pageEnd && !errorMessage && !isFetching && !isUninitialized) {
      setPage(pre => pre + 1);
      requestAnimationFrame(() => refetch());
      setMode('concat');
    }

    onEndReached?.();
  }, [
    errorMessage,
    isFetching,
    isUninitialized,
    onEndReached,
    pageEnd,
    paging,
    refetch,
    setMode,
    setPage,
  ]);

  const viewableItemsChangeDebounce = useDelayDebounce(1000);
  const handleViewableItemsChange = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      viewableItemsChangeDebounce(() => {
        // FIXME: refetching the viewable items data when necessary (e.g. data is invalidated)
        // console.log(info.viewableItems.map(i => i.index));
        // setPage(pre => pre + 1);
        // setMode('concat');
      });

      onViewableItemsChanged?.(info);
    },
    [onViewableItemsChanged, viewableItemsChangeDebounce],
  );

  const onFullRawDataUpdateRef = useRef(onFullRawDataUpdate);
  onFullRawDataUpdateRef.current = onFullRawDataUpdate;
  useEffect(() => {
    onFullRawDataUpdateRef.current?.(fullData ?? undefined);
  }, [fullData]);

  return { cookedData: transformedData, handleEndReached, handleViewableItemsChange };
};

type RefreshControl = { refreshing: boolean; onRefresh: () => void };

// Reduce main function's complexity
export const useMergedRefreshControl = (
  rc1: RefreshControl,
  rc2?: RefreshControl,
  props?: AppListProps<DefaultQueryDefinition, unknown>['refreshControlProps'],
) => {
  return {
    ...props,
    ...useRefreshControl(
      useCallback(() => {
        rc1.onRefresh();
        rc2?.onRefresh();
      }, [rc1, rc2]),
      rc2?.refreshing || rc1.refreshing,
    ),
  };
};

export const formatPostalCode = (postalCode: string) => {
  return postalCode.replace(/(\d{3})(\d{4})/, '$1  -  $2');
};
