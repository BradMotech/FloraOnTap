import React, { useState, useRef } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import ContainerCard from "../components/ContainerCard";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";
import InputComponent from "../components/InputComponent"; // Import InputComponent
import ButtonComponent from "../components/buttonComponent"; // Custom ButtonComponent
import { SUBTITLES, TITLES } from "../utils/Constants/constantTexts";
import * as ImagePicker from 'expo-image-picker';
import DropdownComponent from "../components/DropdownComponent";
import WeekdaySelector from "../components/WeekDaySelector";
import { signUp } from "../firebase/authFunctions";
import { setHairstylistInFirestore, setUserInFirestore, uploadImageToFirebase } from "../firebase/dbFunctions";
import { useToast } from "../components/ToastContext";

const SignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Step state to manage form steps
  const [selectedDays, setSelectedDays] = useState([]);
  const { showToast } = useToast();
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
    userSelectedRole:""
  });

  // Input references
  const surnameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const locationRef = useRef(null);
  const provinceRef = useRef(null);
  const userSelectedRoleRef = useRef(null);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleWeekdayChange = (days) => {
    setFormData((prevData) => ({ ...prevData, availability: days }));
  };

  // Image picker handler
  const handleImageUpload = async () => {
    try {
      // Request permission to access the gallery
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("Permission denied - You need to give permission to access the gallery.",'danger','top')
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

        showToast("Image uploaded successfully!",'success','top')
      } else {
        showToast("Image upload canceled!",'danger','top')
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      showToast("Image upload failed!"+ error.message,'danger','top')
    }
  };

  async function loginAndUpdateUsersCollections() {
    try {
        const data = await signUp(formData.email, formData.password);

        if (data?.user) { // Check if there's a valid user in the response
          const { uid } = data.user; // Get the user's UID from Firebase

          // Prepare the user data to save in Firestore
          const userData = {
            email: formData.email,
            selectedRoleValue: formData.userSelectedRole,
            description: formData.userSelectedRole,
            id: uid,
            image: formData.profileImage,
            username: "@"+formData.name + "_"+formData.surname,
            name: formData.name,
            surname: formData.surname,
            province: formData.province,
            createdAt: new Date(),
            availability:formData.availability ? formData.availability : [],
            services: [],
            website: "",
            twitter: "",
            instagram: "",
            totalCredits: "30",
            creditsLeft: "30",
            subscriptionPlan: "Free Trial",
          };

          // Add the user to the Firestore Users collection
          await setUserInFirestore(uid, userData);

          if(formData.userSelectedRole === "Provider"){
            await setHairstylistInFirestore(uid, userData)
          }
        //   alert("Registration successful");
          navigation.navigate('Login');
          setStep(step + 1); // Only increment if registration and Firestore update are successful
        } else {
            
          Alert.alert("Error", "Registration failed. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error message", error.message); // Handle any errors
      }
}

  const handleNextStep = async () => {
    // alert(step+formData.userSelectedRole)
    if (step === 3 && formData.userSelectedRole !== "Provider") {
        alert("comes here and should not")
    //   Alert.alert(
    //     "Role Restriction",
    //     "Only providers can proceed to set availability."
    //   );
    await loginAndUpdateUsersCollections();
    } else {
        if(step === 3 && formData.userSelectedRole === "Provider"){
            alert("comes here and should")
            setStep(step + 1);
            // await loginAndUpdateUsersCollections();
        }
        else if(step === 4){
            alert("yeeeee")
            await loginAndUpdateUsersCollections();
      }
      else if(step === 1){
        setStep(step + 1);
      }else if(step == 2){
        setStep(step + 1);
      }
    }
  };


  // Render step-wise content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={{height:Dimensions.get('screen').height-130}}>
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
              <InputComponent
                ref={surnameRef}
                iconName="person-outline"
                value={formData.surname}
                onChangeText={(text) => handleInputChange("surname", text)}
                placeholder="Surname"
                keyboardType={"default"}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
              <InputComponent
                ref={emailRef}
                iconName="mail-outline"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                placeholder="Email address"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />
              <InputComponent
                ref={phoneRef}
                iconName="call-outline"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                keyboardType="phone-pad"
                placeholder="Phone"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <DropdownComponent
                items={[
                  "Customer",
                  "Provider",
                ]}
                ref={userSelectedRoleRef}
                iconName="globe-outline"
                value={formData.province}
                onChangeText={(text) => handleInputChange("userSelectedRole", text)}
                placeholder="Select role"
                onItemSelected={(selected)=>{ handleInputChange("userSelectedRole", selected)}}
              />
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
              <ButtonComponent text="Next" onPress={handleNextStep} />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
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
                onChangeText={(text) => handleInputChange("location", text)}
                placeholder="Location"
                ref={locationRef}
                returnKeyType="next"
                onSubmitEditing={() => provinceRef.current?.focus()}
              />
              <DropdownComponent
                items={[
                  "Eastern Cape",
                  "Free State",
                  "Gauteng",
                  "KwaZulu-Natal",
                  "Limpopo",
                  "Mpumalanga",
                  "Northern Cape",
                  "North West",
                  "Western Cape",
                ]}
                ref={provinceRef}
                iconName="globe-outline"
                value={formData.province}
                onChangeText={(text) => handleInputChange("province", text)}
                placeholder="Province"
              />
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
              <View style={{marginTop:16,width:'100%'}}>
               <ButtonComponent text="Next" onPress={handleNextStep} />
              </View>
                </>
            ) : (
              <View style={{ margin: tokens.spacing.lg, width: "100%" }}>
                <ButtonComponent
                  text="Select Profile Picture"
                  onPress={handleImageUpload}
                />
              </View>
            )}
            {!formData.profileImage ? (
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
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
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
    await loginAndUpdateUsersCollections();
    // Add registration logic (e.g., API call or Firebase integration)
  };

  return (
<ImageBackground
      source={{ uri: 'https://hairdu2024.web.app/hairdubraidsbackground3.png' }}
      style={globalStyles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={globalStyles.container}>
              <Icon
                onPress={() => navigation.goBack()}
                name="chevron-left"
                style={styles.backIcon}
                size={20}
              />
              <ContainerCard>{renderStepContent()}</ContainerCard>
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
};

