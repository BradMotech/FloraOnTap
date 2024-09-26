import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For image selection
import { updateHairStylistPatrons, updateHairStylistProfileDetails, updateUserPatrons, updateUserProfileDetails, uploadImageToStorage } from '../firebase/dbFunctions'; // Separate Firestore logic
import globalStyles from '../styles/globalStyles';
import ButtonComponent from './buttonComponent';
import tokens from '../styles/tokens';
import { AuthContext } from '../auth/AuthContext';

const AddPatronScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [uid, setUid] = useState(''); // Unique ID for the stylist (e.g., Firebase UID)
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(AuthContext)

  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access the media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to add a new patron
  const addPatron = async () => {
    if (!name || !email || !uid || !specialty) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
  
    setLoading(true);
  
    try {
      const imageUrl = await uploadImageToStorage(imageUri, uid);
  
      const patronData = {
        name,
        email,
        imageUrl,
      };
  
      // Add the patron to both the Users and Hairstylists collections
      await updateUserPatrons(user.uid, patronData);
      await updateHairStylistPatrons(user.uid, patronData);
  
      Alert.alert('Success', `Successfully added patron to stylist ${name}.`);
    } catch (error) {
      console.error('Error adding patron:', error);
      Alert.alert('Error', 'Failed to add patron. Please try again.');
    } finally {
      setLoading(false);
      setName('');
      setEmail('');
      setSpecialty('');
      setUid('');
      setImageUri(null);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={globalStyles.separatorNoColor}></View>

      {/* Image Picker Section */}
      <ButtonComponent textColor={tokens.colors.barkInspiredTextColor} buttonColor={tokens.colors.barkInspiredColor}
        onPress={pickImage}
        text={imageUri ? "Change Image" : "Pick Image"}
      ></ButtonComponent>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}


      <TextInput
        style={globalStyles.inputContainer}
        placeholder="Stylist Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={globalStyles.inputContainer}
        placeholder="Stylist Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.inputContainer}
        placeholder="Stylist UID"
        value={uid}
        onChangeText={setUid}
      />
      <TextInput
        style={globalStyles.inputContainer}
        placeholder="Specialty (e.g., Braiding, Coloring)"
        value={specialty}
        onChangeText={setSpecialty}
      />

      <ButtonComponent
        text={loading ? "Adding..." : "Add Stylist"}
        onPress={addPatron}
        // disabled={loading}
      ></ButtonComponent>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}
    </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imagePicker: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop:16
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPatronScreen;
