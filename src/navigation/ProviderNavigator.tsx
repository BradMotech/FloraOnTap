import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import DashboardScreen from '../screens/Provider/DashboardScreen';
import ProfileScreen from '../screens/Provider/ProfileScreen';
import AppointmentsScreen from '../screens/Provider/AppointmentsScreen';
import ChatScreen from '../screens/Provider/ChatScreen';
import tokens from '../styles/tokens';

const ProviderStack = createStackNavigator(
  {
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: {
        title: 'Provider Dashboard',
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        title: 'Customer Profile',
      },
    },
    Appointments: {
      screen: AppointmentsScreen,
      navigationOptions: {
        title: 'Appointments',
      },
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        title: 'Chat',
      },
    },
  },
  {
    initialRouteName: 'Dashboard',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default createAppContainer(ProviderStack);
