import { QueryActionCreatorResult, QueryArgFrom, skipToken } from '@reduxjs/toolkit/query';
import { ContentStyle, FlashList, FlashListProps } from '@shopify/flash-list';
import {
  BackgroundColorProps,
  SpacingProps,
  backgroundColor,
  composeRestyleFunctions,
  spacing,
} from '@shopify/restyle';
import {
  UseQuery,
  UseQueryStateDefaultResult,
} from 'node_modules/@reduxjs/toolkit/dist/query/react/buildHooks';
import React, {
  MutableRefObject,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useRestyleStyle } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';
import AppRefreshControl, { AppRefreshControlProps } from '../AppRefreshControl/AppRefreshControl';
import AppText from '../AppText/AppText';
import AppView from '../AppView/AppView';
import EqualHeightItemsFlashList, {
  EqualHeightItemsFlashListProps,
} from '../EqualHeightItemsFlashList/EqualHeightItemsFlashList';
import { useRealDimensions } from '../RealDimensions/RealDimensions';
import AppListFooter from './components/AppListFooter/AppListFooter';
import { DefaultQueryDefinition, useFullArgs, useMergedRefreshControl, usePaging } from './utils';

type ContentContainerStyle = Pick<
  BackgroundColorProps<Theme> & SpacingProps<Theme> & { style?: ContentStyle },
  keyof ContentStyle | 'style'
>;
export interface AppListProps<D extends DefaultQueryDefinition, RItem, TItem = RItem>
  extends Omit<
    EqualHeightItemsFlashListProps<TItem>,
    'data' | 'style' | 'refreshControl' | 'refreshing' | 'onRefresh' | 'contentContainerStyle'
  > {
  useQuery: UseQuery<D>;
  args: QueryArgFrom<D> | symbol;
  extractData: (data?: Omit<UseQueryStateDefaultResult<D>, 'data'>) => RItem[] | undefined | null;
  queryRefetchConfig?: {
    refetchOnFocus?: boolean;
    refetchOnMountOrArgChange?: boolean;
    refetchOnReconnect?: boolean;
  };
  contentContainerStyle?: ContentContainerStyle;
  extractError?: (error: unknown) => string;
  getPageArgs?: (page: number, size: number) => Partial<QueryArgFrom<D>>;
  pageSize?: number;
  emptyMessage?: string | React.ReactElement;
  infoPosition?: 'center' | 'top';
  filterData?: (item: RItem) => boolean;
  transformData?: (data: RItem[]) => TItem[];
  estimatedItemSize: FlashListProps<TItem>['estimatedItemSize'];
  ListHeaderComponent?:
    | React.ComponentType<{
        data: TItem[] | undefined | null;
        unfilteredData: TItem[] | undefined | null;
        rawResult: UseQueryStateDefaultResult<D>;
      }>
    | React.ReactElement
    | null
    | undefined;
  ListFooterComponent?:
    | React.ComponentType<{
        data: TItem[] | undefined | null;
        unfilteredData: TItem[] | undefined | null;
        rawResult: UseQueryStateDefaultResult<D>;
      }>
    | React.ReactElement
    | null
    | undefined;
  refreshControl?: { refreshing: boolean; onRefresh: () => void };
  refreshControlProps?: Omit<AppRefreshControlProps, 'refreshing' | 'onRefresh'>;
  hideFooter?: boolean;
  hideFooterLoading?: boolean;
  additionalItems?: TItem[];
  onFullRawDataUpdate?: (data: RItem[] | undefined) => void;
}

export interface AppListRef<D extends DefaultQueryDefinition, TItem> extends FlashList<TItem> {
  refetch: () => QueryActionCreatorResult<D> | undefined;
}

type Spacing = (typeof spacing)[number];
type Padding = Omit<Spacing, 'property'> & { property: Spacing['property'] & keyof ContentStyle };
const contentContainerFunctions = composeRestyleFunctions<Theme, ContentContainerStyle>([
  backgroundColor,
  spacing as Padding[],
]);

const AppList = forwardRef<
  AppListRef<DefaultQueryDefinition, unknown>,
  AppListProps<DefaultQueryDefinition, unknown, unknown>
