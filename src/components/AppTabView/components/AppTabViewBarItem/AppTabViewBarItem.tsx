import React, { memo } from 'react';
import { LayoutRectangle } from 'react-native';
import { Route } from 'react-native-tab-view';
import AppText from 'src/components/AppText/AppText';
import AppTouchableOpacity from 'src/components/AppTouchableOpacity/AppTouchableOpacity';

interface AppTabViewBarItemProps {
  route: Route;
  onPress?: () => void;
  onLayout?: (layout: LayoutRectangle) => void;
}

const AppTabViewBarItem: React.FC<AppTabViewBarItemProps> = memo(({ route, onPress, onLayout }) => {
  return (
    <AppTouchableOpacity
      key={route.key}
      paddingHorizontal='xs'
      paddingVertical='2xs'
      onPress={onPress}
      onLayout={e => onLayout?.(e.nativeEvent.layout)}
    >
      <AppText variant='smallSubtitle'>{route.title}</AppText>
    </AppTouchableOpacity>
  );
});

export default AppTabViewBarItem;
