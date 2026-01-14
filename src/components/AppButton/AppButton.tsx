import { useRestyle, useTheme } from '@shopify/restyle';
import React, { ComponentProps, forwardRef, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { ICONS } from 'src/assets/icons';
import { TextRestyleProps, ViewRestyleProps, composedViewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';
import AppText, { AppTextProps } from '../AppText/AppText';
import AppTouchableOpacity, {
  AppTouchableOpacityProps,
} from '../AppTouchableOpacity/AppTouchableOpacity';
import AppView from '../AppView/AppView';
import Icon, { IconStyleProps } from '../Icon/Icon';

export interface AppButtonProps extends AppTouchableOpacityProps, ViewRestyleProps {
  text?: string;
  icon?: keyof typeof ICONS;
  iconPosition?: 'left' | 'right' | 'farLeft' | 'farRight';
  type?: 'bare' | 'primary' | 'secondary' | 'tertiary' | 'disabled';
  size?: 'regular' | 'medium' | 'small';
  badge?: boolean | number;
  iconStyle?: IconStyleProps;
  textStyle?: AppTextProps;
  badgeStyle?: ViewRestyleProps;
  badgeTextStyle?: TextRestyleProps;
}

const AppButton = forwardRef<TouchableOpacity, AppButtonProps>(
  (
    {
      text,
      icon,
      iconPosition = 'left',
      type = 'bare',
      size = 'regular',
      badge,
      iconStyle,
      textStyle,
      badgeStyle,
      badgeTextStyle,
      disabled,
      ...rest
    },
    ref,
  ) => {
    if (!text) iconPosition = 'left';
    const { buttonVariants } = useTheme<Theme>();

    const { textProps, iconSize, disabledType } = useMemo(() => {
      const _textProps: ComponentProps<typeof AppText> = { variant: 'button' };
      let _iconSize;
      let _disabledType: keyof typeof buttonVariants | undefined;

      switch (type) {
        case 'primary':
        case 'disabled': {
          _textProps.color = 'text000';
          _disabledType = 'disabled';
          break;
        }
        case 'secondary': {
          _disabledType = 'disabledSecondary';
          _textProps.color = disabled ? 'disabled' : 'primary';
          break;
        }
        case 'tertiary':
        case 'bare': {
          _textProps.color = disabled ? 'disabled' : 'primary';
          break;
        }
        default:
      }

      switch (size) {
        case 'regular': {
          _iconSize = 24;
          _textProps.paddingVertical = '3xs';
          break;
        }
        case 'medium': {
          _iconSize = 16;
          break;
        }
        case 'small': {
          _iconSize = 14;
          break;
        }
        default:
      }

      return { textProps: _textProps, iconSize: _iconSize, disabledType: _disabledType };
    }, [disabled, size, type]);

    const styledProps = useRestyle(composedViewFunctions, {
      ...buttonVariants.defaults,
      ...buttonVariants[size],
      ...(text ? undefined : (
        { paddingHorizontal: buttonVariants[size].paddingVertical, borderRadius: 'round' }
      )),
      ...buttonVariants[disabled && disabledType ? disabledType : type],
      ...rest,
    } as ViewRestyleProps);

    return (
      <AppTouchableOpacity ref={ref} disabled={disabled || type === 'disabled'} {...styledProps}>
        {icon && (iconPosition === 'left' || iconPosition === 'farLeft') && (
          <Icon
            type={icon}
            width={iconSize}
            aspectRatio={1}
            color={disabled ? 'disabled' : textProps.color}
            marginRight={text ? '2xs' : undefined}
            {...iconStyle}
          />
        )}
        {!!text && (
          <AppText
            flex={iconPosition.startsWith('far') ? 1 : undefined}
            textAlign='center'
            {...textProps}
            {...textStyle}
          >
            {text}
          </AppText>
        )}
        {icon && (iconPosition === 'right' || iconPosition === 'farRight') && (
          <Icon
            type={icon}
            width={iconSize}
            aspectRatio={1}
            color={disabled ? 'disabled' : textProps.color}
            marginLeft={text ? '2xs' : undefined}
            {...iconStyle}
          />
        )}

        {!!badge && (
          <AppView
            position='absolute'
            width={typeof badge === 'number' ? 17 : 9}
            borderRadius='round'
            aspectRatio={1}
            backgroundColor='danger'
            top={typeof badge === 'number' ? -4 : 4}
            right={typeof badge === 'number' ? -8 : 0}
            justifyContent='center'
            alignItems='center'
            {...badgeStyle}
          >
            {typeof badge === 'number' && (
              <AppText variant='homeText8w500' color='text000' lineHeight={10} {...badgeTextStyle}>
                {badge > 99 ? '99+' : badge}
              </AppText>
            )}
          </AppView>
        )}
      </AppTouchableOpacity>
    );
  },
);

export default AppButton;
