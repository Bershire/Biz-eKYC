import { NavigationContainer, NavigationContainerRefWithCurrent, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthenticationNavigator from './Authentication';
import MainTabNavigator from './MainTab';
import { useIsAuthenticated } from '../utils/useIsAuthenticated';
import RNBootSplash from 'react-native-bootsplash';

export type ApplicationStackParamList = {
  Authentication: undefined;
  MainTab: undefined;
};

export interface AppNavigatorProps {
  onReady?: (ref: NavigationContainerRefWithCurrent<ApplicationStackParamList>) => void;
}

const Stack = createNativeStackNavigator<ApplicationStackParamList>();

const AppNavigator: React.FC<AppNavigatorProps> = ({ onReady }) => {
  const isAuthenticated = useIsAuthenticated();
  const navigationRef = useNavigationContainerRef();
  return (
    <NavigationContainer
      onReady={() => {
        setTimeout(() => RNBootSplash.hide({ fade: true }), 500);
        onReady?.(navigationRef);
      }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name='MainTab' component={MainTabNavigator} />
        ) : (
          <Stack.Screen name='Authentication' component={AuthenticationNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
