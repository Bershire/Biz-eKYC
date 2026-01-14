import {
  VariantProps,
  composeRestyleFunctions,
  createRestyleComponent,
  createVariant,
  useResponsiveProp,
  useRestyle,
  useTheme,
} from '@shopify/restyle';
import { MotiView } from 'moti';
import React, { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { ViewRestyleProps, viewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';

interface AppViewPropsWithoutGradient
  extends ViewProps,
    ViewRestyleProps,
    VariantProps<Theme, 'viewVariants'> {}

export interface AppViewProps
  extends AppViewPropsWithoutGradient,
    VariantProps<Theme, 'gradientVariants', 'gradientVariant'> {
  /**
   * Use LinearGradient as the View backend. Usefull when you want to toggle the gradient without rerendering the children
   */
  useGradientBackend?: boolean;
}

const appViewFunctions = composeRestyleFunctions<Theme, AppViewPropsWithoutGradient>([
  ...viewFunctions,
  createVariant({ themeKey: 'viewVariants' }),
]);

const gradientPlaceholder = { colors: ['#00000000', '#00000000'] };

const AppView = forwardRef<View, AppViewProps>(
  ({ gradientVariant, useGradientBackend, ...rest }, ref) => {
    const { gradientVariants } = useTheme<Theme>();
    const styledProps = useRestyle(appViewFunctions, rest) as ViewProps;
    const gradientVariantKey = useResponsiveProp<
      Theme,
      keyof Theme['gradientVariants'] | undefined
    >(gradientVariant);

    return (
      <>
        {gradientVariantKey || useGradientBackend ?
          <LinearGradient
            {...(gradientVariantKey ? gradientVariants[gradientVariantKey] : gradientPlaceholder)}
            {...styledProps}
          />
        : <View ref={ref} {...styledProps} />}
      </>
    );
  },
);

export const AppAnimatedView = createRestyleComponent<
  AnimatedProps<ViewProps> & ViewRestyleProps & VariantProps<Theme, 'viewVariants'>,
  Theme
>([...viewFunctions, createVariant({ themeKey: 'viewVariants' })], Animated.View);

export const AppMotiView = createRestyleComponent<
  React.ComponentProps<typeof MotiView> & ViewRestyleProps & VariantProps<Theme, 'viewVariants'>,
  Theme
>([...viewFunctions, createVariant({ themeKey: 'viewVariants' })], MotiView);

export default AppView;
