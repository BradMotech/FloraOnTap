import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import { AuthContext } from "../auth/AuthContext";
import Toast from "react-native-toast-message";
import { useToast } from "../components/ToastContext";
import LoadingScreen from "../components/LoadingScreen";
import Walkthrough from "../components/walkthrough";

const LoginScreen = ({ navigation }) => {
  const [isWalkthroughVisible, setIsWalkthroughVisible] = useState(false);
  const buttonRef = useRef(null);
  const buttonRef2 = useRef(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // Fixed typo: passowrd -> password
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { signIn, setUserType, userType, user, errorMessage } =
    useContext(AuthContext);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigateTo = (routeName: string) => {
    navigation.navigate(routeName); // Navigate to the specified route
  };

  const walkthroughElements = [
    {
      ref: buttonRef,
      description: "This button allows you to create a new task.",
    },
    {
      ref: buttonRef2,
      description: "This button allows you to edit the task.",
    },
    // Add more steps as needed
  ];

  useEffect(() => {
    setIsWalkthroughVisible(true);
  }, []);

  const signInToApp = async () => {
    setIsLoading(true)
    try {
      await signIn(email, password);
      if (errorMessage) {
        console.log("🚀 ~ signInToApp ~ errorMessage:", errorMessage);
        showToast("Error signing in - " + errorMessage, "danger", "top");
      }
      navigateTo("Dashboard"); // Navigate after successful sign-in
      setIsLoading(false)
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

  return !isLoading ? (
    <ImageBackground
      source={{ uri: "https://hairdu2024.web.app/hairdubraidsbackground3.png" }}
      style={globalStyles.backgroundImage}
    >
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      > */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                style={[
                  globalStyles.subtitle,
                  { marginTop: tokens.spacing.md },
                ]}
              >
                {SUBTITLES.LOGIN_SUBTITLE}
              </Text>
              <View style={globalStyles.imageView}>
                <InputComponent
                  iconName="mail-outline"
                  value={email.trim()}
                  keyboardType="default"
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
        </TouchableWithoutFeedback>
      {/* </KeyboardAvoidingView> */}
      {/* Walkthrough here */}
      {/* Walkthrough component */}
      {/* <Walkthrough
        elements={walkthroughElements}
        isVisible={isWalkthroughVisible}
        onClose={() => setIsWalkthroughVisible(false)}
      /> */}
    </ImageBackground>
  ):<LoadingScreen/>;
};

export default LoginScreen;
