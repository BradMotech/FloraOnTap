import React, { useContext, useEffect, useState } from 'react';
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
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage'; // Firebase Storage
import { db, storage } from '../../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';;
import tokens from '../../styles/tokens';
import { AuthContext } from '../../auth/AuthContext';
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

const ProductEditScreen = ({ route, navigation }) => {
    const { showToast } = useToast()
  const { docId } = route.params; // Document ID passed via navigation
  const { user } = useContext(AuthContext); // Get current user context

  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Existing images in Firestore
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch the existing product data
    const fetchProductData = async () => {
      try {
        const docRef = doc(db, 'hairstyles', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.name);
          setPrice(data.price.toString());
          setDuration(data.duration);
          setCategory(data.serviceType);
          setExistingImages(data.images || []);
        } else {
          Alert.alert('Error', 'Product not found');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert('Error', 'Failed to fetch product data');
      }
    };

    fetchProductData();
  }, [docId]);

  const pickImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImages((prevImages) => [
          ...prevImages,
          { uri: result.assets[0].uri },
        ]);
      }
    } catch (error) {
      console.error("Error picking images: ", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const removeExistingImage = async (imageUrl) => {
    try {
      // Delete the image from Firebase storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // Remove the image from the existingImages array
      setExistingImages(existingImages.filter((image) => image.url !== imageUrl));
    } catch (error) {
      console.error("Error deleting image:", error);
      Alert.alert("Error", "Failed to delete image");
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
    if (!price || !duration || !category || (existingImages.length === 0 && selectedImages.length === 0)) {
      Alert.alert('Error', 'Please fill in all fields and upload at least one image');
      return;
    }

    try {
      setUploading(true);

      // Upload new images and get URLs
      const newImageUrls = await uploadImages();

      // Prepare the updated hairstyle data
      const updatedHairstyle = {
        name: title,
        serviceType: category,
        price: Number(price),
        duration,
        category,
        images: [...existingImages, ...newImageUrls], // Combine existing and new images
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      // Update the hairstyle document in Firestore
      const docRef = doc(db, 'hairstyles', docId);
      await updateDoc(docRef, updatedHairstyle);

    showToast("Hairstyle updated successfully","success","top")
      navigation.goBack(); // Navigate back or reset form
    } catch (error) {
      console.error(error);
      showToast("Failed to update hairstyle","danger","top")
    } finally {
      setUploading(false);
    }
  };

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.imageThumbnail} />
      <TouchableOpacity
        style={styles.removeImage}
        onPress={() => removeExistingImage(item.url)}
      >
        <Text style={styles.removeImageText}><Ionicons name='trash'/></Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Hairstyle</Text>

      {/* Select Images */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
      <Ionicons name="image" color={tokens.colors.inactive} size={55} />
        <Text style={styles.imagePickerText}>
        {selectedImages.length > 0 ? ' Add More Images' : ' Select Images'}
        </Text>
      </TouchableOpacity>

      {/* Display existing images */}
      {existingImages.length > 0 && (
        <FlatList
          data={existingImages}
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
          {uploading ? 'Updating...' : 'Update Hairstyle'}
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
  imageContainer: {
    position: 'relative',
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: tokens.colors.hairduMainColor,
    borderRadius: 12,
    padding: 2,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
  categorySelected: {
    backgroundColor: tokens.colors.hairduMainColor,
    borderColor: tokens.colors.hairduMainColor,
  },
  submitButton: {
    backgroundColor: tokens.colors.blackColor,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ProductEditScreen;
