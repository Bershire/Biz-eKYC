import React, { PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { KeyboardController } from 'react-native-keyboard-controller';
import {
  clamp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText, { AppAnimatedText } from 'src/components/AppText/AppText';
import AppView, { AppAnimatedView } from 'src/components/AppView/AppView';
import Icon from 'src/components/Icon/Icon';
import { useRealDimensions } from 'src/components/RealDimensions/RealDimensions';
import { useNonModalKeyboardAnimation } from 'src/utils/useNonModalKeyboardAnimation';

export interface SeeMoreViewProps extends PropsWithChildren {
  bottomContent: ReactElement<unknown>;
  noSafeBottom?: boolean;
  additionalHeight?: boolean;
}

const DRAG_THRESHOLD = 0.2;
const ANIMATION_CONFIG = {
  damping: 60,
  stiffness: 300,
  restDisplacementThreshold: 0.000_001,
  restSpeedThreshold: 0.0002,
};

const SeeMoreView: React.FC<SeeMoreViewProps> = ({
  children,
  bottomContent,
  noSafeBottom,
  additionalHeight,
}) => {
  const { t } = useTranslation('common');
  const { height } = useRealDimensions();
  const { bottom } = useSafeAreaInsets();
  const safeBottom = noSafeBottom ? 0 : bottom;
  const { height: keyboardHeight, progress: keyboardProgress } = useNonModalKeyboardAnimation();

  const isPressed = useSharedValue(false);

  const doSeeMore = useSharedValue(false);
  const offsetYProgress = useSharedValue(0);
  //TODO: find alternative to adjust additionalHeight instead of fixing it
  const bodyHeight = useDerivedValue(() =>
    additionalHeight ?
      (height + keyboardHeight.value) * 0.58
    : (height + keyboardHeight.value) * 0.5,
  );
  const offsetY = useDerivedValue(() => offsetYProgress.value * bodyHeight.value);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));
  const bodyContentStyle = useAnimatedStyle(() => ({
    height: bodyHeight.value,
  }));
  const paddingStyle = useAnimatedStyle(() => ({
    height:
      bodyHeight.value -
      offsetY.value +
      interpolate(offsetY.value, [0, bodyHeight.value], [0, 1]) *
        interpolate(keyboardProgress.value, [0, 1], [safeBottom, 0]),
  }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(offsetY.value, [0, bodyHeight.value], [0, 180])}deg` }],
  }));
  const moreTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offsetY.value, [0, bodyHeight.value / 2], [1, 0], 'clamp'),
    transform: [{ translateY: interpolate(offsetY.value, [0, bodyHeight.value], [0, 10]) }],
  }));
  const lessTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offsetY.value, [bodyHeight.value / 2, bodyHeight.value], [0, 1], 'clamp'),
    transform: [{ translateY: interpolate(offsetY.value, [0, bodyHeight.value], [-10, 0]) }],
  }));
  const handleStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isPressed.value ? 0.7 : 1, { duration: 100 }),
  }));

  const dismissKeyboard = () => KeyboardController.dismiss();

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offsetYProgress.value =
        (doSeeMore.value ?
          bodyHeight.value - clamp(-e.translationY, 0, bodyHeight.value)
        : clamp(e.translationY, 0, bodyHeight.value)) / bodyHeight.value;
    })
    .onEnd(e => {
      doSeeMore.value =
        Math.abs(e.velocityY) >= 1500 ?
          e.velocityY > 0
        : offsetYProgress.value >= (doSeeMore.value ? 1 - DRAG_THRESHOLD : DRAG_THRESHOLD);

      if (doSeeMore.value) {
        runOnJS(dismissKeyboard)();
      }

      offsetYProgress.value = withSpring(doSeeMore.value ? 1 : 0, {
        ...ANIMATION_CONFIG,
        duration: Math.min(700, 1_000_000 / Math.abs(e.velocityY)),
        damping: undefined,
        dampingRatio: 1,
        overshootClamping: true,
      });
    })
    .onFinalize(() => {
      isPressed.value = false;
    });
  const tapGesture = Gesture.Tap().onStart(() => {
    runOnJS(dismissKeyboard)();

    doSeeMore.value = !doSeeMore.value;
    offsetYProgress.value = withSpring(doSeeMore.value ? 1 : 0, ANIMATION_CONFIG);
  });
  const gesture = Gesture.Race(panGesture, tapGesture);

  return (
    <>
      {children}

      {/* Handle Padding */}
      <AppView opacity={0}>
        <AppText variant='homeText12w700' color='primary' marginTop='3xs' paddingTop='sm'>
          {t('seeMore')}
        </AppText>
        <Icon type='dowVec' marginTop='2xs' />
      </AppView>

      <AppAnimatedView style={paddingStyle} />

      <AppAnimatedView position='absolute' width='100%' bottom={0} style={bodyStyle}>
        <GestureDetector gesture={gesture}>
          <AppAnimatedView alignItems='center' paddingBottom='sm' style={handleStyle}>
            <AppAnimatedText
              variant='homeText12w700'
              color='primary'
              style={moreTextStyle}
              marginTop='3xs'
            >
              {t('seeMore')}
            </AppAnimatedText>
            <AppAnimatedText
              variant='homeText12w700'
              color='primary'
              marginTop='3xs'
              position='absolute'
              style={lessTextStyle}
            >
              {t('close')}
            </AppAnimatedText>

            <AppAnimatedView style={chevronStyle} marginTop='2xs'>
              <Icon type='dowVec' />
            </AppAnimatedView>
          </AppAnimatedView>
        </GestureDetector>

        <AppAnimatedView style={bodyContentStyle}>{bottomContent}</AppAnimatedView>
      </AppAnimatedView>
    </>
  );
};

export default SeeMoreView;
