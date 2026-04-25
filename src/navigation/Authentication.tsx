import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OnboardingScreen from 'src/screens/Onboarding/Splash';
import WelcomeScreen from 'src/screens/Onboarding/Welcome';
import { useAppSelector } from 'src/utils/useAppStore';
import LoginScreen from '../screens/Authentication/Login';

export type AuthenticationParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthenticationParamList>();

const AuthenticationNavigator = () => {
  const hasLaunched = useAppSelector(s => s.appMeta.hasLaunched);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasLaunched ? 'Login' : 'Welcome'}
    >
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='Onboarding' component={OnboardingScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticationNavigator;
