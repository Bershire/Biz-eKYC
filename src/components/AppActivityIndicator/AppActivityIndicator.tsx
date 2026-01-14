import {
  ColorProps,
  color as colorFunc,
  composeRestyleFunctions,
  useRestyle,
} from '@shopify/restyle';
import React, { useMemo } from 'react';
import { ActivityIndicator, ActivityIndicatorProps, ColorValue, StyleSheet } from 'react-native';
import { ViewRestyleProps, viewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';

export type AppActivityIndicatorStyleProps = ViewRestyleProps & ColorProps<Theme>;
export interface AppActivityIndicatorProps
  extends Omit<ActivityIndicatorProps, 'color'>,
    AppActivityIndicatorStyleProps {
  // props
}

const activityIndicatorFunctions = composeRestyleFunctions<Theme, AppActivityIndicatorStyleProps>([
  ...viewFunctions,
  colorFunc,
]);

type ActivityIndicatorRawStyle = ActivityIndicatorProps['style'] & { color?: ColorValue };
type ActivityIndicatorPropsWithColorStyle = ActivityIndicatorProps & {
  style?: ActivityIndicatorRawStyle;
};

const AppActivityIndicator: React.FC<AppActivityIndicatorProps> = ({
  color = 'primary',
  ...rest
}) => {
  const styledProps = useRestyle(activityIndicatorFunctions, {
    color,
    ...rest,
  } as AppActivityIndicatorStyleProps) as ActivityIndicatorPropsWithColorStyle;
  const rawColor = useMemo(
    () => (StyleSheet.flatten(styledProps.style) as ActivityIndicatorRawStyle | undefined)?.color,
    [styledProps.style],
  );

  return <ActivityIndicator {...styledProps} color={rawColor} />;
};

export default AppActivityIndicator;
