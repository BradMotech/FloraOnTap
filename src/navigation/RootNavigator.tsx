import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ProviderNavigator from './ProviderNavigator';
import CustomerNavigator from './CustomerNavigator';
import { AuthContext } from '../auth /AuthContext';
import AuthNavigator from '../navigation/AuthNavigator';
import ProviderTabNavigator from './bottomTabs/ProviderTabNavigator';
import CustomerTabNavigator from './bottomTabs/CustomerTabNavigator';
// import { createDrawerNavigator } from '@react-navigation/drawer';

// const Drawer = createDrawerNavigator();
const RootNavigator = () => {
  const { userType, isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
        {/* <Drawer.Navigator initialRouteName="Dashboard"> */}
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userType === 'Provider' ? (
        <ProviderTabNavigator />
      ) : (
        <CustomerTabNavigator />
      )}
        {/* </Drawer.Navigator> */}
    </NavigationContainer>
  );
};

export default RootNavigator;
