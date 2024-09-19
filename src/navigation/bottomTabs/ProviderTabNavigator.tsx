// CustomerTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Replace with your preferred icon library
import AppointmentsScreen from '../../screens/Provider/AppointmentsScreen';
import ChatScreen from '../../screens/Provider/ChatScreen';
import DashboardScreen from '../../screens/Provider/DashboardScreen';
import ProfileScreen from '../../screens/Provider/ProfileScreen';
import tokens from '../../styles/tokens';
import { createStackNavigator } from '@react-navigation/stack'; // Use @react-navigation/stack
import Header from '../../components/header';
import SettingsScreen from '../../screens/Provider/SettingsScreen';
import PriceList from '../../screens/Provider/Pricelist';
import FAQScreen from '../../screens/Provider/FAQScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); 
const DashboardStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      // header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);
const AppointmentsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      // header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Stack.Screen name="Appointments" component={AppointmentsScreen} />
  </Stack.Navigator>
);
const ChatsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      // header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);
const SettingsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      // header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Subscription" component={PriceList} />
    <Stack.Screen name="FAQ" component={FAQScreen} />
  </Stack.Navigator>
);

const ProviderTabNavigator = () => {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Chat') {
            iconName = 'chatbubble-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tokens.colors.hairduMainColor,
        tabBarInactiveTintColor: tokens.colors.inactive,
        tabBarShowLabel: false, // Optionally hide the labels for tabs
        headerShown: false, // Hide the header for the tab navigator
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Appointments" component={AppointmentsStack} />
      <Tab.Screen name="Chat" component={ChatsStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
