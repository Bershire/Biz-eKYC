/* eslint-disable max-lines */
import { createTheme } from '@shopify/restyle';
import { addColorAlpha } from 'src/utils/addColorAlpha';
import { genTextStyle, lineHeights, palette } from './raw';

const theme = createTheme({
  colors: {
    redWarning: palette.redW,
    primary: palette.blue,
    primaryDark: palette.darkBlue,
    primaryContrast: palette.white,
    secondary: palette.lightBlue,
    text000: palette.white,
    text050: palette.gray50,
    text100: palette.gray200,
    text200: palette.gray300,
    text300: palette.gray400,
    text400: palette.gray500,
    text500: palette.gray600,
    textGreen: palette.green,
    lightGray: palette.lightGray,
    softGray: palette.softGray,
    coolGray: palette.coolGray,
    gainsboro: palette.gainsboro,
    brightBlue: palette.brightBlue,
    deepBlue: palette.deepBlue,
    cornflowerBlue: palette.cornflowerBlue,
    green: palette.green,
    nearBlack: palette.nearBlack,
    transparent: palette.transparent,
    background: palette.white,
    semiTransparentBackground: addColorAlpha(palette.white, 0.5),
    backgroundContrast: palette.black,
    cameraBackground: palette.black,
    statusBarBackground: palette.transparent,
    icon: palette.gray400,
    invertedIcon: palette.white,
    backdrop: addColorAlpha(palette.black, 0.2),
    loadingBackdrop: addColorAlpha(palette.black, 0.1),
    cameraBackdrop: addColorAlpha(palette.black, 0.5),
    chatImageBackdroup: addColorAlpha(palette.black, 0.8),
    border: palette.gray100,
    faintBorder: palette.gray50,
    highlightedBorder: palette.lavenderBlue,
    modalBorder: palette.modalBorder,
    shadow: palette.black,
    disabled: palette.gray200,
    bottomModalBackground: palette.gray400,
    bottomModalIcon: palette.white,
    carouselIndicator: palette.blue,
    dropdownPickerActiveBackground: addColorAlpha(palette.blue, 0.1),
    systemBarScrimBackground: addColorAlpha(palette.black, 0.4),
    chatBackground: palette.almostWhite,
    chatCloseBtnBackground: addColorAlpha(palette.black, 0.1),
    placeholder: palette.gray100,
    danger: palette.red,
    error: palette.redW,
    success: palette.green,
    warning: palette.yellow,
    link: palette.blue,
    linkPrimaryContrast: palette.lighterBlue,
    failedImageOverlay: addColorAlpha(palette.black, 0.4),

    tabItemFocused: palette.white,
    tabItemUnfocused: palette.gray300,
    tabViewLabelFocused: palette.white,
    tabViewLabelUnfocused: palette.gray400,
    switchActive: palette.blue,
    switchInactive: palette.gray200,
    circularProgressBg: palette.gray100,
    circularProgressFill: palette.blue,
    headerOverlapButtonBackground: addColorAlpha(palette.white, 0.5),
    offPercentageBackground: addColorAlpha(palette.blue, 0.2),
    chooseLanguageBackground: addColorAlpha(palette.blue, 0.03),
    imageViewerBackground: palette.black,
    imageViewerMenuBackground: palette.gray530,
    imageViewerMenuBorder: palette.gray560,
  },
  gradientVariants: {
    primary: {
      colors: [palette.blue, palette.lightBlue, palette.blue],
      useAngle: true,
      angle: 210.49,
      locations: [0.0287, 0.5162, 1.0036],
    },
  },
  spacing: {
    none: 0,
    '4xs': 1,
    '3xs': 2,
    '2xs': 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 60,
    '3xl': 90,
    '-4xl': -160,
    '-5xl': -190,
  },
  borderRadii: {
    none: 0,
    sm: 2,
    md: 5,
    lg: 10,
    ml: 15, // medium large
    xl: 20,
    round: 1000,
  },
  zIndices: {
    dropdown: 100,
    picker: 1,
    header: 1,
    z10: 10,
    z1: 1,
  },
  textVariants: {
    h1: {
      ...genTextStyle('lg', 'bold'),
      color: 'text400',
      padding: 0,
      margin: 0,
      marginBottom: '2xs',
    },
    hSmaller: {
      ...genTextStyle('md', 'bold'),
      color: 'text400',
      padding: 0,
      margin: 0,
      marginBottom: '2xs',
    },
    p: {
      ...genTextStyle('md', 'medium'),
      color: 'text300',
      padding: 0,
      margin: 0,
      marginBottom: '2xs',
    },
    textInput: {
      ...genTextStyle('sm', 'bold'),
      color: 'text300',
    },
    textInputWithConfirmBtn: {
      ...genTextStyle('md', 'medium'),
      color: 'text300',
    },
    underlined: {
      ...genTextStyle('sm', 'medium'),
      lineHeight: lineHeights.lg,
      textDecorationLine: 'underline',
    },
    tabTitle: {
      ...genTextStyle('2xs', 'bold'),
      lineHeight: lineHeights.md,
      color: 'text200',
    },
    header: {
      ...genTextStyle('xl', 'bold'),
      lineHeight: lineHeights.xl,
      color: 'text300',
    },
    smallSubtitle: {
      ...genTextStyle('sm', 'medium'),
      color: 'text100',
    },
    verySmallTitle: {
      ...genTextStyle('xs', 'medium'),
      color: 'text300',
    },
    smallTitle: {
      ...genTextStyle('sm', 'bold'),
      lineHeight: lineHeights.md,
      color: 'text100',
    },
    title: {
      ...genTextStyle('md', 'semiBold'),
      color: 'text500',
    },
    bigTitle: {
      ...genTextStyle('lg', 'bold'),
      color: 'text000',
    },
    bigSubtitle: {
      ...genTextStyle('lg', 'semiBold'),
      color: 'text300',
    },
    veryBigTitle: {
      ...genTextStyle('2xl', 'semiBold'),
      color: 'text300',
    },
    button: {
      ...genTextStyle('md', 'bold'),
      color: 'text000',
    },
    defaults: {
      ...genTextStyle('md', 'medium'),
      color: 'text100',
    },

    homeText8w400: genTextStyle('2xs', 'regular'),
    homeText8w500: genTextStyle('2xs', 'medium'),
    homeText8w700: genTextStyle('2xs', 'bold'),
    homeText10w400: genTextStyle('xs', 'regular'),
    homeText10w500: genTextStyle('xs', 'medium'),
    homeText10w600: genTextStyle('xs', 'semiBold'),
    homeText10w700: genTextStyle('xs', 'bold'),
    homeText12w400: genTextStyle('sm', 'regular'),
    homeText12w500: genTextStyle('sm', 'medium'),
    homeText12w600: genTextStyle('sm', 'semiBold'),
    homeText12w700: genTextStyle('sm', 'bold'),
    homeText14w400: genTextStyle('md', 'regular'),
    homeText14w500: genTextStyle('md', 'medium'),
    homeText14w600: genTextStyle('md', 'semiBold'),
    homeText14w700: genTextStyle('md', 'bold'),
    homeText16w400: genTextStyle('lg', 'regular'),
    homeText16w500: genTextStyle('lg', 'medium'),
    homeText16w600: genTextStyle('lg', 'semiBold'),
    homeText16w700: genTextStyle('lg', 'bold'),
    homeText18w600: genTextStyle('xl', 'semiBold'),
    homeText18w700: genTextStyle('xl', 'bold'),
    homeText20w500: genTextStyle('2xl', 'medium'),
    homeText20w600: genTextStyle('2xl', 'bold'),
    homeText28w600: genTextStyle('28', 'semiBold'),
    homeText31w500: genTextStyle('3xl', 'medium'),
    homeText32w600: genTextStyle('4xl', 'semiBold'),
    homeText32w650: genTextStyle('3xl', 'semiBold'),

    personalBold: genTextStyle('md', 'bold'),
    toast: {
      ...genTextStyle('md', 'medium'),
      color: 'text300',
    },
  } as const,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  viewVariants: {
    defaults: {},
    sShadow: {
      shadowColor: 'shadow',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    mShadow: {
      shadowColor: 'shadow',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6,
    },
    lShadow: {
      shadowColor: 'shadow',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16,

      elevation: 24,
    },
  },
  imageVariants: {
    defaults: {},
    card: {
      aspectRatio: 1,
    },
    banner: {
      aspectRatio: 321 / 139,
    },
    notification: {
      aspectRatio: 329 / 180,
    },
    shop: {
      aspectRatio: 289 / 176,
    },
  },
  buttonVariants: {
    defaults: {
      borderRadius: 'lg',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 2,
    },
    primary: {
      backgroundColor: 'primary',
      borderColor: 'primary',
    },
    secondary: {
      borderColor: 'primary',
    },
    tertiary: {
      backgroundColor: 'background',
      borderColor: 'background',
    },
    disabled: {
      backgroundColor: 'disabled',
      borderColor: 'disabled',
    },
    disabledSecondary: {
      borderColor: 'disabled',
    },
    regular: {
      paddingHorizontal: 'xs',
      paddingVertical: 'xs',
    },
    medium: {
      paddingHorizontal: 'xs',
      paddingVertical: '2xs',
    },
    small: {
      paddingHorizontal: 'xs',
      paddingVertical: '3xs',
    },
    bare: {
      borderColor: 'transparent',
      borderRadius: undefined,
      paddingHorizontal: undefined,
      paddingVertical: undefined,
    },
  },
  screenVariants: {
    defaults: {},
  },
  textInputVariants: {
    defaults: {
      backgroundColor: 'background',
      paddingVertical: 'xs',
      borderWidth: 1,
    },
    primary: {
      borderRadius: 'lg',
      borderColor: 'border',
    },
    secondary: {
      paddingVertical: '3xs',
      borderRadius: 'lg',
      borderColor: 'primary',
    },
    withConfirmBtn: {
      flex: 1,
      borderColor: 'primary',
      borderTopLeftRadius: 'lg',
      borderBottomLeftRadius: 'lg',
    },
  },
});

export type Theme = typeof theme;
export default theme;
