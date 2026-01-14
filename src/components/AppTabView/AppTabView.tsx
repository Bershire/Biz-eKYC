import React, { useRef } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { Route, TabView, TabViewProps } from 'react-native-tab-view';
import { ICONS } from 'src/assets/icons';
import { OverrideProperties } from 'type-fest';
import { useRealDimensions } from '../RealDimensions/RealDimensions';
import AppTabViewBar from './components/AppTabViewBar/AppTabViewBar';

type AppRoute = OverrideProperties<Route, { icon?: keyof typeof ICONS }>;

export interface AppTabViewProps<T extends AppRoute> extends TabViewProps<T> {
  tabBarWrapper?: (tabBar: React.ReactElement) => React.ReactElement;
  onPositionAnimated?: (positionAnimated: SharedValue<number>) => void;
}

const AppTabView = <T extends AppRoute>({
  tabBarWrapper = identity,
  onPositionAnimated,
  navigationState,
  onIndexChange,
  ...rest
}: AppTabViewProps<T>) => {
  const { width } = useRealDimensions();
  const positionAnimatedRef = useRef<SharedValue<number>>();

  return (
    <TabView
      renderTabBar={props => {
        if (positionAnimatedRef.current !== props.positionReanimated) {
          requestAnimationFrame(() => {
            onPositionAnimated?.(props.positionReanimated);
          });
        }
        positionAnimatedRef.current = props.positionReanimated;

        return tabBarWrapper(<AppTabViewBar {...props} />);
      }}
      lazy
      reanimatedAnimation
      initialLayout={{ width }}
      navigationState={navigationState}
      onIndexChange={index => onIndexChange(index)}
      {...rest}
    />
  );
};

function identity<T>(object: T) {
  return object;
}

export default AppTabView;
