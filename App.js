import React, { useEffect,useState } from "react";
import { Platform, Alert, StatusBar,LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import globalStyles from "./src/styles/globalStyles";
import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/auth/AuthContext";
import { ToastProvider } from "./src/components/ToastContext";
import * as Font from 'expo-font';
// import messaging from "@react-native-firebase/messaging";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./src/components/LoadingScreen";

const loadFonts = () => {
  return Font.loadAsync({
    'GorditaMedium': require('./assets/fonts/Gordita-Font/Gordita-Medium.otf'), 
    'GorditaLight': require('./assets/fonts/Gordita-Font/Gordita-Light.otf'), 
    'GorditaBold': require('./assets/fonts/Gordita-Font/Gordita-Bold.otf'), 
    'GorditaBlack': require('./assets/fonts/Gordita-Font/Gordita-Black.otf'), 
    'GorditaRegular': require('./assets/fonts/Gordita-Font/Gordita-Regular.otf'), 
  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
    return () => {
      
    };
  }, []);
  LogBox.ignoreAllLogs(true);
  // const requestUserPermission = async () => {
  //   try {
  //     if (Platform.OS === "ios") {
  //       const authStatus = await messaging().requestPermission();
  //       const enabled =
  //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //       if (enabled) {
  //         console.log("iOS: Authorization granted.", authStatus);
  //         Alert.alert("iOS: Authorization granted.");
  //         return true;
  //       } else {
  //         console.log("iOS: Permission not granted.", authStatus);
  //         Alert.alert("iOS: Permission not granted.");
  //         return false;
  //       }
  //     } else {
  //       console.log("Android: Notifications are enabled by default.");
  //       return true; // Android handles notifications without explicit permission requests
  //     }
  //   } catch (error) {
  //     console.log("Error requesting notification permission:", error);
  //     Alert.alert("Error requesting notification permission", error.message);
  //     return false;
  //   }
  // };

  // const saveTokenToStorage = async (token) => {
  //   try {
  //     await AsyncStorage.setItem("fcmToken", token);
  //     console.log("Token saved to AsyncStorage");
  //     // Alert.alert("Token saved to AsyncStorage", token);
  //   } catch (error) {
  //     console.log("Failed to save token to AsyncStorage", error);
  //   }
  // };

  // const getToken = async () => {
  //   try {
  //     const token = await messaging().getToken();
  //     if (token) {
  //       console.log("FCM Token:", token);
  //       // Alert.alert("FCM Token:", token);
  //       await saveTokenToStorage(token);
  //     } else {
  //       console.log("Failed to get FCM token.");
  //       Alert.alert("Failed to get FCM token.");
  //     }
  //   } catch (error) {
  //     console.log("Error getting FCM token:", error);
  //     Alert.alert("Error getting FCM token:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   const initNotifications = async () => {
  //     const permissionGranted = await requestUserPermission();

  //     if (permissionGranted) {
  //       await getToken();
  //     }

  //     // Handle background and quit state notifications
  //     messaging()
  //       .getInitialNotification()
  //       .then((remoteMessage) => {
  //         if (remoteMessage) {
  //           console.log(
  //             "Notification caused app to open from quit state:",
  //             remoteMessage.notification
  //           );
  //         }
  //       });

  //     // Handle background state notifications
  //     messaging().onNotificationOpenedApp((remoteMessage) => {
  //       console.log(
  //         "Notification caused app to open from background state:",
  //         remoteMessage.notification
  //       );
  //     });

  //     // Handle foreground notifications
  //     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //       console.log("Notification received in foreground:", remoteMessage);
  //       Alert.alert("New FCM Message", JSON.stringify(remoteMessage.notification));
  //     });

  //     return unsubscribe;
  //   };

  //   const unsubscribeFromNotifications = initNotifications();

  //   return () => {
  //     if (unsubscribeFromNotifications) {
  //       unsubscribeFromNotifications();
  //     }
  //   };
  // }, []);

  return fontsLoaded ? (
    <SafeAreaProvider style={globalStyles.safeArea}>
      <ToastProvider>
        <StatusBar hidden={true} />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  ):<LoadingScreen/>;
};

export default App;
