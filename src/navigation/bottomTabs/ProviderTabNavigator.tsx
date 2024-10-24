// CustomerTabNavigator.js
import React, { useContext, useEffect } from 'react';
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
import { Dimensions, TouchableOpacity, View,StyleSheet,Text } from 'react-native';
import FinancialProjections from '../../screens/Provider/FinancialProjections';
import Patrons from '../../screens/Provider/Patrons';
import MerchantSettings from '../../screens/Provider/MerchantSettings';
import Notifications from '../../common/Notifications';
import ImmediateChat from '../../common/ImmediateChat';
import Badge from '../../components/Badge';
import { AuthContext } from '../../auth/AuthContext';
import AddCustomersImages from '../../screens/Provider/AddCustomerImages';

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
          case 'MerchantSettings':
            title = 'Mercant Settings';
            break;
          default:
            title = 'Flora On tap';
        }

        return (
          <Header
            title={title}
            navigation={navigation}
            profileImageUrl={''} showCredits={false}          />
        );
      },
      headerStyle: {
        backgroundColor: tokens.colors.floraOnTapMainColor,
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
    <Stack.Screen name="MerchantSettings" component={MerchantSettings} />
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="ChatToFlorist" component={ImmediateChat} />
    <Stack.Screen name="AddCustomerImages" component={AddCustomersImages} />
  </Stack.Navigator>
);
const AppointmentsStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={false} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
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
    <Stack.Screen name="Orders" component={AppointmentsScreen} />
  </Stack.Navigator>
);
const ChatsStack = () => (

  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={false} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
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
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);
const SettingsStack = () => (

  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      header: (data) =>  <Header showCredits={false} title={navigation.getState().routeNames[navigation.getState().index]} navigation={navigation} profileImageUrl={''} />,
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
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Subscription" component={PriceList} />
    <Stack.Screen name="FAQ" component={FAQScreen} />
  </Stack.Navigator>
);

const ProviderTabNavigator = () => {
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
            // iconName = color !== tokens.colors.floraOnTapMainColor ? 'chatbubble-outline':'chatbubble';
            return (
              <View style={{ position: "relative" }}>
                <Ionicons
                  name={
                    color !== tokens.colors.floraOnTapMainColor
                      ? "chatbubble-outline"
                      : "chatbubble"
                  }
                  size={size}
                  color={color}
                />
                  {/* <View
                    style={[
                      styles.iconContainer,
                      { position: "absolute", top: -12, left: -13 },
                    ]}
                  >
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{1}</Text>
                    </View>
                  </View> */}
              </View>
            );
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
      <Tab.Screen name="Appointments" component={AppointmentsStack} />
      <Tab.Screen name="Chat" component={ChatsStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
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