import { VariantProps, createRestyleComponent, createVariant } from '@shopify/restyle';
import React, { forwardRef, useRef } from 'react';
import { GestureResponderEvent, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ViewRestyleProps, viewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';
import { useThrottle } from 'src/utils/useThrottle';

export interface AppTouchableOpacityProps
  extends TouchableOpacityProps,
    ViewRestyleProps,
    VariantProps<Theme, 'viewVariants'> {
  /**
   * The interval between each press event that allowed to run in milliseconds.
   *
   * @default 500
   */
  throttleRate?: number;
}

const RestyleTouchableOpacity = createRestyleComponent<AppTouchableOpacityProps, Theme>(
  [...viewFunctions, createVariant({ themeKey: 'viewVariants' })],
  TouchableOpacity,
);

/**
 * This component works just like the original TouchableOpacity but with some fixing and presets.
 */
const AppTouchableOpacity = forwardRef<TouchableOpacity, AppTouchableOpacityProps>(
  (
    { onPress, onPressIn, onPressOut, throttleRate = 300, activeOpacity, disabled, ...rest },
    ref,
  ) => {
    // TODO: disable opacity effect when being throttled
    const pressThrottle = useThrottle(throttleRate);
    const pressInThrottle = useThrottle(throttleRate);
    const pressOutThrottle = useThrottle(throttleRate);

    const touchActivatePositionRef = useRef(null) as unknown as {
      current: { pageX: number; pageY: number };
    };

    // handlePress and handlePressIn fix this issue: https://github.com/callstack/react-native-pager-view/issues/424
    function handlePress(e: GestureResponderEvent) {
      const { pageX, pageY } = e.nativeEvent;
      const absX =
        touchActivatePositionRef.current.pageX ?
          Math.abs(touchActivatePositionRef.current.pageX - pageX)
        : 0;
      const absY =
        touchActivatePositionRef.current.pageY ?
          Math.abs(touchActivatePositionRef.current.pageY - pageY)
        : 0;

      const dragged = absX > 20 || absY > 20;
      if (!dragged && onPress) {
        pressThrottle(() => onPress(e));
      }
    }

    function handlePressIn(e: GestureResponderEvent) {
      const { pageX, pageY } = e.nativeEvent;

      touchActivatePositionRef.current = {
        pageX,
        pageY,
      };

      if (onPressIn) pressInThrottle(() => onPressIn(e));
    }

    function handlePressOut(e: GestureResponderEvent) {
      if (onPressOut) pressOutThrottle(() => onPressOut(e));
    }

    return (
      <RestyleTouchableOpacity
        ref={ref}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={disabled ? 1 : activeOpacity ?? 0.8}
        disabled={disabled}
        {...rest}
      />
    );
  },
);

export default AppTouchableOpacity;
