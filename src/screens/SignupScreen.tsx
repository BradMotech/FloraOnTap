import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ContainerCard from "../components/ContainerCard";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";
import InputComponent from "../components/InputComponent"; // Import InputComponent
import ButtonComponent from "../components/buttonComponent"; // Custom ButtonComponent
import { SUBTITLES, TITLES } from "../utils/Constants/constantTexts";
import * as ImagePicker from "expo-image-picker";
import DropdownComponent from "../components/DropdownComponent";
import WeekdaySelector from "../components/WeekDaySelector";
import { signUp } from "../firebase/authFunctions";
import {
  setHairstylistInFirestore,
  setUserInFirestore,
  uploadImageToFirebase,
} from "../firebase/dbFunctions";
import { useToast } from "../components/ToastContext";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import TextAreaComponent from "../components/TextAreaComponent";
import { AuthContext } from "../auth/AuthContext";
const GOOGLE_PLACES_API_KEY = "AIzaSyCbCTiO9UHe5adLop_2AZux7QwBDBljYVQ";

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Step state to manage form steps
  const [selectedDays, setSelectedDays] = useState([]);
  const [description, setDescription] = useState();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    province: "",
    profileImage: null, // New field for image
    availability: [],
    userSelectedRole: "",
    description: "",
    userSelectedRoleType: "",
    website: "",
    instagram: "",
    twitter: "",
  });

  const { logOut } = useContext(AuthContext);

  // Input references
  const surnameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const locationRef = useRef(null);
  const provinceRef = useRef(null);
  const userSelectedRoleRef = useRef(null);
  const userSelectedSalonTypeRef = useRef(null);
  const userDescriptionRef = useRef(null);
  const userInstagramRef = useRef(null);
  const userWebsiteRef = useRef(null);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleWeekdayChange = (days) => {
    setFormData((prevData) => ({ ...prevData, availability: days }));
  };

  // Image picker handler
  const handleImageUpload = async () => {
    setImageLoading(true);
    try {
      // Request permission to access the gallery
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast(
          "Permission denied - You need to give permission to access the gallery.",
          "danger",
          "top"
        );
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri; // Get the selected image URI

        // Upload the image to Firebase and get the download URL
        const downloadURL = await uploadImageToFirebase(imageUri);

        // Update the formData with the image URL
        setFormData((prevState) => ({
          ...prevState,
          profileImage: downloadURL,
        }));

        showToast("Image uploaded successfully!", "success", "top");
        setImageLoading(false);
      } else {
        showToast("Image upload canceled!", "danger", "top");
        setImageLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      showToast("Image upload failed!" + error.message, "danger", "top");
      setImageLoading(false);
    }
  };

  useEffect(() => {
    getTokenFromStorage().then((token) => {
      if (token) {
        setTokenValue(token);
        console.log("FCM Token:", token);
        //   showToast('FCM Token:'+token,'success','top')
      } else {
        console.log("No token found.");
      }
    });
  }, []);

  const fetchPlaceSuggestions = async (input) => {
    if (input.length < 3) return; // Start searching after 3 characters

    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyCbCTiO9UHe5adLop_2AZux7QwBDBljYVQ`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.predictions) {
        setSuggestions(data.predictions);
        console.warn(
          "🚀 ~ fetchPlaceSuggestions ~ response:" +
            JSON.stringify(data.predictions)
        );
        const placeId = data.predictions[0].place_id;

        // Fetch place details using the place_id to get the province
        const placeDetails = await fetchPlaceDetails(placeId);

        // Store both location and province
        if (placeDetails) {
          handleInputChange("province", placeDetails.province);
          // handleInputChange("location", placeDetails.placeName);
          console.warn(
            "🚀 ~ fetchPlaceSuggestions ~ placeDetails.province:",
            placeDetails.province
          );
        }
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // Fetch place details to extract province
  const fetchPlaceDetails = async (placeId) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCbCTiO9UHe5adLop_2AZux7QwBDBljYVQ`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.result) {
        const addressComponents = data.result.address_components;

        // Find the province from the address components
        const provinceComponent = addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        );

        const placeName = data.result.name;
        const province = provinceComponent ? provinceComponent.long_name : null;

        return { placeName, province };
      } else {
        console.error("No result found", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  const handlePlaceSelect = (description) => {
    // Handle the selection of the place
    setSelectedLocation(description);  
    setSuggestions([]); // Clear suggestions after selection
    handleInputChange("location", '');
  };

  const handleLogout = () => {
    logOut(); // Clear the user's authentication
    // Reset the navigation stack and navigate to the Login screen inside AuthNavigator
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthNavigator" }],
    });
  };

  

  async function signUpAndUpdateUsersCollections() {
    try {
      const data = await signUp(formData.email, formData.password);
      if (data?.user) {
        // Check if there's a valid user in the response
        const { uid } = data.user; // Get the user's UID from Firebase

        // Prepare the user data to save in Firestore
        const userData = {
          email: formData.email,
          selectedRoleValue: formData.userSelectedRole,
          id: uid,
          image: formData.profileImage,
          username: "@" + formData.name + "_" + formData.surname,
          name: formData.name,
          phone: formData.phone,
          location: selectedLocation,
          surname: formData.surname,
          province: formData.province,
          description: formData.description,
          details: formData.description,
          createdAt: new Date(),
          availability: formData.availability ? formData.availability : [],
          services: [],
          website: formData.website,
          instagram: formData.instagram,
          salonType:formData.userSelectedRoleType,
          subscription: {
            plan: "Free Trial",
            expires: new Date(),
            paid: false,
            paidAt: new Date(),
            paidUntil: new Date(),
            totalCredits: 40,
            creditsLeft: 40,
            paidMethod: "",
            paidAmount: 0,
            paidCurrency: "ZAR",
            paidStatus: "Free Trial",
            paidDate: new Date(),
            totalCreditsUsed:0
          },
          subscriptionPlan: "Free Trial",
          fcmtoken: tokenValue,
        };

        // Add the user to the Firestore Users collection
        await setUserInFirestore(uid, userData);

        if (formData.userSelectedRole === "Provider") {
          await setHairstylistInFirestore(uid, userData);
        }
        //   alert("Registration successful");
        handleLogout();
        navigation.navigate("Login");
        setStep(step + 1); // Only increment if registration and Firestore update are successful
      } else {
        //   Alert.alert("Error", "Registration failed. Please try again.");
        showToast("Registration failed. Please try again.", "danger", "top");
      }
    } catch (error) {
      // Alert.alert("Error message", error.message); // Handle any errors
      showToast("Error message" + error.message, "danger", "top");
    }
  }

  const handleNextStep = async () => {
    if (step === 3 && formData.userSelectedRole !== "Provider") {
      await signUpAndUpdateUsersCollections();
    } else {
      if (step === 3 && formData.userSelectedRole === "Provider") {
        setStep(step + 1);
        // await loginAndUpdateUsersCollections();
      } else if (step === 4) {
        // alert("yeeeee")
        await signUpAndUpdateUsersCollections();
      } else if (step === 1) {
        setStep(step + 1);
      } else if (step == 2) {
        setStep(step + 1);
      }
    }
  };

  // Render step-wise content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ height: Dimensions.get("screen").height + 300 }}>
            <Text style={[globalStyles.title, globalStyles.welcomeText]}>
              {TITLES.SIGN_UP}
            </Text>
            <Text
              style={[globalStyles.subtitle, { marginTop: tokens.spacing.md }]}
            >
              {SUBTITLES.SIGN_UP_SUBTITLE}
            </Text>
            <View>
              <InputComponent
                iconName="person-outline"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Name"
                //   returnKeyType="next"
                onSubmitEditing={() => surnameRef.current?.focus()}
                keyboardType={"default"}
              />
              <View style={{ marginTop: -16 }}>
                <InputComponent
                  ref={surnameRef}
                  iconName="person-outline"
                  value={formData.surname}
                  onChangeText={(text) => handleInputChange("surname", text)}
                  placeholder="Surname"
                  keyboardType={"default"}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
              <View style={{ marginTop: -16 }}>
                <InputComponent
                  ref={emailRef}
                  iconName="mail-outline"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  keyboardType="email-address"
                  placeholder="Email address"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
              </View>
              <View style={{ marginTop: -16 }}>
                <InputComponent
                  ref={phoneRef}
                  iconName="call-outline"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  keyboardType="phone-pad"
                  placeholder="Phone"
                  returnKeyType="next"
                  onSubmitEditing={() => userWebsiteRef.current?.focus()}
                />
              </View>
              <View style={{ marginTop: -16 }}>
                <InputComponent
                  ref={userWebsiteRef}
                  iconName="globe-outline"
                  value={formData.website}
                  onChangeText={(text) => handleInputChange("website", text)}
                  keyboardType="default"
                  placeholder="Website"
                  returnKeyType="next"
                  onSubmitEditing={() => userInstagramRef.current?.focus()}
                />
              </View>
              <View style={{ marginTop: -16 }}>
                <InputComponent
                  ref={userInstagramRef}
                  iconName="person-outline"
                  value={formData.instagram}
                  onChangeText={(text) => handleInputChange("instagram", text)}
                  keyboardType="default"
                  placeholder="Instagram"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              <DropdownComponent
                items={["Customer", "Provider"]}
                ref={userSelectedRoleRef}
                iconName="globe-outline"
                value={formData.province}
                onChangeText={(text) =>
                  handleInputChange("userSelectedRole", text)
                }
                placeholder="Select role"
                onItemSelected={(selected) => {
                  handleInputChange("userSelectedRole", selected);
                }}
              />
              {formData.userSelectedRole === "Provider" && (
                <DropdownComponent
                  items={[
                    "Hair Salon",
                    "Barbershop",
                    "Nail Salon",
                    "Skin Care Salon",
                  ]}
                  ref={userSelectedSalonTypeRef}
                  iconName="globe-outline"
                  value={formData.province}
                  onChangeText={(text) =>
                    handleInputChange("userSelectedRoleType", text)
                  }
                  placeholder="Select salon type"
                  onItemSelected={(selected) => {
                    handleInputChange("userSelectedRoleType", selected);
                  }}
                />
              )}
              <View style={{ marginTop: 16 }}>
                <TextAreaComponent
                  ref={userDescriptionRef}
                  onTextChange={(textDescr) =>
                    handleInputChange("description", textDescr)
                  }
                />
              </View>
              <View style={{ marginTop: 16 }}>
                <InputComponent
                  ref={passwordRef}
                  iconName="key-outline"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  placeholder="Password"
                  secureTextEntry
                  keyboardType={"default"}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />
              </View>
              <View style={{ marginTop: -16 }}>
                <InputComponent
                  ref={confirmPasswordRef}
                  iconName="key-outline"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  keyboardType={"default"}
                  placeholder="Confirm password"
                  secureTextEntry
                />
              </View>
              <ButtonComponent text="Next" onPress={handleNextStep} />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ height: Dimensions.get("screen").height }}>
            <Text style={[globalStyles.title, globalStyles.welcomeText]}>
              {TITLES.SIGN_UP_LOCATION}
            </Text>
            <Text
              style={[globalStyles.subtitle, { marginTop: tokens.spacing.md }]}
            >
              {SUBTITLES.SIGN_UP_SUBTITLE}
            </Text>
            <View>
              <InputComponent
                iconName="pin-outline"
                value={formData.location}
                onChangeText={(text) => {
                  handleInputChange("location", text);
                  setTimeout(() => {
                    fetchPlaceSuggestions(text); // Fetch places as user types
                  }, 5000);
                }}
                placeholder="Location"
                ref={locationRef}
                returnKeyType="next"
                onSubmitEditing={() => provinceRef.current?.focus()}
              />
              <Text style={[globalStyles.textAlignCenter,{marginBottom:12}]}>{selectedLocation}</Text>

              {/* Display the suggestions */}
              {suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        handlePlaceSelect(item.description);
                      }}
                    >
                      <Text>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <ButtonComponent text="Next" onPress={handleNextStep} />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={{ alignItems: "center" }}>
            {formData.profileImage ? (
              <>
                <Image
                  source={{ uri: formData.profileImage }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <View style={{ marginTop: 16, width: "100%" }}>
                  <ButtonComponent text="Next" onPress={handleNextStep} />
                </View>
              </>
            ) : (
              <View style={{ margin: tokens.spacing.lg, width: "100%" }}>
                <ButtonComponent
                  text={
                    !imageLoading ? "Select Profile Picture" : "Uploading..."
                  }
                  onPress={handleImageUpload}
                />
              </View>
            )}
            {imageLoading ? (
              <ButtonComponent text="Next" onPress={handleNextStep} />
            ) : null}
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={[globalStyles.title, globalStyles.welcomeText]}>
              {TITLES.SIGN_UP_AVAILABILITY}
            </Text>
            <Text
              style={[globalStyles.subtitle, { marginTop: tokens.spacing.md }]}
            >
              {SUBTITLES.SIGN_UP_SELECT_AVAILABILITY}
            </Text>
            <WeekdaySelector
              selectedDaysData={selectedDays}
              setSelectedDaysData={setSelectedDays}
            />
            <ButtonComponent
              text="Submit"
              onPress={() => {
                setFormData({ ...formData, availableDays: selectedDays });
                handleRegister();
              }}
            />
          </View>
        );
      default:
        return null;
    }
  };

  // Registration handler
  const handleRegister = async () => {
    console.log("Form Data Submitted: ", formData);
    await signUpAndUpdateUsersCollections();
    // Add registration logic (e.g., API call or Firebase integration)
  };

  return (
    <ImageBackground style={[globalStyles.backgroundImage,{backgroundColor:tokens.colors.background}]}>
      <TouchableOpacity
        style={{ zIndex: 1000000 }}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-left" style={styles.backIcon} size={20} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
            <View
              style={{
                height: "100%",
                padding: 18,
                marginTop: Dimensions.get("screen").height / 18,
                backgroundColor: "white",
              }}
            >
              {renderStepContent()}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = {
  backIcon: {
    color: tokens.colors.hairduMainColor,
    position: "absolute",
    top: 0,
    marginTop: 44,
    left: 0,
    marginLeft: 22,
  },
  suggestionItem: {
    padding: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
};
