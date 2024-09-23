import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import DashboardScreen from '../screens/Customer/DashboardScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import AppointmentsScreen from '../screens/Customer/AppointmentsScreen';
import ChatScreen from '../screens/Customer/ChatScreen';
import tokens from '../styles/tokens';
import Header from '../components/header';
import { StatusBar } from 'react-native';

const CustomerStack = createStackNavigator(
  {
    Dashboard: {
      screen: DashboardScreen,
      // navigationOptions: {
      //   title: 'Dashboard',
      // },
      navigationOptions: ({ navigation }) => ({
        header: () => <Header title="Home" navigation={navigation} profileImageUrl={''} />
      }),
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
      headerShown:false,
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default createAppContainer(CustomerStack);
