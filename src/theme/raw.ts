import { FONT_FAMILIES } from 'src/assets/fonts';

export const palette = {
  transparent: '#00000000',
  black: '#000000',
  nearBlack: '#151515',
  gray600: '#0F0D0F',
  gray530: '#1D1D1D',
  gray560: '#2B2B2B',
  gray500: '#434343',
  gray400: '#575456',
  gray300: '#888888',
  gray200: '#A29FA0',
  gray100: '#D2D2D2',
  gray50: '#e0e0e0',
  lightGray: '#F8F8F8',
  softGray: '#EDEDED',
  coolGray: '#AAAAAA',
  gainsboro: '#FBFBFB',
  white: '#ffffff',
  almostWhite: '#F2F4F7',

  blue: '#007bff',
  lightBlue: '#7dbcff',
  lighterBlue: '#abd8ff',
  lavenderBlue: '#D0D8FF',
  deepBlue: '#066FDB',
  brightBlue: '#395FF9',
  cornflowerBlue: '#4D81E7',
  darkBlue: '#084C96',
  modalBorder: '#8BA6CF',
  red: '#d60000',
  green: '#30b700',
  yellow: '#ddac00',
  redW: '#FF0000',
};

export const fontWeights = {
  regular: {
    fontFamily: FONT_FAMILIES.regular,
  },
  medium: {
    fontFamily: FONT_FAMILIES.medium,
  },
  semiBold: {
    fontFamily: FONT_FAMILIES.semiBold,
  },
  bold: {
    fontFamily: FONT_FAMILIES.bold,
  },
} as const;

export const lineHeights = {
  xs: 12,
  sm: 15,
  md: 17,
  lg: 24,
  xl: 27,
};

export const boldFontSizesAndLineHeights = {
  '2xs': { fontSize: 8, lineHeight: 11 },
  xs: { fontSize: 10, lineHeight: 14 },
  sm: { fontSize: 12, lineHeight: 16.5 },
  md: { fontSize: 14, lineHeight: 19 },
  lg: { fontSize: 16, lineHeight: 21.5 },
  xl: { fontSize: 18, lineHeight: 25 },
  '2xl': { fontSize: 20, lineHeight: 26.5 },
  '28': { fontSize: 28, lineHeight: 38 },
  '3xl': { fontSize: 30, lineHeight: 40.5 },
  '4xl': { fontSize: 36, lineHeight: 48 },
  '5xl': { fontSize: 42, lineHeight: 56 },
};

export const lightFontSizesAndLineHeights = {
  '2xs': { fontSize: 8, lineHeight: 11 },
  xs: { fontSize: 10, lineHeight: 14 },
  sm: { fontSize: 12, lineHeight: 15 },
  md: { fontSize: 14, lineHeight: 18.5 },
  lg: { fontSize: 16, lineHeight: 20.5 },
  xl: { fontSize: 18, lineHeight: 24 },
  '2xl': { fontSize: 20, lineHeight: 25.5 },
  '28': { fontSize: 28, lineHeight: 36 },
  '3xl': { fontSize: 30, lineHeight: 38.5 },
  '4xl': { fontSize: 36, lineHeight: 46 },
  '5xl': { fontSize: 42, lineHeight: 53.5 },
};

type FontSizeType = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '28' | '3xl' | '4xl' | '5xl';

export const genTextStyle = (fontSize: FontSizeType, fontWeight: keyof typeof fontWeights) => {
  if (fontWeight === 'semiBold' || fontWeight === 'bold') {
    return {
      ...fontWeights[fontWeight],
      ...boldFontSizesAndLineHeights[fontSize],
    };
  }
  return {
    ...fontWeights[fontWeight],
    ...lightFontSizesAndLineHeights[fontSize],
  };
};
