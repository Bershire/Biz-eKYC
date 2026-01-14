import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import React, { useEffect } from 'react';
import { useDelta } from 'react-delta';
import { PixelRatio } from 'react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppView, { AppAnimatedView } from '../AppView/AppView';
import Icon from '../Icon/Icon';
import { useRealDimensions } from '../RealDimensions/RealDimensions';
import AppTabBarItem from './components/AppTabBarItem/AppTabBarItem';

export type AppTabBarProps = MaterialTopTabBarProps & {
  subscribeSwipeStartEvent: (callback: () => void) => void;
};

export const TAB_BAR_HEIGHT = 48 * Math.max(PixelRatio.getFontScale(), 1);
const FOCUS_CIRCLE_SIZE = 45;
const FOCUS_CIRCLE_SHADOW_SIZE = 56;
const BUMP_WIDTH = 65;
export const TAB_BAR_BUMP_HEIGHT = 16;

const AppTabBar: React.FC<AppTabBarProps> = ({
  state,
  descriptors,
  navigation,
  positionReanimated,
  subscribeSwipeStartEvent,
}) => {
  const { width } = useRealDimensions();
  const { bottom, left, right } = useSafeAreaInsets();
  const realTabBarHeight = TAB_BAR_HEIGHT + bottom;
  const tabWidth = width - left - right;
  const tabItemWidth = tabWidth / state.routes.length;

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: (tabItemWidth - BUMP_WIDTH) / 2 + tabItemWidth * positionReanimated.value,
      },
    ],
  }));

  const navigateWithSwipe = useSharedValue(true);
  useEffect(() => {
    subscribeSwipeStartEvent(() => {
      navigateWithSwipe.value = true;
    });
  }, [navigateWithSwipe, subscribeSwipeStartEvent]);

  const indexDelta = useDelta(state.index);

  return (
    <>
      <AppAnimatedView
        variant='lShadow'
        position='absolute'
        bottom={realTabBarHeight + TAB_BAR_BUMP_HEIGHT - FOCUS_CIRCLE_SHADOW_SIZE - 1}
        left={left + (BUMP_WIDTH - FOCUS_CIRCLE_SHADOW_SIZE) / 2}
        width={FOCUS_CIRCLE_SHADOW_SIZE}
        aspectRatio={1}
        borderRadius='round'
        backgroundColor='background'
        style={translateStyle}
      />
      <AppView
        position='absolute'
        bottom={0}
        height={realTabBarHeight}
        width='100%'
        variant='lShadow'
        backgroundColor='background'
        flexDirection='row'
        justifyContent='space-evenly'
        borderTopLeftRadius='sm'
        borderTopRightRadius='sm'
        style={{ paddingLeft: left, paddingRight: right, paddingBottom: bottom }}
      >
        <AppAnimatedView position='absolute' style={translateStyle}>
          <Icon type='tabBarBump' top={-TAB_BAR_BUMP_HEIGHT} left={left} />
          <AppView
            variant='sShadow'
            width={FOCUS_CIRCLE_SIZE}
            aspectRatio={1}
            backgroundColor='primary'
            borderRadius='round'
            position='absolute'
            top={-TAB_BAR_BUMP_HEIGHT + 8}
            left={left + (BUMP_WIDTH - FOCUS_CIRCLE_SIZE) / 2}
          />
        </AppAnimatedView>
        {state.routes.map((route, index) => (
          <AppTabBarItem
            key={route.key}
            navigation={navigation}
            currentIndex={state.index}
            lastIndex={indexDelta?.prev ?? 0}
            index={index}
            position={positionReanimated}
            options={descriptors[route.key]?.options}
            route={route}
            routeNum={state.routes.length}
            onNavigate={() => {
              navigateWithSwipe.value = false;
            }}
            navigateWithSwipe={navigateWithSwipe}
          />
        ))}
      </AppView>
    </>
  );
};

export default AppTabBar;
