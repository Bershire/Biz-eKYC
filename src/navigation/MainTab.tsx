import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AccountScreen from '../screens/Account/Account';
import HomeScreen from '../screens/Home/Home';
import OthersScreen from '../screens/Others/Others';

export type MainTabParamList = {
  Home: undefined;
  Others: undefined;
  Account: undefined;
};

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { t } = useTranslation('common');

  return (
    <Tab.Navigator tabBarPosition='bottom'>
      <Tab.Screen name='Home' component={HomeScreen} options={{ tabBarLabel: t('tabBar.home') }} />
      <Tab.Screen name='Others' component={OthersScreen} options={{ tabBarLabel: t('tabBar.others') }} />
      <Tab.Screen name='Account' component={AccountScreen} options={{ tabBarLabel: t('tabBar.account') }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
