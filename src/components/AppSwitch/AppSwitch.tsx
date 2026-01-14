import { useTheme } from '@shopify/restyle';
import React, { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Theme } from 'src/theme/theme';
import AppTouchableOpacity from '../AppTouchableOpacity/AppTouchableOpacity';
import { AppAnimatedView } from '../AppView/AppView';

export interface AppSwitchProps {
  active: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

const SWITCH_WIDTH = 26;
const SWITCH_HEIGHT = 13;
const SWITCH_GAP = 1;

const AppSwitch: React.FC<AppSwitchProps> = ({ active, onChange, disabled }) => {
  const theme = useTheme<Theme>();
  const circleSize = SWITCH_HEIGHT - SWITCH_GAP * 2;

  const switchTranslate = useSharedValue(0);
  const progress = useDerivedValue(() => withTiming(+active));

  useEffect(() => {
    switchTranslate.value = active ? SWITCH_WIDTH - SWITCH_GAP - circleSize : SWITCH_GAP;
  }, [active, circleSize, switchTranslate]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(switchTranslate.value, {
          damping: 20,
          stiffness: 250,
        }),
      },
    ],
  }));

  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.switchInactive, theme.colors.switchActive],
    ),
  }));

  return (
    <AppTouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      onPress={() => onChange?.(!active)}
      hitSlop={10}
      opacity={disabled ? 0.5 : 1}
    >
      <AppAnimatedView
        width={SWITCH_WIDTH}
        height={SWITCH_HEIGHT}
        borderRadius='round'
        justifyContent='center'
        style={backgroundColorStyle}
      >
        <AppAnimatedView
          width={circleSize}
          aspectRatio={1}
          borderRadius='round'
          backgroundColor='background'
          style={circleStyle}
        />
      </AppAnimatedView>
    </AppTouchableOpacity>
  );
};

export default AppSwitch;
