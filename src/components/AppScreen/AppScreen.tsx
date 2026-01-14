import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { VariantProps, composeRestyleFunctions, createVariant, useRestyle } from '@shopify/restyle';
import React, {
  Children,
  PropsWithChildren,
  ReactNode,
  createContext,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FlatList, Keyboard, ScrollView, ScrollViewProps, View } from 'react-native';
import { FlatList as GestureFlatList } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabView } from 'react-native-tab-view';
import { Maybe } from 'src/@types/safety';
import { ICONS } from 'src/assets/icons';
import { IMAGES } from 'src/assets/images';
import { IS_IOS } from 'src/constants/device';
import { selectIsAnyModalOpen } from 'src/store/ui';
import {
  ViewRestyleProps,
  composedViewFunctions,
  useRestyleStyle,
  viewFunctions,
} from 'src/theme/restyle';
import { COMMON_STYLES } from 'src/theme/styles';
import { Theme } from 'src/theme/theme';
import { useAppSelector } from 'src/utils/useAppStore';
import { useBackPressEffect } from 'src/utils/useBackPressEffect';
import { useNonModalKeyboardAnimation } from 'src/utils/useNonModalKeyboardAnimation';
import AppButton from '../AppButton/AppButton';
import AppFlatList from '../AppFlatlist/AppFlatlist';
import { AppImageBackground } from '../AppImage/AppImage';
import AppList from '../AppList/AppList';
import AppRefreshControl from '../AppRefreshControl/AppRefreshControl';
import AppSystemNavigationBar, {
  AppSystemNavigationBarProps,
} from '../AppSystemNavigationBar/AppSystemNavigationBar';
import { useAppTabBarHeight } from '../AppTabBar/useAppTabBarHeight';
import AppTabView from '../AppTabView/AppTabView';
import AppView, { AppAnimatedView, AppViewProps } from '../AppView/AppView';
import Header, { HeaderProps } from '../Header/Header';
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay';
import SeeMoreView from '../SeeMoreView/SeeMoreView';
import { includeChild } from './utils/includeChild';
import { RefreshingManager, useManageRefreshing } from './utils/useManageRefreshing';
import { OnScrollManager, useManageScrollViewOnScroll } from './utils/useManageScrollViewOnScroll';

type ScreenStyleProps = ViewRestyleProps & VariantProps<Theme, 'screenVariants'>;
const screenFunctions = composeRestyleFunctions<Theme, ScreenStyleProps>([
  ...viewFunctions,
  createVariant({ themeKey: 'screenVariants' }),
]);

const BLANK_IMAGE_SOURCE = {
  uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
};

export interface AppScreenProps extends PropsWithChildren, ScreenStyleProps {
  header?: HeaderProps;
  backgroundVariant?: 'image' | 'color';
  actionButton?: {
    icon: keyof typeof ICONS;
    onPress?: () => void;
  };
  stickyBottomComponent?: ReactNode;
  stickyBottomStyle?: AppViewProps;
  scrollViewStyle?: ViewRestyleProps;
  scrollViewProps?: Omit<
    ScrollViewProps,
    'style' | 'contentContainerStyle' | 'refreshControl' | 'onScroll'
  >;
  refreshControl?: {
    refreshing: boolean;
    onRefresh?: () => void;
  };
  enableKeyboardAvoiding?: boolean;
  enableScroll?: boolean;
  bottomPaddingStyle?: ViewRestyleProps;
  BackgroundComponent?: React.ReactElement;
  systemNavigationBar?: AppSystemNavigationBarProps;
  isLoading?: boolean;
}

export interface AppScreenContextValue {
  refreshingManager: RefreshingManager;
  setShowOverlayLoading: (show: boolean) => void;
  onScrollManager: OnScrollManager;
  scrollViewRef: Maybe<ScrollView>;
  bottomPadding: number;
}
export const AppScreenContext = createContext<AppScreenContextValue | undefined>(undefined);

