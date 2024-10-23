import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // For image picking
import globalStyles from "../styles/globalStyles";
import ButtonComponent from "./buttonComponent";
import TextAreaComponent from "./TextAreaComponent";
import tokens from "../styles/tokens";

const ProfileEdit = ({ data, isProvider, navigation, onPress,handleClose }) => {
  // State for editable fields
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [province, setProvince] = useState(data.province);
  const [description, setDescription] = useState(data.description);

  // State for image uploads
  const [profileImage, setProfileImage] = useState(data.image || null);
  const [bannerImage, setBannerImage] = useState(data.bannerImage || null);

  // Image picker handler
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    const updatedData = {
      name,
      email,
      phone,
      province,
      description,
      image: profileImage, // Include the profile image if necessary
      bannerImage, // Include the banner image if necessary
    };

    // Call the onPress prop with the updated data
    onPress(updatedData);
  };

  return (
    <View>
      {/* Banner Image */}
      {bannerImage ? (
         <TouchableOpacity onPress={() => pickImage(setBannerImage)}>
        <Image
          source={{ uri: bannerImage }}
          style={{ width: "100%", height: 200, borderRadius: 12 }}
        />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => pickImage(setBannerImage)}>
          <View
            style={{
              backgroundColor: "#ccc",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Upload Banner Image</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Profile Details */}
      <View style={{ width: Dimensions.get("screen").width - 22, marginTop:17 }}>
        <View>
          {/* Profile Image */}
          <TouchableOpacity onPress={() => pickImage(setProfileImage)}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ height: 80, width: 80, borderRadius: 40 }}
              />
            ) : (
              <View
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Editable Details */}
          <View style={{marginTop:16}}>
            <Text>Name:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={globalStyles.inputContainer}
            />

            <Text>Email:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={globalStyles.inputContainer}
            />

            <Text>Phone:</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={globalStyles.inputContainer}
            />

            <Text>Province:</Text>
            <TextInput
              value={province}
              onChangeText={setProvince}
              style={globalStyles.inputContainer}
            />

            <Text style={{ marginBottom: 16 }}>Description:</Text>
            <TextAreaComponent
              textValue={description}
              onTextChange={setDescription}
            />
          </View>
        </View>

        {/* Update Button */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: tokens.spacing.lg,
          }}
        >
          <View style={{ width: Dimensions.get("screen").width / 2.3 }}>
            <ButtonComponent
              onPress={handleProfileUpdate}
              text={"Update profile"}
            />
          </View>
          <View style={{ width: Dimensions.get("screen").width / 2.3 }}>
            <ButtonComponent
              buttonColor={tokens.colors.error}
              onPress={handleClose}
              text={"Cancel"}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileEdit;
