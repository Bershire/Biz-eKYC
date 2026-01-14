import { composeRestyleFunctions, useRestyle } from '@shopify/restyle';
import React, { MutableRefObject, forwardRef } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { FlatList as GestureFlatList } from 'react-native-gesture-handler';
import {
  ViewRestyleProps,
  composedViewFunctions,
  useRestyleStyle,
  viewFunctions,
} from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';

export type AppFlatListStyleProps<ItemT> = Omit<FlatListProps<ItemT>, 'contentContainerStyle'> &
  ViewRestyleProps;
export interface AppFlatListProps<ItemT> extends AppFlatListStyleProps<ItemT> {
  contentContainerStyle?: ViewRestyleProps;
}

const flatListFuntions = composeRestyleFunctions<Theme, AppFlatListStyleProps<unknown>>(
  viewFunctions,
);

const AppFlatList = forwardRef<FlatList<unknown>, AppFlatListProps<unknown>>(
  ({ contentContainerStyle, ...rest }, ref) => {
    const styledProps = useRestyle(flatListFuntions, rest);
    const rawContentContainerStyle = useRestyleStyle(composedViewFunctions, contentContainerStyle);

    return (
      <FlatList
        ref={ref}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        {...styledProps}
        contentContainerStyle={rawContentContainerStyle}
      />
    );
  },
) as <ItemT>(
  p: AppFlatListProps<ItemT> & { ref?: MutableRefObject<FlatList<ItemT> | null> },
) => React.ReactElement;

export default AppFlatList;

// FlatList but can fully take over gesture control
export const AppGestureFlatList = forwardRef<GestureFlatList<unknown>, AppFlatListProps<unknown>>(
  ({ contentContainerStyle, ...rest }, ref) => {
    const styledProps = useRestyle(flatListFuntions, rest);
    const rawContentContainerStyle = useRestyleStyle(composedViewFunctions, contentContainerStyle);

    return (
      <GestureFlatList
        ref={ref}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        {...styledProps}
        contentContainerStyle={rawContentContainerStyle}
      />
    );
  },
) as <ItemT>(
  p: AppFlatListProps<ItemT> & { ref?: MutableRefObject<FlatList<ItemT> | null> },
) => React.ReactElement;