const AppScreen: React.FC<AppScreenProps> = ({
  header,
  backgroundVariant = 'image',
  actionButton,
  stickyBottomComponent,
  stickyBottomStyle,
  scrollViewStyle,
  scrollViewProps,
  refreshControl,
  enableKeyboardAvoiding = true,
  enableScroll: externalEnableScroll,
  bottomPaddingStyle,
  BackgroundComponent,
  systemNavigationBar,
  isLoading,
  children,
  ...rest
}) => {
  const styledProps = useRestyle(screenFunctions, rest);
  const rawScrollViewStyle = useRestyleStyle(composedViewFunctions, scrollViewStyle);

  const { bottom } = useSafeAreaInsets();
  const tabBarHeight = useAppTabBarHeight();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const navigatorType = navigation.getState()?.type;
  const isModalOpen = useAppSelector(selectIsAnyModalOpen);

  const enableScroll = useMemo(() => {
    if (externalEnableScroll !== undefined) return externalEnableScroll;

    let res = true;
    Children.forEach(children, child => {
      if (
        isValidElement(child) &&
        typeof child.type !== 'string' &&
        includeChild(child, [
          FlatList,
          GestureFlatList,
          FlashList.name,
          AppList,
          AppFlatList,
          TabView,
          AppTabView,
          SeeMoreView,
        ])
      ) {
        res = false;
      }
    });

    return res;
  }, [children, externalEnableScroll]);
  const paddingBottom =
    enableScroll && navigatorType === 'tab' ? tabBarHeight
    : !enableScroll && !stickyBottomComponent ? 0
    : bottom;

  const { progress: keyboardProgress } = useNonModalKeyboardAnimation();
  const animatedBottomPaddingStyle = useAnimatedStyle(() => ({
    height: (1 - keyboardProgress.value) * paddingBottom,
  }));

  const systemNavigationBarTransparent =
    navigatorType === 'tab' || (!!stickyBottomComponent && !!bottomPaddingStyle?.backgroundColor);

  useBackPressEffect(useCallback(() => Keyboard.isVisible(), []));

  const [{ isRefreshing, enableRefreshing, handleRefresh }, refreshingManager] =
    useManageRefreshing(refreshControl);
  const [handleScroll, onScrollManager] = useManageScrollViewOnScroll();

  const [showOverlayLoading, setShowOverlayLoading] = useState(false);
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>();

  return (
    <AppScreenContext.Provider
      value={useMemo(
        () => ({
          refreshingManager,
          setShowOverlayLoading,
          scrollViewRef,
          onScrollManager,
          bottomPadding: paddingBottom,
        }),
        [onScrollManager, paddingBottom, refreshingManager, scrollViewRef],
      )}
    >
      <AppImageBackground
        flex={1}
        source={backgroundVariant === 'image' ? IMAGES.bg : BLANK_IMAGE_SOURCE}
        backgroundColor='background'
      >
        {!!BackgroundComponent && (
          <AppView style={COMMON_STYLES.absoluteFill}>{BackgroundComponent}</AppView>
        )}
        <KeyboardAvoidingView
          style={COMMON_STYLES.fill}
          behavior='padding'
          enabled={isFocused && enableKeyboardAvoiding && !isModalOpen}
        >
          <SafeAreaView style={COMMON_STYLES.fill} edges={['left', 'right']}>
            <Header visible={!!header} {...header} />

            <View style={[COMMON_STYLES.fill, { overflow: 'hidden' }]}>
              {enableScroll ?
                <ScrollView
                  ref={setScrollViewRef}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps='handled'
                  {...styledProps}
                  {...scrollViewProps}
                  onScroll={handleScroll}
                  scrollEventThrottle={scrollViewProps?.scrollEventThrottle ?? IS_IOS ? 16 : 0}
                  contentContainerStyle={[{ flexGrow: 1 }, rawScrollViewStyle]}
                  refreshControl={
                    <AppRefreshControl
                      enabled={enableRefreshing || !!refreshControl}
                      refreshing={
                        !(isLoading || showOverlayLoading) &&
                        (refreshControl?.refreshing || isRefreshing)
                      }
                      onRefresh={handleRefresh}
                    />
                  }
                >
                  {children}
                  <AppAnimatedView
                    {...bottomPaddingStyle}
                    width='100%'
                    position='relative'
                    style={!stickyBottomComponent && animatedBottomPaddingStyle}
                  >
                    {/* iOS overscroll background padding */}
                    {IS_IOS && !!bottomPaddingStyle?.backgroundColor && (
                      <AppView
                        position='absolute'
                        top={0}
                        left={0}
                        width='100%'
                        height={1000} // abitrary height
                        backgroundColor={bottomPaddingStyle.backgroundColor}
                      />
                    )}
                  </AppAnimatedView>
                </ScrollView>
              : <View
                  {...styledProps}
                  style={[COMMON_STYLES.fill, styledProps.style, rawScrollViewStyle]}
                >
                  {children}
                  <AppAnimatedView
                    {...bottomPaddingStyle}
                    width='100%'
                    style={!stickyBottomComponent && animatedBottomPaddingStyle}
                  />
                </View>
              }
            </View>

            {!!stickyBottomComponent && (
              <>
                <AppView {...stickyBottomStyle}>{stickyBottomComponent}</AppView>
                <AppAnimatedView
                  {...bottomPaddingStyle}
                  width='100%'
                  style={animatedBottomPaddingStyle}
                />
              </>
            )}
            {!!actionButton && (
              <AppButton
                icon={actionButton.icon}
                type='primary'
                position='absolute'
                right={0}
                bottom={paddingBottom}
                marginBottom='xl'
                marginRight='xl'
                onPress={actionButton.onPress}
              />
            )}
            <LoadingOverlay visible={isLoading || showOverlayLoading} />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </AppImageBackground>

      <AppSystemNavigationBar
        transparent={systemNavigationBarTransparent}
        {...systemNavigationBar}
      />
    </AppScreenContext.Provider>
  );
};

export default AppScreen;
