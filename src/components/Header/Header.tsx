import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import React, { ReactNode, memo, useContext, useEffect } from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICONS } from 'src/assets/icons';
import { setHeaderHeight } from 'src/store/ui';
import { COMMON_STYLES } from 'src/theme/styles';
import { Theme } from 'src/theme/theme';
import { useAppDispatch } from 'src/utils/useAppStore';
import { useLayout } from 'src/utils/useLayout';
import AppButton, { AppButtonProps } from '../AppButton/AppButton';
import { drawer } from '../AppDrawer/drawer';
import { AppScreenContext } from '../AppScreen/AppScreen';
import AppText from '../AppText/AppText';
import AppView, { AppAnimatedView } from '../AppView/AppView';
import Icon, { IconProps } from '../Icon/Icon';

type AdditionalButton = AppButtonProps | false;
export interface HeaderProps {
  title?: string | ReactNode;
  visible?: boolean;
  titleWrapper?: (Title: ReactNode) => ReactNode;
  leftButtonType?: 'back' | 'menu' | 'none';
  leftButtonAction?: () => void;
  statusBar?: Pick<StatusBarProps, 'barStyle' | 'hidden'>;
  titleIcon?: keyof typeof ICONS | IconProps;
  additionalButtons?:
    | AdditionalButton
    | [AdditionalButton]
    | ((AppButtonProps & { key: string }) | false)[];
  variant?: 'dark' | 'light' | 'overlap';
  backButtonLabelVisible?: boolean;
  solidOverlapScrollLength?: number;
}

