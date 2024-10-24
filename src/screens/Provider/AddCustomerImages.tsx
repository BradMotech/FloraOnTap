import React, { useContext, useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // To handle image picking
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; // Firebase Storage
import { db, storage } from "../../firebase/firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { AuthContext } from "../../auth/AuthContext";
import tokens from "../../styles/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "../../components/ToastContext";
import globalStyles from "../../styles/globalStyles";
import { fetchHairstylesFromFirestore } from "../../firebase/dbFunctions";
import TextAreaComponent from "../../components/TextAreaComponent";

// Update CATEGORIES with credit value
const CATEGORIES = [
  { name: "Roses", creditValue: 20 }, // Major
  { name: "Tulips", creditValue: 15 }, // Minor
  { name: "Lilies", creditValue: 25 }, // Major
  { name: "Daisies", creditValue: 10 }, // Minor
  { name: "Sunflowers", creditValue: 18 }, // Major
  { name: "Orchids", creditValue: 30 }, // Major
  { name: "Hydrangeas", creditValue: 22 }, // Major
  { name: "Peonies", creditValue: 28 }, // Major
  { name: "Carnations", creditValue: 12 }, // Minor
  { name: "Chrysanthemums", creditValue: 15 }, // Minor
  { name: "Gardenias", creditValue: 26 }, // Major
  { name: "Iris", creditValue: 20 }, // Major
  { name: "Lavender", creditValue: 18 }, // Major
  { name: "Daffodils", creditValue: 12 }, // Minor
  { name: "Geraniums", creditValue: 16 }, // Minor
  { name: "Marigolds", creditValue: 10 }, // Minor
  { name: "Petunias", creditValue: 12 }, // Minor
  { name: "Begonias", creditValue: 15 }, // Minor
  { name: "Violets", creditValue: 10 }, // Minor
  { name: "Snapdragons", creditValue: 20 }, // Major
  { name: "Hibiscus", creditValue: 22 }, // Major
  { name: "Anemones", creditValue: 18 }, // Major
  { name: "Azaleas", creditValue: 25 }, // Major
  { name: "Camellias", creditValue: 28 }, // Major
  { name: "Ranunculus", creditValue: 24 }, // Major
  { name: "Bluebells", creditValue: 16 }, // Minor
  { name: "Clematis", creditValue: 22 }, // Major
  { name: "Freesias", creditValue: 18 }, // Major
  { name: "Hellebores", creditValue: 20 }, // Major
  { name: "Pansies", creditValue: 10 }, // Minor
  { name: "Zinnias", creditValue: 12 }, // Minor
  { name: "Calendulas", creditValue: 14 }, // Minor
  { name: "Cosmos", creditValue: 15 }, // Minor
  { name: "Sweet Peas", creditValue: 16 }, // Minor
  { name: "Foxgloves", creditValue: 18 }, // Major
  { name: "Amaryllis", creditValue: 25 }, // Major
  { name: "Poppies", creditValue: 20 }, // Major
  { name: "Delphiniums", creditValue: 22 }, // Major
  { name: "Dahlias", creditValue: 30 }, // Major
  { name: "Gladiolus", creditValue: 18 }, // Major
  { name: "Morning Glories", creditValue: 15 }, // Minor
  { name: "Primroses", creditValue: 10 }, // Minor
];

const STOCK_STATUS = ["In Stock", "Out of Stock"]; // Stock status options

const AddCustomersImages = ({ navigation }) => {
  const { showToast } = useToast();
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [stockStatus, setStockStatus] = useState(""); // Selected stock status

  const { user, flowerProvidersData, setHairstylesData, hairstylesData } =
    useContext(AuthContext); // Get current hairstylist (user) context
  // Function to fetch data
  const fetchData = async () => {
    try {
      const hairStyles = await fetchHairstylesFromFirestore(user.uid);
      setHairstylesData(hairStyles);

      // if (hairstylistUserData === null) {
      //   const userdata = await fetchUserFromFirestore(user.uid);
      //   setHairstylesData(userdata);
      // }
    } catch (error) {
      console.error(error);
    }
  };
  const pickImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false, // Disabling multi-select for now
        quality: 0.5,
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
      const imageRef = ref(
        storage,
        `hairstyleImages/${user.uid}/${Date.now()}_${image.uri}`
      );
      const uploadTask = uploadBytesResumable(imageRef, blob);

      // Wait for upload completion
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
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
    // if (!description || selectedImages.length === 0) {
    //   Alert.alert(
    //     "Error",
    //     "Please fill in all fields and select at least one image"
    //   );
    //   return;
    // }

    // Get the credit value based on the selected category
    const selectedCategory = CATEGORIES.find((cat) => cat.name === category);
    const creditValue = selectedCategory ? selectedCategory.creditValue : 0; // Default to 0 if category not found

    try {
      setUploading(true);

      // Upload images and get URLs
      const imageUrls = await uploadImages();

      // Create a new hairstyle object without the id for now
      const customerImages = {
        description: description,
        user: {
          id: user.uid,
          email: user.email, // Assuming you want to add email too
        },
        floristId: user.uid,
        images: imageUrls,
        createdAt: new Date(),
      };

      // Add the new customer images to the Firestore and get the document reference
      const docRef = await addDoc(collection(db, "CustomerImages"), customerImages);

      // Update the document with its ID
      await updateDoc(docRef, { Id: docRef.id, id: docRef.id });

      showToast("Images uploaded successfully!", "success", "top");
      fetchData();
      navigation.goBack(); // Navigate back or reset form
    } catch (error) {
      console.error(error);
      showToast("Failed to upload item", "danger", "top");
    } finally {
      setUploading(false);
    }
  };

  const renderImage = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
  );

  return (
    <SafeAreaView
      style={[globalStyles.safeArea, { marginTop: tokens.spacing.lg * 2.4 }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>Upload Portfolio Item</Text> */}
        <Text
          style={[
            globalStyles.subtitle,
            { marginTop: tokens.spacing.md, marginBottom: tokens.spacing.md },
          ]}
        >
          {
            "Please provide the details of your flora item below. Ensure that images, price, category (for easier filtering and search), and stock status are all included. All fields are mandatory for submission."
          }
        </Text>
        {/* Select Multiple Images */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
          <Ionicons name="image" color={tokens.colors.inactive} size={55} />
          <Text style={styles.imagePickerText}>
            {selectedImages.length > 0 ? " Add More Images" : " Select Images"}
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

        {/* Description Input */}
        <View style={{marginTop:18}}>
        <TextAreaComponent onTextChange={(e)=>setDescription(e)} textValue={undefined}        />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, uploading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          <Text style={styles.submitButtonText}>
            {uploading ? "Uploading..." : "Submit item"}
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  imagePicker: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: Dimensions.get("screen").width / 2.5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  imagePickerText: {
    color: tokens.colors.hairduTextColorGreen,
    textAlign: "center",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
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
    borderColor: tokens.colors.inactive,
    borderRadius: tokens.borderRadius.small,
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.sm,
    marginVertical: tokens.spacing.sm,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "600",
  },
  // label: {
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginBottom: 10,
  // },
  categoryButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: tokens.colors.inactive,
    marginRight: 10,
  },
  categorySelected: {
    backgroundColor: tokens.colors.hairduTextColorGreen,
  },
  categoryText: {
    fontSize: 16,
    color: tokens.colors.barkInspiredTextColor,
  },
  submitButton: {
    backgroundColor: tokens.colors.floraOnTapMainColor,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: tokens.colors.inactive,
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  badgeSelected: {
    backgroundColor: "#47BF9C",
    color: "#fff",
  },
});

export default AddCustomersImages;
