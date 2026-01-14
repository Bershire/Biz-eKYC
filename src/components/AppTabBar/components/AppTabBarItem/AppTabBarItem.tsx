import MaskedView from '@react-native-masked-view/masked-view';
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { NavigationHelpers, NavigationState, ParamListBase } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import React, { memo } from 'react';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';
import AppView, { AppAnimatedView } from 'src/components/AppView/AppView';
import { Theme } from 'src/theme/theme';

interface AppTabBarItemProps {
  navigation: NavigationHelpers<ParamListBase, MaterialTopTabNavigationEventMap>;
  index: number;
  currentIndex: number;
  lastIndex: number;
  position: SharedValue<number>;
  options: MaterialTopTabNavigationOptions | undefined;
  route: NavigationState['routes'][number];
  routeNum: number;
  onNavigate: () => void;
  navigateWithSwipe: SharedValue<boolean>;
}

const AnimatedMaskedView = Animated.createAnimatedComponent(MaskedView);

const AppTabBarItem: React.FC<AppTabBarItemProps> = memo(
  ({
    navigation,
    index,
    currentIndex,
    lastIndex,
    position,
    options,
    route,
    routeNum,
    onNavigate,
    navigateWithSwipe,
  }) => {
    const theme = useTheme<Theme>();
    const isFocused = currentIndex === index;
    const inputRange = Array.from({ length: routeNum }, (_, i) => i);

    function __INLINE__createPositionalAnimatedValue<T>(
      focusVal: T,
      unfocusVal: T,
      interpolateFn: (x: number, ipRange: readonly number[], opRange: readonly T[]) => T,
    ): T {
      if (navigateWithSwipe.value) {
        const outputRange = Array.from({ length: routeNum }, (_, i) =>
          i === index ? focusVal : unfocusVal,
        );

        return outputRange.length > 1 ?
            interpolateFn(position.value, inputRange, outputRange)
          : outputRange[0] ?? unfocusVal;
      }

      return routeNum > 1 && (index === lastIndex || index === currentIndex) ?
          interpolateFn(
            position.value,
            [lastIndex, currentIndex],
            index === lastIndex ? [focusVal, unfocusVal] : [unfocusVal, focusVal],
          )
        : unfocusVal;
    }
    const positionStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: __INLINE__createPositionalAnimatedValue(-8, 0, interpolate) }],
      };
    });

    function __INLINE__createColorAnimatedValue<T>(
      focusVal: T,
      unfocusVal: T,
      interpolateFn: (x: number, ipRange: readonly number[], opRange: readonly T[]) => T,
    ): T {
      const outputRange = Array.from({ length: routeNum }, (_, i) =>
        i === index ? focusVal : unfocusVal,
      );

      return navigateWithSwipe.value || index === lastIndex || index === currentIndex ?
          interpolateFn(position.value, inputRange, outputRange)
        : unfocusVal;
    }
    const colorStyle = useAnimatedStyle(() => ({
      backgroundColor: __INLINE__createColorAnimatedValue<string>(
        theme.colors.tabItemFocused,
        theme.colors.tabItemUnfocused,
        interpolateColor,
      ),
    }));

    if (options) {
      const label =
        options.tabBarLabel === undefined ?
          options.title === undefined ?
            route.name
          : options.title
        : options.tabBarLabel;
      const icon = options.tabBarIcon?.({ focused: false, color: '' }); // unused options
      const badge = options.tabBarBadge?.();

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
          onNavigate();
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      return (
        <AppTouchableOpacity
          flex={1}
          alignItems='center'
          paddingTop='xs'
          onPress={onPress}
          onLongPress={onLongPress}
        >
          <AnimatedMaskedView
            style={[{ flex: 1, flexDirection: 'row' }, positionStyle]}
            maskElement={
              <AppView alignItems='center'>
                {icon}
                <AppText variant='tabTitle'>{`${label}`}</AppText>
              </AppView>
            }
            androidRenderingMode='software'
          >
            <AppAnimatedView flex={1} style={colorStyle} />
          </AnimatedMaskedView>

          <AppAnimatedView style={positionStyle} position='absolute' paddingTop='xs'>
            {badge}
          </AppAnimatedView>
        </AppTouchableOpacity>
      );
    }
  },
);

export default AppTabBarItem;