const Header: React.FC<HeaderProps> = ({
  leftButtonType,
  leftButtonAction,
  statusBar,
  title,
  visible = true,
  titleWrapper,
  titleIcon,
  additionalButtons,
  variant = 'dark',
  backButtonLabelVisible,
  solidOverlapScrollLength,
}) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  if (leftButtonType === undefined) {
    const navigatorType = navigation.getState()?.type;
    leftButtonType = navigatorType === 'tab' ? 'menu' : 'back';
  }

  const [{ onLayout: onLayoutLeft }, { width: leftWidth }] = useLayout();
  const [{ onLayout: onLayoutRight }, { width: rightWidth }] = useLayout();

  const titleMargin = Math.max(leftWidth, rightWidth);

  const titleIconProps = typeof titleIcon === 'string' ? { type: titleIcon } : titleIcon;

  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const headerHeightRef = useSharedValue<number | undefined>(undefined);
  useEffect(() => {
    if (!visible) {
      dispatch(setHeaderHeight(top));
      return;
    }

    if (isFocused && headerHeightRef.value !== undefined) {
      dispatch(setHeaderHeight(headerHeightRef.value + top));
    }
  }, [dispatch, visible, isFocused, top, headerHeightRef]);

  const screenContext = useContext(AppScreenContext);
  const scrollOffset = useSharedValue(0);
  const hasSolidOverlap = variant === 'overlap' && solidOverlapScrollLength !== undefined;
  useEffect(() => {
    if (!hasSolidOverlap) {
      return;
    }

    const eventId = screenContext?.onScrollManager.registerOnScrollCallback(event => {
      scrollOffset.value = event.nativeEvent.contentOffset.y;
    });
    return () => {
      if (eventId !== undefined) {
        screenContext?.onScrollManager.unregisterOnScrollCallback(eventId);
      }
    };
  }, [hasSolidOverlap, screenContext?.onScrollManager, scrollOffset]);

  const animatedSolidOverlapButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [
        (solidOverlapScrollLength ?? 0) - (headerHeightRef.value ?? 0),
        solidOverlapScrollLength ?? 0,
      ],
      [0, 1],
      'clamp',
    ),
  }));

  const Middle = (
    <AppView flexDirection='row'>
      {typeof title === 'string' ?
        <AppText
          variant='header'
          color={variant === 'light' ? 'text000' : undefined}
          numberOfLines={2}
        >
          {title}
        </AppText>
      : title}
      {!!titleIconProps && <Icon color='text300' marginLeft='2xs' {...titleIconProps} />}
    </AppView>
  );

  const leftButtonIcon = leftButtonType === 'menu' ? 'menu' : 'chevronLeft';
  const sharedButtonProps = {
    backgroundColor: variant === 'overlap' ? 'headerOverlapButtonBackground' : undefined,
    borderRadius: 'round',
    paddingHorizontal: undefined,
    paddingVertical: undefined,
  } as const;

  return (
    <AppView style={{ paddingTop: top }} width='100%' zIndex='header'>
      <StatusBar
        barStyle={variant === 'light' ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor={theme.colors.statusBarBackground}
        animated
        {...statusBar}
      />
      {visible && (
        <AppView
          position={variant === 'overlap' ? 'absolute' : 'relative'}
          top={variant === 'overlap' ? top : undefined}
          justifyContent='center'
          alignItems='center'
          flexDirection='row'
          paddingVertical='xs'
          paddingHorizontal='md'
          minHeight={60}
          width='100%'
          onLayout={e => {
            headerHeightRef.value = e.nativeEvent.layout.height;
            if (isFocused) {
              dispatch(setHeaderHeight(e.nativeEvent.layout.height + top));
            }
          }}
        >
          <AppView position='absolute' left={0} marginLeft='sm' onLayout={onLayoutLeft}>
            {leftButtonType !== 'none' && (
              <>
                {hasSolidOverlap && (
                  <AppAnimatedView
                    {...COMMON_STYLES.absoluteFill}
                    variant='sShadow'
                    backgroundColor='background'
                    borderRadius={sharedButtonProps.borderRadius}
                    style={animatedSolidOverlapButtonStyle}
                  />
                )}
                <AppButton
                  icon={leftButtonIcon}
                  iconStyle={{
                    width: leftButtonIcon === 'chevronLeft' ? 18 : 26,
                    color:
                      leftButtonType === 'back' ?
                        variant === 'light' ?
                          'invertedIcon'
                        : 'primary'
                      : undefined,
                  }}
                  onPress={() => {
                    if (leftButtonType === 'menu') {
                      drawer.current?.open();
                    } else {
                      if (typeof leftButtonAction === 'function') {
                        leftButtonAction();
                      } else {
                        navigation.goBack();
                      }
                    }
                  }}
                  width={backButtonLabelVisible ? 'auto' : 35}
                  height={35}
                  {...sharedButtonProps}
                  paddingRight={leftButtonIcon === 'chevronLeft' ? '3xs' : undefined}
                  hitSlop={15}
                  text={backButtonLabelVisible ? 'BACK' : ''}
                />
              </>
            )}
          </AppView>

          <AppView
            justifyContent='center'
            alignItems='center'
            minWidth={1} // width === 0 breaks the layout
            style={{ marginHorizontal: titleMargin }}
          >
            {titleWrapper ? titleWrapper(Middle) : Middle}
          </AppView>

          <AppView
            position='absolute'
            right={0}
            marginRight='sm'
            onLayout={onLayoutRight}
            flexDirection='row'
          >
            {!!additionalButtons &&
              (Array.isArray(additionalButtons) ?
                additionalButtons.map(
                  buttonProps =>
                    buttonProps && (
                      <>
                        {hasSolidOverlap && (
                          <AppAnimatedView
                            {...COMMON_STYLES.absoluteFill}
                            variant='sShadow'
                            backgroundColor='background'
                            borderRadius={sharedButtonProps.borderRadius}
                            width={buttonProps.width}
                            height={buttonProps.height}
                            style={animatedSolidOverlapButtonStyle}
                          />
                        )}
                        <AppButton
                          marginRight='2xs'
                          {...sharedButtonProps}
                          hitSlop={10}
                          {...buttonProps}
                          key={'key' in buttonProps ? buttonProps.key : ''}
                        />
                      </>
                    ),
                )
              : <>
                  {hasSolidOverlap && (
                    <AppAnimatedView
                      {...COMMON_STYLES.absoluteFill}
                      variant='sShadow'
                      backgroundColor='background'
                      borderRadius={sharedButtonProps.borderRadius}
                      width={additionalButtons.width}
                      height={additionalButtons.height}
                      style={animatedSolidOverlapButtonStyle}
                    />
                  )}
                  <AppButton
                    marginRight='2xs'
                    {...sharedButtonProps}
                    hitSlop={15}
                    {...additionalButtons}
                  />
                </>)}
          </AppView>
        </AppView>
      )}
    </AppView>
  );
};

export default memo(Header);
