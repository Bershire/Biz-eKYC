import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_BUMP_HEIGHT, TAB_BAR_HEIGHT } from './AppTabBar';

export const useAppTabBarHeight = () => {
  const { bottom } = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + TAB_BAR_BUMP_HEIGHT + bottom;
};
