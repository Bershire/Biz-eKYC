import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const initialState = { status: AppState.currentState, foreground: true };

// https://github.com/react-native-hooks/app-state
export const useAppState = () => {
  const [appState, setAppState] = useState(initialState);

  useEffect(() => {
    function appStateChange(nextAppState: AppStateStatus) {
      setAppState(prevState => {
        const newState = { ...prevState, status: nextAppState };
        newState.foreground = prevState.status !== 'active' && nextAppState === 'active';

        return newState;
      });
    }

    const subscription = AppState.addEventListener('change', appStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
};
