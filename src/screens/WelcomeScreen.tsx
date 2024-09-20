import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Image, Alert, Platform, ImageBackground, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import ContainerCard from "../components/ContainerCard";
import { TITLES } from "../utils/Constants/constantTexts";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import ButtonComponent from "../components/buttonComponent";
import tokens from "../styles/tokens";
import { useToast } from "../components/ToastContext";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { resetPasswordAsync } from "../firebase/authFunctions";

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//     }),
//   });
  
//   async function sendPushNotification(expoPushToken: string) { 
//     const message = {
//       to: expoPushToken,
//       sound: 'default',
//       title: 'Original Title',
//       body: 'And here is the body!',
//       data: { someData: 'goes here' },
//     };
  
//     await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Accept-encoding': 'gzip, deflate',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(message),
//     });
//   }
  
//   function handleRegistrationError(errorMessage: string) {
//     // const {showToast}= useToast()
//     alert(errorMessage);
//     // showToast(errorMessage,'danger','top')
//     throw new Error(errorMessage); 
//   }
  
//   async function registerForPushNotificationsAsync() {
//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
  
//     if (Device.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== 'granted') {
//         handleRegistrationError('Permission not granted to get push token for push notification!');
//         return;
//       }
      
//       const projectId =
//         Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        
//       if (!projectId) {
//         handleRegistrationError('Project ID not found');
//       }
//       try {
//         const pushTokenString = (
//           await Notifications.getExpoPushTokenAsync({
//             projectId,
//           })
//         ).data;
        
//         console.log(pushTokenString);
//         return pushTokenString;
//       } catch (e: unknown) {
//         handleRegistrationError(`${e}`);
//       }
//     } else {
//       handleRegistrationError('Must use physical device for push notifications');
//     }
//   }
  
const WelcomeScreen = ({ navigation }) => {
  const { showToast } = useToast();
const [resetPassword, setResetPassword] = useState<boolean>(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
      undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();
  
    async function resetPasswordMethod(email: string) {
      await resetPasswordAsync(email).then((data) => {
        showToast(
          "Reset password link sent successfully to your email - " + email,
          "success",
          "top"
        );
        setResetPassword(false)
      });
    }

    // useEffect(() => { 
    //   registerForPushNotificationsAsync()
    //     .then(token => setExpoPushToken(token ?? ''))
    //     .catch((error: any) => setExpoPushToken(`${error}`));
  
    //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //     setNotification(notification);
    //   });
  
    //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //     console.log(response);
    //   });
  
    //   return () => {
    //     notificationListener.current &&
    //       Notifications.removeNotificationSubscription(notificationListener.current);
    //     responseListener.current &&
    //       Notifications.removeNotificationSubscription(responseListener.current);
    //   };
    // }, []);
  const navigateTo = (routeName: string) => {
    navigation.navigate(routeName); // Navigate to the specified route
  };

  return (
    <ImageBackground
      source={{ uri: "https://hairdu2024.web.app/hairdubraidsbackground3.png" }}
      style={globalStyles.backgroundImage}
    >
      <View style={globalStyles.container}>
        <ContainerCard>
          <Text style={[globalStyles.title, globalStyles.welcomeText]}>
            {TITLES.WELCOME}
          </Text>
          <View style={globalStyles.imageView}>
            <Image
              source={{ uri: "https://hairdu2024.web.app/hairdulogo.png" }}
              style={{ width: 100, height: 100 }} // Adjust the width and height as needed
            />
          </View>
          <View style={globalStyles.imageView}>
            <ButtonComponent text="login" onPress={() => navigateTo("Login")} />
            <ButtonComponent
              text="Register"
              marginTop={tokens.spacing.sm}
              buttonColor={tokens.colors.background}
              borderColor={tokens.colors.hairduMainColor}
              borderWidth={0.4}
              textColor={tokens.colors.hairduMainColor}
              onPress={() => navigateTo("SignUp")}
            />
          </View>
          <View style={globalStyles.forgotPassword}>
              <TouchableOpacity onPress={()=> setResetPassword(true)}>
                <Text style={globalStyles.forgotPasswordClickHere}>
                  <Text style={{color:'black'}}> Forgot password ?{" "}</Text>Click here
                </Text>
              </TouchableOpacity>
          </View>
        </ContainerCard>
      </View>
      <ForgotPasswordModal visible={resetPassword} onConfirm={(email: string)=> resetPasswordMethod(email) } onCancel={ ()=> setResetPassword(false)}/>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default WelcomeScreen;
