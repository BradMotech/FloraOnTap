import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Replace with your preferred icon library
import OrdersScreen from '../../screens/Customer/OrdersScreen';
import ChatScreen from '../../screens/Customer/ChatScreen';
import DashboardScreen from '../../screens/Customer/DashboardScreen';
import ProfileScreen from '../../screens/Customer/ProfileScreen';
import SettingsScreen from '../../screens/Customer/SettingsScreen';
import tokens from '../../styles/tokens';
import Header from '../../components/header';
import { createStackNavigator } from '@react-navigation/stack'; // Use @react-navigation/stack
import FlowerShopDetails from '../../screens/Customer/FlowerShopDetails';
import PlaceOrder from '../../screens/Customer/PlaceOrder';
import { Dimensions, StatusBar, View, Text, StyleSheet } from 'react-native';
import FAQScreen from '../../screens/Customer/FAQScreen';
import StoriesPreview from '../../screens/Customer/StoriesPreview';
import ImmediateChat from '../../common/ImmediateChat';
import Notifications from '../../common/Notifications';
import { AuthContext } from '../../auth/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create the stack navigator

const DashboardStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={true} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.floraOnTapMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontFamily:'GorditaRegular',
      },
    })}
  >
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="FlowerShopDetails" component={FlowerShopDetails} />
    <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
    <Stack.Screen name="StoriesPreview" component={StoriesPreview} />
    <Stack.Screen name="ChatToFlorist" component={ImmediateChat} />
    <Stack.Screen name="Notifications" component={Notifications} />
  </Stack.Navigator>
);
const AppointmentStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={true} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.floraOnTapMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontFamily:'GorditaMedium',
      },
    })}
  >
    <Stack.Screen name="Orders" component={OrdersScreen} />
  </Stack.Navigator>
);
const ChatStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={true} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.floraOnTapMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontFamily:'GorditaMedium',
      },
    })}
  >
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);
const SettingsStack = () => (
  
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={true} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
      headerStyle: {
        backgroundColor: tokens.colors.floraOnTapMainColor,
      },
      headerTintColor: '#fff',
      headerShown:true,
      headerTitleStyle: {
        fontFamily:'GorditaMedium',
      },
    })}
  >
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="FAQ" component={FAQScreen} />
  </Stack.Navigator>
);

const CustomerTabNavigator = () => {
  const { appointments } =
  useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = color !== tokens.colors.floraOnTapMainColor ? 'home-outline':'home';
          } else if (route.name === 'Settings') {
            iconName = color !== tokens.colors.floraOnTapMainColor ?  'settings-outline':'settings';
          } else if (route.name === 'Appointments') {
            // iconName = color !== tokens.colors.floraOnTapMainColor ?  'calendar-outline':'calendar';
            return (
              <View style={{ position: "relative" }}>
                <Ionicons
                  name={
                    color !== tokens.colors.floraOnTapMainColor
                      ? "calendar-outline"
                      : "calendar"
                  }
                  size={size}
                  color={color}
                />
                  {appointments?.length && <View
                    style={[
                      styles.iconContainer,
                      { position: "absolute", top: -12, left: -13 },
                    ]}
                  >
                    {/* Notification Icon */}
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{appointments?.length}</Text>
                    </View>
                  </View>}
              </View>
            );
          } else if (route.name === 'Chat') {
            iconName = color !== tokens.colors.floraOnTapMainColor ? 'chatbubble-outline':'chatbubble';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tokens.colors.floraOnTapMainColor,
        tabBarInactiveTintColor: tokens.colors.inactive,
        tabBarShowLabel: false, // Optionally hide the labels for tabs
        headerShown: false, // Hide the header for the tab navigator
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Appointments" component={AppointmentStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;
const styles = StyleSheet.create({
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 4, // Adjust position as needed
    top: 4, // Adjust position as needed
    backgroundColor: tokens.colors.green,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});