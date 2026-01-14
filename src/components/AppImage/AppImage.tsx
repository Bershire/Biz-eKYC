import {
  VariantProps,
  composeRestyleFunctions,
  createRestyleComponent,
  createVariant,
  useRestyle,
} from '@shopify/restyle';
import { Image, ImageProps } from 'expo-image';
import React, { forwardRef } from 'react';
import { ImageBackground, ImageBackgroundProps, Image as RNImage, View } from 'react-native';
import { ImageRestyleProps, ViewRestyleProps, viewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';
import Icon from '../Icon/Icon';

export interface AppImageProps
  extends Omit<
      ImageProps,
      | 'width'
      | 'height'
      | 'borderRadius'
      | 'borderBottomLeftRadius'
      | 'borderBottomRightRadius'
      | 'borderTopRightRadius'
      | 'borderTopLeftRadius'
    >,
    ImageRestyleProps,
    VariantProps<Theme, 'imageVariants'> {
  autoSizeLocalImage?: boolean;
}

const appImageFunctions = composeRestyleFunctions<Theme, AppImageProps>([
  ...viewFunctions,
  createVariant({ themeKey: 'imageVariants' }),
]);

const AppImage = forwardRef<Image, AppImageProps>((props, ref) => {
  const source = props.source;
  const autoSizeLocalImage = props.autoSizeLocalImage;
  const haveSrc = !(typeof source === 'object' ?
    !(Array.isArray(source) ?
      source.every(src => !!(typeof src === 'object' ? src.uri : src))
    : !!source?.uri)
  : typeof source === 'string' && !source);

  let imageRatio: number | undefined;
  if (typeof source === 'number' && autoSizeLocalImage) {
    const { width, height } = RNImage.resolveAssetSource(source);
    imageRatio = width / height;
  }

  const { source: _source, ...styledProps } = useRestyle(
    appImageFunctions,
    haveSrc ?
      { aspectRatio: imageRatio, ...props }
    : ({
        ...props,
        backgroundColor: 'placeholder',
        justifyContent: 'center',
        alignItems: 'center',
      } as AppImageProps),
  ) as ImageProps;

  return haveSrc ?
      <Image ref={ref} source={source} {...styledProps} />
    : <View {...styledProps}>
        <Icon type='noImage' color='text000' height='30%' aspectRatio={1} />
      </View>;
});

export interface AppImageBackgroundProps
  extends Omit<
      ImageBackgroundProps,
      | 'width'
      | 'height'
      | 'borderRadius'
      | 'borderBottomLeftRadius'
      | 'borderBottomRightRadius'
      | 'borderTopRightRadius'
      | 'borderTopLeftRadius'
    >,
    ViewRestyleProps {}

export const AppImageBackground = createRestyleComponent<AppImageBackgroundProps, Theme>(
  viewFunctions,
  ImageBackground, // expo-image's ImageBackground is slow with local image
);

export default AppImage;
