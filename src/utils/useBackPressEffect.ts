import {
  NavigationContainerRefContext,
  NavigationContext,
  useFocusEffect,
} from '@react-navigation/core';
import { useCallback, useContext, useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackPressEffect = (callback: () => boolean | null | undefined) => {
  const navigationRoot = useContext(NavigationContainerRefContext);
  const navigationContext = useContext(NavigationContext);
  const navigation = navigationContext ?? navigationRoot;

  const backPressEffect = useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', callback);
    return () => subscription.remove();
  }, [callback]);

  if (navigation) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- navigation context doesn't change throughout a component's lifetime
    useFocusEffect(backPressEffect);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- navigation context doesn't change throughout a component's lifetime
    useEffect(() => backPressEffect(), [backPressEffect]);
  }
};
