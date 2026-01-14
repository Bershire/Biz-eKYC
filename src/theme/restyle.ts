import {
  AllProps,
  BackgroundColorProps,
  BaseTheme,
  BorderProps,
  ColorProps,
  Dimensions,
  LayoutProps,
  OpacityProps,
  PositionProps,
  RNStyle,
  ShadowProps,
  SpacingProps,
  TextShadowProps,
  TypographyProps,
  VariantProps,
  VisibleProps,
  backgroundColor,
  border,
  color,
  composeRestyleFunctions,
  createVariant,
  layout,
  opacity,
  position,
  shadow,
  spacing,
  textShadow,
  typography,
  useRestyle,
  visible,
} from '@shopify/restyle';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Theme } from './theme';

export type ViewRestyleProps = BackgroundColorProps<Theme> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  PositionProps<Theme> & { style?: StyleProp<ViewStyle> };

export type ImageRestyleProps = BackgroundColorProps<Theme> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  ShadowProps<Theme> &
  PositionProps<Theme> & { style?: StyleProp<ImageStyle> };

export type TextRestyleProps = BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  ColorProps<Theme> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  LayoutProps<Theme> &
  TypographyProps<Theme> &
  SpacingProps<Theme> &
  TextShadowProps<Theme> &
  PositionProps<Theme> &
  VariantProps<Theme, 'textVariants'> & { style?: StyleProp<TextStyle> };

export const viewFunctions = [
  backgroundColor,
  opacity,
  visible,
  layout,
  spacing,
  border,
  shadow,
  position,
];

export const textFunctions = [
  backgroundColor,
  border,
  color,
  opacity,
  visible,
  typography,
  spacing,
  textShadow,
  position,
  createVariant<Theme, 'textVariants'>({ themeKey: 'textVariants' }),
];

export const composedViewFunctions = composeRestyleFunctions<Theme, ViewRestyleProps>(
  viewFunctions,
);

export const composedTextFunctions = composeRestyleFunctions<Theme, TextRestyleProps>(
  textFunctions,
);

type RestyleStyle = AllProps<Theme> & { rawStyle?: StyleProp<RNStyle> };
type NamedRestyles<T> = { [P in keyof T]: RestyleStyle };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- I just follow the StyleSheet type
export const createRestyles = <T extends NamedRestyles<T> | NamedRestyles<any>>(
  styles: T | NamedRestyles<T>,
): T => {
  return styles as T;
};

export const mergeRestyles = <T extends (RestyleStyle | undefined | null)[]>(
  ...styles: T
): RestyleStyle => {
  const mergedStyle: RestyleStyle = {};

  for (const style of styles) {
    if (style) {
      const resRawStyle = mergedStyle.rawStyle;
      Object.assign(mergedStyle, style);

      if (resRawStyle) {
        Object.assign(resRawStyle, style.rawStyle);
        mergedStyle.rawStyle = resRawStyle;
      }
    }
  }

  return mergedStyle;
};

export const useRestyleStyle = <
  Theme extends BaseTheme,
  TRestyleProps extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I just follow the restyle type
    [key: string]: any;
  },
  Style extends RNStyle,
  TProps extends TRestyleProps & {
    style?: StyleProp<Style>;
  },
>(
  composedRestyleFunction: {
    buildStyle: <TInputProps extends TProps>(
      props: TInputProps,
      {
        theme,
        dimensions,
      }: {
        theme: Theme;
        dimensions: Dimensions | null;
      },
    ) => Style;
    properties: (keyof TProps)[];
    propertiesMap: { [key in keyof TProps]: boolean };
  },
  props?: TProps,
): TProps['style'] => {
  return useRestyle(composedRestyleFunction, (props || {}) as TProps).style;
};

export const useAppRestyles = {};
