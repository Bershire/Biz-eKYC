import MaskedView from '@react-native-masked-view/masked-view';
import {
  VariantProps,
  composeRestyleFunctions,
  createRestyleComponent,
  createVariant,
  useResponsiveProp,
  useRestyle,
  useTheme,
} from '@shopify/restyle';
import { MotiText } from 'moti';
import React from 'react';
import { Platform, Text, TextProps } from 'react-native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { IS_ANDROID } from 'src/constants/device';
import { TextRestyleProps, textFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';

const GradientText = ({
  colors,
  start,
  end,
  locations,
  useAngle,
  angleCenter,
  angle,
  ...rest
}: TextProps & LinearGradientProps) => {
  // refresh key to prevent text not updating when being changed on older android (API <= 25)
  const refreshTextKey =
    IS_ANDROID && Number.parseInt(`${Platform.Version}`) <= 25 ? `${rest.children}` : '';

  return (
    <MaskedView
      key={refreshTextKey}
      maskElement={<Text {...rest} />}
      androidRenderingMode='software'
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
        useAngle={useAngle}
        angleCenter={angleCenter}
        angle={angle}
      >
        <Text {...rest} style={[rest.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

export interface AppTextStyleProps
  extends TextRestyleProps,
    VariantProps<Theme, 'gradientVariants', 'gradientVariant'> {}
export interface AppTextProps extends TextProps, AppTextStyleProps {}

const appTextFunctions = composeRestyleFunctions<Theme, TextProps & TextRestyleProps>(
  textFunctions,
);

const AppText: React.FC<AppTextProps> = ({ gradientVariant, ...rest }) => {
  const { gradientVariants } = useTheme<Theme>();
  const styledProps = useRestyle(appTextFunctions, rest) as TextProps;
  const gradientVariantKey = useResponsiveProp<Theme, keyof Theme['gradientVariants'] | undefined>(
    gradientVariant,
  );

  return (
    <>
      {gradientVariantKey ?
        <GradientText {...gradientVariants[gradientVariantKey]} {...styledProps} />
      : <Text {...styledProps} />}
    </>
  );
};

export const AppAnimatedText = createRestyleComponent<
  AnimatedProps<TextProps> & TextRestyleProps & VariantProps<Theme, 'textVariants'>,
  Theme
>([...textFunctions, createVariant({ themeKey: 'textVariants' })], Animated.Text);

export const AppMotiText = createRestyleComponent<
  React.ComponentProps<typeof MotiText> & TextRestyleProps & VariantProps<Theme, 'textVariants'>,
  Theme
>([...textFunctions, createVariant({ themeKey: 'textVariants' })], MotiText);

export default AppText;
