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
import ProductUploadScreen from '../../screens/Provider/ProductUploadScreen';
import ProductEditScreen from '../../screens/Provider/ProductEditScreen';
import { Dimensions } from 'react-native';
import FinancialProjections from '../../screens/Provider/FinancialProjections';
import Patrons from '../../screens/Provider/Patrons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); 
const DashboardStack = () => (
  
  <Stack.Navigator
    screenOptions={({route, navigation }) => ({
      header: () => {
        let title = '';

        switch (route.name) {
          case 'Dashboard':
            title = 'Dashboard';
            break;
          case 'AddProduct':
            title = 'Add Product';
            break;
          case 'AddPatrons':
            title = 'Add Patrons';
            break;
          case 'EditProduct':
            title = 'Edit Product';
            break;
          case 'Projections':
            title = 'Financial Projections';
            break;
          case 'Subscription':
            title = 'Subscription';
            break;
          default:
            title = 'Hairdu';
        }

        return (
          <Header
            title={title}
            navigation={navigation}
            profileImageUrl={''}
          />
        );
      },
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
         fontFamily:'GorditaRegular',
         textAlign:'center',
      },
    })}
  >
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="AddProduct" component={ProductUploadScreen} />
    <Stack.Screen name="AddPatrons" component={Patrons} />
    <Stack.Screen name="EditProduct" component={ProductEditScreen} />
    <Stack.Screen name="Projections" component={FinancialProjections} />
    <Stack.Screen name="Subscription" component={PriceList} />
  </Stack.Navigator>
);
const AppointmentsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
         fontFamily:'GorditaRegular',
      },
    })}
  >
    <Stack.Screen name="Appointments" component={AppointmentsScreen} />
  </Stack.Navigator>
);
const ChatsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
         fontFamily:'GorditaRegular',
      },
    })}
  >
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);
const SettingsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.hairduMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
         fontFamily:'GorditaRegular',
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
            iconName = color !== tokens.colors.hairduMainColor ? 'home-outline':'home';
          } else if (route.name === 'Settings') {
            iconName = color !== tokens.colors.hairduMainColor ?  'settings-outline':'settings';
          } else if (route.name === 'Appointments') {
            iconName = color !== tokens.colors.hairduMainColor ?  'calendar-outline':'calendar';
          } else if (route.name === 'Chat') {
            iconName = color !== tokens.colors.hairduMainColor ? 'chatbubble-outline':'chatbubble';
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
