/* eslint-disable max-lines */
import { Portal } from '@gorhom/portal';
import { AnimatePresence, useDynamicAnimation } from 'moti';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { Gesture, GestureDetector, GestureType } from 'react-native-gesture-handler';
import { KeyboardController } from 'react-native-keyboard-controller';
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';
import AppSystemNavigationBar, {
  AppSystemNavigationBarProps,
} from 'src/components/AppSystemNavigationBar/AppSystemNavigationBar';
import AppView, { AppMotiView, AppViewProps } from 'src/components/AppView/AppView';
import { useRealDimensions } from 'src/components/RealDimensions/RealDimensions';
import { store } from 'src/store/store';
import { COMMON_STYLES } from 'src/theme/styles';
import { useBackPressEffect } from 'src/utils/useBackPressEffect';
import { useEventEmitter } from 'src/utils/useEventEmitter';
import { useTrackModalOpenState } from './utils/useTrackModalOpenState';

export const CUSTOM_MODAL_PORTAL_HOST = 'CustomModalHost';

export type AppModalContext = {
  gesture: GestureType;
  changeNavigationBarTransparent: (transparent: boolean) => void;
  listenToModalWillHide: (callback: () => void) => () => void;
};
export const AppModalContext = createContext<AppModalContext | undefined>(undefined);

export type AppModalProps = {
  isVisible?: boolean;
  onModalShow?: () => void;
  onModalHide?: () => void;
  onModalWillShow?: () => void;
  onModalWillHide?: () => void;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  onRequestClose?: () => void;
  onSwipeStart?: () => void;
  onSwipeComplete?: () => void;
  animationTiming?: number;
  dismissSwipeDistanceThreshold?: number;
  dismissSwipeVelocityThreshold?: number;
  cancelSwipeVelocityThreshold?: number;
  backdropCancelDistance?: number;
  disableGesture?: boolean;
  embedded?: boolean;
  statusBarProps?: StatusBarProps;
  navigationBarProps?: AppSystemNavigationBarProps;
  backdropProps?: AppViewProps;
} & PropsWithChildren &
  AppViewProps;

