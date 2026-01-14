import React, { useContext } from 'react';
import { LayoutRectangle, View, useWindowDimensions } from 'react-native';
import { COMMON_STYLES } from 'src/theme/styles';
import { useLayout } from 'src/utils/useLayout';

type LayoutSize = Pick<LayoutRectangle, 'width' | 'height'>;
const ScreenDimensionsContext = React.createContext<LayoutSize | undefined>(undefined);

export const useRealDimensions = () => {
  const dimensions = useContext(ScreenDimensionsContext);
  if (!dimensions) throw new Error('useDimensions hook must be used inside provider');
  return dimensions;
};

interface ScreenDimensionsProviderProps {
  children: React.ReactNode;
}

// See more: https://github.com/facebook/react-native/issues/23693#issuecomment-1583271026
export const RealDimensionsProvider = ({ children }: ScreenDimensionsProviderProps) => {
  const dimensions = useWindowDimensions();
  const [{ onLayout }, realDimensions] = useLayout();

  return (
    <ScreenDimensionsContext.Provider
      value={{
        width: realDimensions.width || dimensions.width,
        height: realDimensions.height || dimensions.height,
      }}
    >
      <View style={COMMON_STYLES.fill} onLayout={onLayout}>
        {children}
      </View>
    </ScreenDimensionsContext.Provider>
  );
};
