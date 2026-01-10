import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/Authentication/Login';

export type AuthenticationParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthenticationParamList>();

const AuthenticationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticationNavigator;
