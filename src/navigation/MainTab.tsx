import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'src/components/Icon/Icon';
import { FONT_FAMILIES } from 'src/assets/fonts';
import AccountScreen from '../screens/Account/Account';
import HomeScreen from '../screens/Home/Home';
import OthersNavigator from './OthersNavigator';

export type MainTabParamList = {
  Home: undefined;
  Others: undefined;
  Account: undefined;
};

const Tab = createMaterialTopTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { t } = useTranslation('common');

  const baseTabBarStyle = {
    height: 91,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderTopColor: '#D2D2D2',
  } as const;

  return (
    <Tab.Navigator
      tabBarPosition='bottom'
      screenOptions={{
        tabBarShowIcon: true,
        tabBarActiveTintColor: '#066FDB',
        tabBarInactiveTintColor: '#000000',
        tabBarIndicatorStyle: { backgroundColor: 'transparent' },
        tabBarStyle: baseTabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          textTransform: 'none',
          marginTop: 6,
          fontFamily: FONT_FAMILIES.nunitoSansRegular,
          lineHeight: 16,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
        },
        tabBarIconStyle: {
          marginTop: 8,
          alignSelf: 'center',
        },
        tabBarContentContainerStyle: {
          justifyContent: 'space-between',
        },
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: t('tabBar.home'),
          tabBarIcon: ({ focused }) => (
            <Icon type={focused ? 'homeOn' : 'homeOff'} width={24} height={24} />
          ),
        }}
      />
      <Tab.Screen
        name='Others'
        component={OthersNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'OthersHome';
          const hideTabBar = routeName === 'PersonalInformation' || routeName === 'Language';

          return {
            tabBarLabel: t('tabBar.others'),
            tabBarIcon: ({ focused }) => (
              <Icon type={focused ? 'othersOn' : 'othersOff'} width={24} height={24} />
            ),
            tabBarStyle: hideTabBar ? [baseTabBarStyle, { display: 'none' }] : baseTabBarStyle,
          };
        }}
      />
      <Tab.Screen
        name='Account'
        component={AccountScreen}
        options={{
          tabBarLabel: t('tabBar.account'),
          tabBarIcon: ({ focused }) => (
            <Icon type={focused ? 'accountOn' : 'accountOff'} width={24} height={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
