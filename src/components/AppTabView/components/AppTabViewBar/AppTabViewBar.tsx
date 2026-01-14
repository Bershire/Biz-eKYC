import MaskedView from '@react-native-masked-view/masked-view';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef, useState } from 'react';
import { LayoutRectangle, NativeScrollEvent, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { NavigationState, Route, SceneRendererProps } from 'react-native-tab-view';
import AppView, { AppAnimatedView } from 'src/components/AppView/AppView';
import { Theme } from 'src/theme/theme';
import AppTabViewBarItem from '../AppTabViewBarItem/AppTabViewBarItem';

const ActiveIndicator: React.FC<{
  color: keyof Theme['colors'];
  animatedStyle: StyleProp<ViewStyle>;
}> = ({ color, animatedStyle }) => {
  return (
    <AppView position='absolute' height='100%' marginLeft='3xs' paddingVertical='3xs'>
      <AppAnimatedView
        height='100%'
        backgroundColor={color}
        borderRadius='round'
        style={animatedStyle}
      />
    </AppView>
  );
};

export type AppTabViewBarProps = SceneRendererProps & {
  navigationState: NavigationState<Route>;
};

const AppTabViewBar: React.FC<AppTabViewBarProps> = ({
  jumpTo,
  positionReanimated,
  navigationState,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useTheme<Theme>();
  const scrollSpacing = theme.spacing.md;

  const [labelLayouts, setLabelLayouts] = useState<LayoutRectangle[]>(
    Array.from({ length: navigationState.routes.length }, () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    })),
  );
  const inputRange = Array.from({ length: navigationState.routes.length }, (_, i) => i);
  const xOutputRange = labelLayouts.map(layout => layout.x);
  const widthOutputRange = labelLayouts.map(layout => layout.width - 2 * theme.spacing['3xs']);

  const translateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          xOutputRange.length > 1 ?
            interpolate(positionReanimated.value, inputRange, xOutputRange)
          : xOutputRange[0] ?? 0,
      },
    ],
    width:
      widthOutputRange.length > 1 ?
        interpolate(positionReanimated.value, inputRange, widthOutputRange)
      : widthOutputRange[0] ?? 0,
  }));

  const scrollLayoutRef =
    useRef<Pick<NativeScrollEvent, 'contentSize' | 'contentOffset' | 'layoutMeasurement'>>();
  const [layoutAvailable, setLayoutAvailable] = useState(false);
  useEffect(() => {
    const labelLayout = labelLayouts[navigationState.index];
    const scrollLayout = scrollLayoutRef.current;
    if (
      labelLayout &&
      scrollLayout &&
      scrollLayout.contentSize.width !== scrollLayout.layoutMeasurement.width
    ) {
      if (scrollLayout.contentOffset.x > labelLayout.x) {
        scrollViewRef.current?.scrollTo({ x: labelLayout.x, animated: true });
      }
      if (
        scrollLayout.contentOffset.x + scrollLayout.layoutMeasurement.width <
        labelLayout.x + labelLayout.width + scrollSpacing * 2
      ) {
        scrollViewRef.current?.scrollTo({
          x:
            labelLayout.x +
            labelLayout.width +
            scrollSpacing * 2 -
            scrollLayout.layoutMeasurement.width,
        });
      }
    }
  }, [layoutAvailable, labelLayouts, navigationState.index, scrollSpacing]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      style={{ flexGrow: 0 }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: scrollSpacing,
      }}
      showsHorizontalScrollIndicator={false}
      onLayout={e => {
        scrollLayoutRef.current = {
          contentSize: { width: 0, height: 0 },
          contentOffset: { x: 0, y: 0 },
          ...scrollLayoutRef.current,
          layoutMeasurement: e.nativeEvent.layout,
        };
        setLayoutAvailable(true);
      }}
      onContentSizeChange={size => {
        scrollLayoutRef.current = {
          contentOffset: { x: 0, y: 0 },
          layoutMeasurement: { width: 0, height: 0 },
          ...scrollLayoutRef.current,
          contentSize: { width: size, height: 0 },
        };
        setLayoutAvailable(true);
      }}
      onScroll={e => {
        scrollLayoutRef.current = e.nativeEvent;
        setLayoutAvailable(true);
      }}
    >
      <AppView
        variant='sShadow'
        backgroundColor='background'
        borderRadius='round'
        marginVertical='xs'
      >
        <ActiveIndicator color='primary' animatedStyle={translateStyle} />

        <MaskedView
          style={{ width: '100%' }}
          maskElement={
            <AppView flexDirection='row' justifyContent='center'>
              {navigationState.routes.map(route => (
                <AppTabViewBarItem key={route.key} route={route} />
              ))}
            </AppView>
          }
        >
          <AppView backgroundColor='tabViewLabelUnfocused' {...StyleSheet.absoluteFillObject} />
          <ActiveIndicator color='tabViewLabelFocused' animatedStyle={translateStyle} />

          <AppView flexDirection='row' justifyContent='center' opacity={0}>
            {navigationState.routes.map((route, index) => (
              <AppTabViewBarItem
                key={route.key}
                route={route}
                onPress={() => jumpTo(route.key)}
                onLayout={layout =>
                  setLabelLayouts(pre => {
                    const res =
                      pre.length <= index ?
                        [
                          ...pre,
                          ...Array.from({ length: index - pre.length + 1 }, () => ({
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0,
                          })),
                        ]
                      : Array.from(pre);
                    res.splice(index, 0, layout);

                    return res;
                  })
                }
              />
            ))}
          </AppView>
        </MaskedView>
      </AppView>
    </ScrollView>
  );
};

export default AppTabViewBar;
