import { useNavigation } from '@react-navigation/native';
import { Component, RefObject, useCallback, useContext, useEffect, useState } from 'react';
import { NativeMethods } from 'react-native';
import { AppScreenContext } from './AppScreen';

const SCROLL_VIEW_START_Y = 0;

export const useScrollPresenceEffect = (
  effect: () => void,
  compRef: RefObject<Pick<NativeMethods, 'measureLayout'>>,
  config?: { presencePercentage?: number },
) => {
  const screenContext = useContext(AppScreenContext);
  if (!screenContext)
    console.warn(`'${useScrollPresenceEffect.name}' is used outside of 'AppScreen'`);

  const [scrollViewHeight, setScrollViewHeight] = useState<number>();
  const [compOffset, setCompOffset] = useState<number>();
  const [compHeight, setCompHeight] = useState<number>();

  const measureLayout = useCallback(() => {
    requestAnimationFrame(() => {
      if (screenContext?.scrollViewRef) {
        const scrollViewRef = screenContext.scrollViewRef as unknown as Component &
          Readonly<NativeMethods>; // still works, so...

        scrollViewRef.measure((_x, _y, _width, height) => {
          setScrollViewHeight(height);
        });

        compRef.current?.measureLayout(scrollViewRef, (_left, top, _width, height) => {
          setCompOffset(top);
          setCompHeight(height);
        });
      }
    });
  }, [compRef, screenContext?.scrollViewRef]);

  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.isFocused()) {
      measureLayout();
    }

    return navigation.addListener('focus', measureLayout);
  }, [measureLayout, navigation]);

  useEffect(() => {
    const bottomPadding = screenContext?.bottomPadding;
    if (compOffset !== undefined && compHeight !== undefined && bottomPadding !== undefined) {
      if (
        scrollViewHeight !== undefined &&
        SCROLL_VIEW_START_Y >=
          compOffset -
            scrollViewHeight +
            bottomPadding +
            compHeight * (config?.presencePercentage ?? 1)
      ) {
        effect();
        return;
      }

      const eventId = screenContext?.onScrollManager.registerOnScrollCallback(event => {
        if (
          event.nativeEvent.contentOffset.y >=
          compOffset -
            event.nativeEvent.layoutMeasurement.height +
            bottomPadding +
            compHeight * (config?.presencePercentage ?? 1)
        ) {
          effect();
          if (eventId !== undefined)
            screenContext.onScrollManager.unregisterOnScrollCallback(eventId);
        }
      });

      return () => {
        if (eventId !== undefined)
          screenContext?.onScrollManager.unregisterOnScrollCallback(eventId);
      };
    }
  }, [
    compHeight,
    compOffset,
    config?.presencePercentage,
    effect,
    screenContext?.bottomPadding,
    screenContext?.onScrollManager,
    scrollViewHeight,
  ]);
};
