import { BorderProps, border, composeRestyleFunctions, useRestyle } from '@shopify/restyle';
import React from 'react';
import { StyleSheet } from 'react-native';
import { IRNHoleView, RNHole, RNHoleView } from 'react-native-hole-view';
import { ViewRestyleProps, composedViewFunctions } from 'src/theme/restyle';
import { Theme } from 'src/theme/theme';

type RestyleHole = Pick<BorderProps<Theme>, keyof RNHole & keyof BorderProps<Theme>> &
  Omit<RNHole, keyof RNHole & keyof BorderProps<Theme>>;
export interface RestyleHoleViewProps extends Omit<IRNHoleView, 'holes'>, ViewRestyleProps {
  hole?: RestyleHole;
}

type Border = (typeof border)[number];
type BorderRadius = Omit<Border, 'property'> & { property: Border['property'] & keyof RNHole };

const holeFunctions = composeRestyleFunctions<Theme, RestyleHole>([border as BorderRadius[]]);

const RestyleHoleView: React.FC<RestyleHoleViewProps> = ({ hole, ...rest }) => {
  const styledProps = useRestyle(composedViewFunctions, rest);
  const styledHole = useRestyle(holeFunctions, hole ?? ({} as RestyleHole)) as RestyleHole & {
    style: object;
  };
  const holes = [
    hole ?
      ({ ...styledHole, ...StyleSheet.flatten(styledHole.style) } as RNHole)
    : { x: 0, y: 0, width: 0, height: 0 },
  ];

  return <RNHoleView holes={holes} {...styledProps} />;
};

export default RestyleHoleView;
