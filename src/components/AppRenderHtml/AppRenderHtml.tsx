import { useTheme } from '@shopify/restyle';
import React, { useMemo } from 'react';
import RenderHtml, { RenderHTMLProps } from 'react-native-render-html';
import { FONT_FAMILIES } from 'src/assets/fonts';
import { Theme } from 'src/theme/theme';

export interface AppRenderHtmlProps extends RenderHTMLProps {
  // props
}

const systemFonts = Object.values(FONT_FAMILIES);

const AppRenderHtml: React.FC<AppRenderHtmlProps> = props => {
  const theme = useTheme<Theme>();

  return (
    <RenderHtml
      enableExperimentalMarginCollapsing
      enableExperimentalBRCollapsing
      enableExperimentalGhostLinesPrevention
      systemFonts={systemFonts}
      {...props}
      renderersProps={useMemo(
        () => ({
          ...props.renderersProps,
          img: {
            enableExperimentalPercentWidth: true,
            ...props.renderersProps?.img,
          },
        }),
        [props.renderersProps],
      )}
      baseStyle={useMemo(
        () => ({
          ...theme.textVariants.p,
          color: theme.colors[theme.textVariants.p.color],
          ...props.baseStyle,
        }),
        [props.baseStyle, theme.colors, theme.textVariants.p],
      )}
      tagsStyles={useMemo(
        () => ({
          ...props.tagsStyles,
          h1: {
            ...theme.textVariants.h1,
            color: theme.colors[theme.textVariants.h1.color],
            marginBottom: theme.spacing[theme.textVariants.h1.marginBottom],
          },
          h2: {
            ...theme.textVariants.hSmaller,
            color: theme.colors[theme.textVariants.hSmaller.color],
            marginBottom: theme.spacing[theme.textVariants.hSmaller.marginBottom],
          },
          h3: {
            ...theme.textVariants.hSmaller,
            color: theme.colors[theme.textVariants.hSmaller.color],
            marginBottom: theme.spacing[theme.textVariants.hSmaller.marginBottom],
          },
          h4: {
            ...theme.textVariants.hSmaller,
            color: theme.colors[theme.textVariants.hSmaller.color],
            marginBottom: theme.spacing[theme.textVariants.hSmaller.marginBottom],
          },
          h5: {
            ...theme.textVariants.hSmaller,
            color: theme.colors[theme.textVariants.hSmaller.color],
            marginBottom: theme.spacing[theme.textVariants.hSmaller.marginBottom],
          },
          h6: {
            ...theme.textVariants.hSmaller,
            color: theme.colors[theme.textVariants.hSmaller.color],
            marginBottom: theme.spacing[theme.textVariants.hSmaller.marginBottom],
          },
          p: {
            ...theme.textVariants.p,
            color: theme.colors[theme.textVariants.p.color],
            marginBottom: theme.spacing[theme.textVariants.p.marginBottom],
          },
        }),
        [
          props.tagsStyles,
          theme.colors,
          theme.spacing,
          theme.textVariants.h1,
          theme.textVariants.hSmaller,
          theme.textVariants.p,
        ],
      )}
    />
  );
};

export default AppRenderHtml;
