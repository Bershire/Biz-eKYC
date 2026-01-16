import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChooseLanguageScreen from 'src/screens/Onboarding/ChooseLanguage';
import LoginScreen from '../screens/Authentication/Login';
import OnboardingScreen from 'src/screens/Onboarding/Splash';

export type AuthenticationParamList = {
  Language: undefined;
  Onboarding: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthenticationParamList>();

const AuthenticationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Language'>
      <Stack.Screen name='Language' component={ChooseLanguageScreen} />
      <Stack.Screen name='Onboarding' component={OnboardingScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticationNavigator;