// eslint-disable-next-line max-lines-per-function
const AppModal: React.FC<AppModalProps> = ({
  children,
  isVisible,
  onModalShow,
  onModalHide,
  onModalWillShow,
  onModalWillHide,
  onBackdropPress,
  onBackButtonPress,
  onRequestClose,
  onSwipeStart,
  onSwipeComplete,
  animationTiming: animationDuration = 300,
  dismissSwipeDistanceThreshold = 100,
  dismissSwipeVelocityThreshold = 1500,
  cancelSwipeVelocityThreshold = -800,
  backdropCancelDistance = 50,
  disableGesture,
  embedded,
  statusBarProps,
  navigationBarProps,
  backdropProps,
  ...rest
}) => {
  const { height } = useRealDimensions();
  const backdropTouchPos = useRef<{ x: number; y: number }>();
  const [isModalFullyShown, setIsModalFullyShown] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [navigationBarTransparent, setNavigationBarTransparent] = useState(false);

  const modalIdRef = useTrackModalOpenState(isVisible || isModalFullyShown);
  useBackPressEffect(
    useCallback(() => {
      const openModalOrder = store.getState().ui.openModalOrder;
      const isHighestModal = openModalOrder.at(-1) === modalIdRef.current;
      if ((onBackButtonPress || onRequestClose) && isVisible && isHighestModal) {
        onBackButtonPress?.();
        onRequestClose?.();
        return true;
      }
      return false;
    }, [isVisible, onBackButtonPress, onRequestClose, modalIdRef]),
  );

  const animationTiming = useMemo(
    () => ({
      type: 'timing' as const,
      easing: Easing.out(Easing.ease),
      duration: animationDuration,
    }),
    [animationDuration],
  );
  const animationNonGestureCloseTiming = useMemo(
    () => ({ ...animationTiming, easing: Easing.in(Easing.ease) }),
    [animationTiming],
  );

  const isEverVisible = useRef(isVisible);
  const exiting = useSharedValue(false);
  const swipeExit = useSharedValue(false);
  const modalMoved = useSharedValue(false);
  const containerState = useDynamicAnimation();
  const backdropState = useDynamicAnimation();
  useEffect(() => {
    if (isVisible) {
      containerState.animateTo({ translateY: 0, transition: animationTiming });
      backdropState.animateTo({ opacity: 1, transition: animationTiming });
      exiting.value = false;
      swipeExit.value = false;
      isEverVisible.current = true;
    }
  }, [isVisible, containerState, animationTiming, backdropState, exiting, swipeExit]);

  const hideBySwipe = useRef<boolean>();
  const onModalWillShowRef = useRef(onModalWillShow);
  onModalWillShowRef.current = onModalWillShow;
  const onModalWillHideRef = useRef(onModalWillHide);
  onModalWillHideRef.current = onModalWillHide;
  const [listenToModalWillHide, triggerModalWillHideEvent] = useEventEmitter();
  const handleBeforeClose = useCallback(() => {
    KeyboardController.dismiss();
    onModalWillHideRef.current?.();
    setIsModalClosing(true);
    triggerModalWillHideEvent();
  }, [triggerModalWillHideEvent]);
  useEffect(() => {
    if (isVisible) {
      hideBySwipe.current = false;
      onModalWillShowRef.current?.();
    } else if (isEverVisible.current && !hideBySwipe.current) {
      handleBeforeClose();
    }
  }, [isVisible, handleBeforeClose]);
  const handleStartSwipeClose = () => {
    hideBySwipe.current = true;
    onSwipeStart?.();
    handleBeforeClose();
  };

  const gesture = Gesture.Pan()
    .enabled(!disableGesture)
    .onChange(event => {
      containerState.animateTo({
        translateY: Math.max(event.translationY, 0),
        transition: { type: 'no-animation' },
      });
      backdropState.animateTo({
        opacity: interpolate(event.translationY, [0, height], [1, 0], Extrapolation.CLAMP),
        transition: { type: 'no-animation' },
      });

      if (!modalMoved.value && event.translationY > 0) modalMoved.value = true;
    })
    .onEnd(event => {
      const cancelledBySwipe = event.velocityY <= cancelSwipeVelocityThreshold;
      const cancelled =
        (event.translationY <= dismissSwipeDistanceThreshold &&
          event.velocityY <= dismissSwipeVelocityThreshold) ||
        cancelledBySwipe;

      if (cancelled) {
        const transition = {
          type: 'spring' as const,
          mass: 1,
          damping: 12,
          stiffness: 100,
        };

        containerState.animateTo({
          translateY: 0,
          transition: {
            ...transition,
            velocity: !cancelledBySwipe || !modalMoved.value ? 0 : event.velocityY / 5, // arbitrary number
          },
        });
        backdropState.animateTo({ opacity: 1, transition });
      } else {
        const transition = {
          ...animationTiming,
          duration: Math.min(Math.max((height / Math.max(event.velocityY, 0)) * 1000, 300), 500),
        };

        containerState.animateTo({ translateY: height, transition });
        backdropState.animateTo({ opacity: 0, transition });
        exiting.value = true;
        swipeExit.value = true;
        runOnJS(handleStartSwipeClose)();
      }

      modalMoved.value = false;
    });

  const getExitTransition = () => {
    'worklet';

    // If user swipes to close, finishes the exit animation almost immediately,
    // with a very small delay to prevent backdrop flickering
    return swipeExit.value ?
        { type: 'timing' as const, duration: 10 }
      : animationNonGestureCloseTiming;
  };

  const body = (
    <>
      <AnimatePresence
        onExitComplete={() => {
          onModalHide?.();
          setIsModalClosing(false);
        }}
      >
        {isVisible && (
          <AppView pointerEvents='box-none' {...rest} {...COMMON_STYLES.absoluteFill}>
            <AppMotiView
              style={COMMON_STYLES.absoluteFill}
              onTouchStart={event => {
                backdropTouchPos.current = {
                  x: event.nativeEvent.pageX,
                  y: event.nativeEvent.pageY,
                };
              }}
              onTouchEnd={event => {
                if (
                  !isModalFullyShown ||
                  (backdropTouchPos.current &&
                    Math.hypot(
                      event.nativeEvent.pageX - backdropTouchPos.current.x,
                      event.nativeEvent.pageY - backdropTouchPos.current.y,
                    ) >= backdropCancelDistance)
                ) {
                  return;
                }
                onBackdropPress?.();
                onRequestClose?.();
              }}
              backgroundColor='backdrop'
              state={backdropState}
              from={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              exitTransition={getExitTransition}
              onDidAnimate={(styleProp, finished, _value, event) => {
                if (styleProp !== 'opacity') return;
                if (finished && event.attemptedValue === 1) {
                  onModalShow?.();
                  setIsModalFullyShown(true);
                } else {
                  setIsModalFullyShown(false);
                }
              }}
              {...backdropProps}
            />
            <GestureDetector gesture={gesture}>
              <AppMotiView
                pointerEvents='box-none'
                state={containerState}
                from={{ translateY: height }}
                exit={{ translateY: height }}
                exitTransition={getExitTransition}
                onDidAnimate={() => {
                  if (exiting.value) {
                    onSwipeComplete?.();
                    onRequestClose?.();
                    exiting.value = false;
                  }
                }}
              >
                <AppModalContext.Provider
                  value={{
                    gesture,
                    changeNavigationBarTransparent: setNavigationBarTransparent,
                    listenToModalWillHide,
                  }}
                >
                  {children}
                </AppModalContext.Provider>
              </AppMotiView>
            </GestureDetector>
          </AppView>
        )}
      </AnimatePresence>
      {isVisible && !isModalClosing && (
        <>
          {!!statusBarProps && <StatusBar {...statusBarProps} />}
          <AppSystemNavigationBar transparent={navigationBarTransparent} {...navigationBarProps} />
        </>
      )}
    </>
  );
  return embedded ? body : <Portal hostName={CUSTOM_MODAL_PORTAL_HOST}>{body}</Portal>;
};

export default AppModal;
