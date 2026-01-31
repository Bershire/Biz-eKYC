import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChooseLanguageScreen from 'src/screens/Onboarding/ChooseLanguage';
import { useAppSelector } from 'src/utils/useAppStore';
import LoginScreen from '../screens/Authentication/Login';
import SignUpScreen from '../screens/Authentication/SignUp';
import OnboardingScreen from 'src/screens/Onboarding/Splash';

export type AuthenticationParamList = {
  Language: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<AuthenticationParamList>();

const AuthenticationNavigator = () => {
  const language = useAppSelector(s => s.settings.language);
  const hasLaunched = useAppSelector(s => s.appMeta.hasLaunched);
  const initialRouteName = !language ? 'Language' : hasLaunched ? 'Login' : 'Onboarding';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name='Language' component={ChooseLanguageScreen} />
      <Stack.Screen name='Onboarding' component={OnboardingScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticationNavigator;
