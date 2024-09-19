import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const AuthNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        title: 'Login',
      },
    },
    SignUp: {
      screen: SignupScreen,
      navigationOptions: {
        title: 'Sign Up',
      },
    },
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: {
        title: 'Sign Up',
      },
    },
  },
  {
    initialRouteName: 'Welcome',
    defaultNavigationOptions: {
      headerShown: false, // Hide the header
    },
  }
);

export default createAppContainer(AuthNavigator); 
