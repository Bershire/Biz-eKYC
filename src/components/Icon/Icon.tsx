import {
  ColorProps,
  color as colorFunc,
  composeRestyleFunctions,
  useRestyle,
} from '@shopify/restyle';
import React, { useMemo } from 'react';
import { ColorValue, Insets, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { ICONS } from 'src/assets/icons';
import { ViewRestyleProps, viewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';

export type IconStyleProps = ViewRestyleProps & ColorProps<Theme>;
export interface IconProps
  extends IconStyleProps,
    Omit<SvgProps, 'width' | 'height' | 'opacity' | 'color'> {
  type?: keyof typeof ICONS;
}

type IconRawStyle = SvgProps['style'] & { color?: ColorValue };

const iconFunctions = composeRestyleFunctions<Theme, IconStyleProps>([...viewFunctions, colorFunc]);

const Icon: React.FC<IconProps> = ({ type, color = 'icon', ...rest }) => {
  const styledProps = useRestyle(iconFunctions, {
    color,
    ...rest,
  } as IconStyleProps) as SvgProps & {
    style?: IconRawStyle;
  };

  const usableStyledProps = useMemo(() => {
    const res = { ...styledProps };

    if (res.style) {
      const flattenedStyle = StyleSheet.flatten(res.style) as IconRawStyle;

      if ('color' in flattenedStyle) {
        res.color = flattenedStyle.color;
      }
      if ('width' in flattenedStyle && typeof flattenedStyle.width !== 'object') {
        res.width = flattenedStyle.width;
      }
      if ('height' in flattenedStyle && typeof flattenedStyle.height !== 'object') {
        res.height = flattenedStyle.height;
      }

      if ('aspectRatio' in flattenedStyle && typeof flattenedStyle.aspectRatio === 'number') {
        if (typeof res.width === 'number' || typeof res.width === 'string') {
          res.height = res.height ?? Number.parseFloat(`${res.width}`) / flattenedStyle.aspectRatio;
        }

        if (typeof res.height === 'number' || typeof res.height === 'string') {
          res.width = res.width ?? Number.parseFloat(`${res.height}`) * flattenedStyle.aspectRatio;
        }
      }
    }

    if (typeof res.hitSlop === 'number') {
      res.hitSlop = {
        top: res.hitSlop,
        bottom: res.hitSlop,
        left: res.hitSlop,
        right: res.hitSlop,
      };
    }

    return res as Omit<typeof styledProps, 'hitSlop'> & { hitSlop?: Insets };
  }, [styledProps]);

  const IconComponent = type && ICONS[type];

  // return IconComponent ? <IconComponent {...usableStyledProps} /> : <View {...usableStyledProps} />;
  return IconComponent && <IconComponent {...usableStyledProps} />;
};

export default Icon;
