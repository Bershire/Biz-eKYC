import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import OthersScreen from 'src/screens/Others/Others';
import LanguageScreen from 'src/screens/Others/Language';
import PersonalInformationScreen from 'src/screens/Others/PersonalInformation';

export type OthersStackParamList = {
  OthersHome: undefined;
  PersonalInformation: undefined;
  Language: undefined;
};

const Stack = createNativeStackNavigator<OthersStackParamList>();

const OthersNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='OthersHome' component={OthersScreen} />
    <Stack.Screen name='PersonalInformation' component={PersonalInformationScreen} />
    <Stack.Screen name='Language' component={LanguageScreen} />
  </Stack.Navigator>
);

export default OthersNavigator;
