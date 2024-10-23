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
// import { sendNotification } from "../utils/sendNotification";
// import { getTokenFromStorage } from "../utils/getTokenFromStorage";
  
const WelcomeScreen = ({ navigation }) => {
  const { showToast } = useToast();
const [resetPassword, setResetPassword] = useState<boolean>(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
      undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();
  
    useEffect(() => {
      // getTokenFromStorage().then((token) => {
      //   if (token) {
      //       setTokenValue(token);
      //     console.log("FCM Token:", token);
      //     showToast('FCM Token:'+token,'success','top')
      //   } else {
      //     console.log("No token found.");
      //   }
      // });
    }, []);
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
            {/* <Image
             source={require('../../assets/images/icon.png')}
              style={{ width: 50, height: 50 }} // Adjust the width and height as needed
            /> */}
          </View>
          <View style={globalStyles.imageView}>
            <ButtonComponent text="login" onPress={() => navigateTo("Login")} />
            <ButtonComponent
              text="Register"
              marginTop={tokens.spacing.sm}
              buttonColor={tokens.colors.background}
              borderColor={tokens.colors.floraOnTapMainColor}
              borderWidth={0.4}
              textColor={tokens.colors.floraOnTapMainColor}
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