>(
  (
    {
      useQuery,
      args,
      extractData,
      extractError,
      queryRefetchConfig,
      getPageArgs,
      pageSize = 10,
      emptyMessage,
      infoPosition = 'center',
      filterData,
      transformData,
      onEndReached,
      onViewableItemsChanged,
      onEndReachedThreshold = 0.1,
      ListHeaderComponent,
      ListFooterComponent,
      ListEmptyComponent,
      estimatedItemSize,
      refreshControl,
      refreshControlProps,
      contentContainerStyle,
      hideFooter,
      hideFooterLoading,
      additionalItems,
      onFullRawDataUpdate,
      ...rest
    },
    ref,
  ) => {
    const rawContentContainerStyle = StyleSheet.flatten(
      useRestyleStyle(contentContainerFunctions, contentContainerStyle),
    );

    const { t } = useTranslation('common');
    const { height } = useRealDimensions();
    const innerRef = useRef() as MutableRefObject<FlashList<unknown>>;
    const [_fullData, setFullData] = useState<unknown[]>();
    const [page, setPage] = useState(0);
    const [mode, setMode] = useState<'concat' | 'fresh'>('fresh');
    const paging = !!getPageArgs;

    const fullArgs = useFullArgs(page, pageSize, args, getPageArgs, () => {
      setFullData(undefined);
      setPage(0);
      refetch();
    });
    const result = useQuery(fullArgs, {
      selectFromResult: useCallback(
        (res: UseQueryStateDefaultResult<DefaultQueryDefinition>) => ({
          ...res,
          currentData: extractData(res),
        }),
        [extractData],
      ),
      ...queryRefetchConfig,
    });
    const {
      currentData,
      error,
      isFetching,
      isLoading,
      refetch: unsafeRefetch,
      isUninitialized,
    } = result;
    const fullData = _fullData ?? currentData; // on first load, full data will be delayed 1 frame, I don't like that

    const skip = args === skipToken;
    const refetch = useCallback(() => {
      if (!isUninitialized && !skip) return unsafeRefetch();
    }, [isUninitialized, skip, unsafeRefetch]);

    useImperativeHandle(ref, () => {
      const exposedRef = innerRef.current as AppListRef<DefaultQueryDefinition, unknown>;
      exposedRef.refetch = refetch;

      return exposedRef;
    });

    const errorMessage = error ? extractError?.(error) || t('genericErrorMessage') : undefined;
    // const pageEnd = paging ? !!currentData && currentData.length < pageSize : true;
    const total = (result as any)?.data?.total ?? undefined;
    const pageEnd =
      paging ?
        total !== undefined ?
          (page + 1) * pageSize >= total
        : !!currentData && currentData.length === 0
      : true;
    const { cookedData, handleEndReached, handleViewableItemsChange } = usePaging(
      fullData,
      currentData,
      page,
      pageSize,
      mode,
      setFullData,
      setPage,
      setMode,
      paging,
      pageEnd,
      errorMessage,
      isUninitialized,
      isFetching,
      onEndReached,
      onViewableItemsChanged,
      refetch,
      filterData,
      transformData,
      onFullRawDataUpdate,
    );

    const onRefresh = useCallback(() => {
      if (paging) setPage(0);
      refetch();
      setMode('fresh');
    }, [paging, refetch]);
    const totalRefreshControlProps = useMergedRefreshControl(
      { refreshing: isFetching, onRefresh },
      refreshControl,
      refreshControlProps,
    );

    const infoMargin = rest.inverted ? 'marginBottom' : 'marginTop';
    const isEmpty = cookedData?.length === 0;
    const showEmptyMessage = !(isLoading && !totalRefreshControlProps.refreshing) && isEmpty;
    const renderEmpty = (
      <>
        <AppView
          paddingHorizontal='xl'
          {...{ [infoMargin]: infoPosition === 'top' ? 'xl' : undefined }}
          style={
            showEmptyMessage &&
            !!emptyMessage &&
            infoPosition === 'center' && {
              [infoMargin]: height / 3.5,
            }
          }
        >
          {showEmptyMessage &&
            (typeof emptyMessage === 'string' ?
              <AppText variant='title' color='text200' textAlign='center'>
                {emptyMessage}
              </AppText>
            : emptyMessage)}
        </AppView>
        {ListEmptyComponent}
      </>
    );

    const renderHeader =
      typeof ListHeaderComponent === 'function' ?
        <ListHeaderComponent data={cookedData} unfilteredData={fullData} rawResult={result} />
      : ListHeaderComponent;

    const showFooterLoading =
      !hideFooterLoading && !totalRefreshControlProps.refreshing && (paging || isLoading);
    const renderFooter =
      hideFooter ? undefined : (
        <>
          <AppListFooter
            hidden={(paging && pageEnd) || isEmpty}
            errorMessage={errorMessage}
            showFooterLoading={showFooterLoading}
            onTryAgain={refetch}
            paddingVertical={cookedData?.length ? 'md' : undefined}
            style={
              !cookedData?.length &&
              infoPosition === 'center' && {
                [infoMargin]: height / 3.5,
              }
            }
          />
          {typeof ListFooterComponent === 'function' ?
            <ListFooterComponent data={cookedData} unfilteredData={fullData} rawResult={result} />
          : ListFooterComponent}
        </>
      );

    return (
      <EqualHeightItemsFlashList
        // Maybe reduce blank space when fast scrolling: https://github.com/Shopify/flash-list/issues/854
        data={[...(cookedData ?? []), ...(additionalItems ?? [])].slice(0)}
        ref={innerRef}
        estimatedItemSize={estimatedItemSize}
        onEndReached={handleEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onViewableItemsChanged={handleViewableItemsChange}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={<AppRefreshControl {...totalRefreshControlProps} />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        {...rest}
        contentContainerStyle={rawContentContainerStyle}
      />
    );
  },
) as <D extends DefaultQueryDefinition, RItem, TItem = RItem>(
  p: AppListProps<D, RItem, TItem> & { ref?: MutableRefObject<AppListRef<D, TItem> | null> },
) => React.ReactElement;

export default AppList;
