import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import globalStyles from "../styles/globalStyles";
import ContainerCard from "../components/ContainerCard";
import { SUBTITLES, TITLES } from "../utils/Constants/constantTexts";
import InputComponent from "../components/InputComponent";
import tokens from "../styles/tokens";
import ButtonComponent from "../components/buttonComponent";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import { AuthContext } from "../auth /AuthContext";
import Toast from "react-native-toast-message";
import { useToast } from "../components/ToastContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // Fixed typo: passowrd -> password
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { signIn, setUserType, userType, user, errorMessage } =
    useContext(AuthContext);
  const { showToast } = useToast();

  const navigateTo = (routeName: string) => {
    navigation.navigate(routeName); // Navigate to the specified route
  };

  const signInToApp = async () => {
    try {
      await signIn(email, password);
      if (errorMessage) {
        console.log("🚀 ~ signInToApp ~ errorMessage:", errorMessage);
        showToast("Error signing in - " + errorMessage, "danger", "top");
      }
      navigateTo("Dashboard"); // Navigate after successful sign-in
    } catch (error) {
      console.error("error signing in - " + error);
      // Alert.alert("Login failed", error.message);
    }
  };

  const focusNextInput = () => {
    if (passwordRef.current) {
      passwordRef.current.focus(); // Focus on the password input
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://hairdu2024.web.app/hairdubraidsbackground3.png" }}
      style={globalStyles.backgroundImage}
    >
      <View style={globalStyles.container}>
        <Icon
          onPress={() => navigation.goBack()}
          name="chevron-left"
          style={{
            color: "green",
            position: "absolute",
            top: 0,
            marginTop: 44,
            left: 0,
            marginLeft: 22,
          }}
          size={20}
        />
        <ContainerCard>
          <Text style={[globalStyles.title, globalStyles.welcomeText]}>
            {TITLES.LOGIN}
          </Text>
          <Text
            style={[globalStyles.subtitle, { marginTop: tokens.spacing.md }]}
          >
            {SUBTITLES.LOGIN_SUBTITLE}
          </Text>
          <View style={globalStyles.imageView}>
            <InputComponent
              iconName="mail-outline"
              value={email}
              keyboardType="email-address"
              onChangeText={(text: string) => setEmail(text)}
              onSubmitEditing={focusNextInput}
              ref={emailRef}
              placeholder="Enter email"
            />
            <InputComponent
              iconName="key"
              value={password}
              keyboardType="default"
              onChangeText={(text: string) => setPassword(text)}
              ref={passwordRef}
              secureTextEntry
              placeholder="Enter password"
            />
          </View>
          <View style={globalStyles.imageView}>
            <ButtonComponent text="login" onPress={signInToApp} />
          </View>
        </ContainerCard>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
