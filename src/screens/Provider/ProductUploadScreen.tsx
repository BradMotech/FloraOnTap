import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // To handle image picking
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; // Firebase Storage
import { db, storage } from '../../firebase/firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../auth/AuthContext';
import tokens from '../../styles/tokens';
import { Ionicons } from '@expo/vector-icons'; 
import { useToast } from '../../components/ToastContext';
import globalStyles from '../../styles/globalStyles';

const CATEGORIES = [
  'Braids',
  'Straightback',
  'Faux Locs',
  'Cornrows',
  'Dreadlocks',
  // Add more categories as needed
];

const ProductUploadScreen = ({ navigation }) => {
    const { showToast } = useToast()
  const [selectedImages, setSelectedImages] = useState([]);
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const { user } = useContext(AuthContext); // Get current hairstylist (user) context

  const pickImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false, // Disabling multi-select for now
        quality: 1,
      });
  
      if (!result.canceled) {
        setSelectedImages((prevImages) => [
          ...prevImages,
          { uri: result.assets[0].uri }, // Add the newly selected image to the list
        ]);
      }
    } catch (error) {
      console.error("Error picking images: ", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const uploadImages = async () => {
    const uploadedImageUrls = [];

    for (const image of selectedImages) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `hairstyleImages/${user.uid}/${Date.now()}_${image.uri}`);
      const uploadTask = uploadBytesResumable(imageRef, blob);

      // Wait for upload completion
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedImageUrls.push({ url: downloadUrl });
            resolve();
          }
        );
      });
    }

    return uploadedImageUrls;
  };

  const handleSubmit = async () => {
    if (!price || !duration || !category || selectedImages.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one image');
      return;
    }
  
    try {
      setUploading(true);
      
      // Upload images and get URLs
      const imageUrls = await uploadImages();
  
      // Create a new hairstyle object without the id for now
      const newHairstyle = {
        name: title,
        description: title,
        serviceType: category,
        price: Number(price),
        duration,
        category,
        user: {
          id: user.uid,
          email: user.email, // Assuming you want to add email too
        },
        hairstylistId: user.uid,
        images: imageUrls,
        createdAt: new Date(),
      };
  
      // Add the new hairstyle to the Firestore and get the document reference
      const docRef = await addDoc(collection(db, 'hairstyles'), newHairstyle);
  
      // Update the document with its ID
      await updateDoc(docRef, { Id: docRef.id, id: docRef.id });
  
      showToast('Hairstyle uploaded successfully!','success',"top");
      navigation.goBack(); // Navigate back or reset form
    } catch (error) {
      console.error(error);
    //   Alert.alert('Error', 'Failed to upload hairstyle');
      showToast('Failed to upload hairstyle','danger',"top");
    } finally {
      setUploading(false);
    }
  };
  

  const renderImage = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
  );

  return (
    <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Hairstyle</Text>

      {/* Select Multiple Images */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
      <Ionicons name="image" color={tokens.colors.inactive} size={55} />
        <Text style={styles.imagePickerText}>
        {selectedImages.length > 0 ? ' Add More Images' : ' Select Images'}
        </Text>
      </TouchableOpacity>

      {/* Display selected images in a FlatList */}
      {selectedImages.length > 0 && (
        <FlatList
          data={selectedImages}
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
        />
      )}

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
      />

      {/* Price Input */}
      <TextInput
        style={styles.input}
        placeholder="Price (Rands)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Duration Input */}
      <TextInput
        style={styles.input}
        placeholder="Duration (e.g. 2 hours)"
        value={duration}
        onChangeText={setDuration}
      />

      {/* Category Selection */}
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CATEGORIES.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              category === item && styles.categorySelected,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, uploading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {uploading ? 'Uploading...' : 'Submit Hairstyle'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePicker: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width:Dimensions.get('screen').width / 2.5,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  imagePickerText: {
    color: tokens.colors.hairduTextColorGreen,
    textAlign: 'center',
    fontSize: 16,
    justifyContent:'center',
    alignItems:'center'
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderWidth: 0.3,
    borderColor:tokens.colors.inactive,
    borderRadius: tokens.borderRadius.small,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.sm,
    marginVertical: tokens.spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categorySelected: {
    backgroundColor: tokens.colors.hairduMainColor,
  },
  categoryText: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: tokens.colors.blackColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductUploadScreen;
