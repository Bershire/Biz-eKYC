import {
  ReanimatedContext,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';
import { selectIsAnyModalOpen } from 'src/store/ui';
import { useAppSelector } from './useAppStore';

export const useNonModalKeyboardAnimation = (): ReanimatedContext => {
  const keyboardAnimation = useReanimatedKeyboardAnimation();
  const isModalOpen = useAppSelector(selectIsAnyModalOpen);
  const defaultValue = useSharedValue(0);

  return isModalOpen ? { height: defaultValue, progress: defaultValue } : keyboardAnimation;
};
