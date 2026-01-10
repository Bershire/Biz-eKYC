import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthenticationNavigator from './Authentication';
import MainTabNavigator from './MainTab';
import { useIsAuthenticated } from '../utils/useIsAuthenticated';

export type ApplicationStackParamList = {
  Authentication: undefined;
  MainTab: undefined;
};

export interface AppNavigatorProps {
  onReady?: () => void;
}

const Stack = createNativeStackNavigator<ApplicationStackParamList>();

const AppNavigator: React.FC<AppNavigatorProps> = ({ onReady }) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <NavigationContainer onReady={onReady}>
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
