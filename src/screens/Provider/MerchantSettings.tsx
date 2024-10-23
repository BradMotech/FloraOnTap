import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import globalStyles from "../../styles/globalStyles"; // Assuming you have a globalStyles file
import tokens from "../../styles/tokens";
import ButtonComponent from "../../components/buttonComponent";
import { useToast } from "../../components/ToastContext";
import { updateFloristMerchantDetails, updateUserMerchantDetails } from "../../firebase/dbFunctions";
import { AuthContext } from "../../auth/AuthContext";

const merchants = [
  {
    uri: "https://yt3.googleusercontent.com/K8_B6rbDD1NYtoRiCdbLdgekRZQtkCD6RZ5TuhRnPqveg6ErTez1Ivqwlc1iUGx0FFgE9BvX=s900-c-k-c0x00ffffff-no-rj",
    label: "Payfast",
  },
  {
    uri: "https://play-lh.googleusercontent.com/Gd-RI90mEWyeQu-E3XLF-Bx35kz0DxHKYdz880Kv8ea9H2acyKtTUvJhQlBmMGRpEic",
    label: "YOCO",
  },
  {
    uri: "https://store-images.s-microsoft.com/image/apps.8453.13655054093851568.4a371b72-2ce8-4bdb-9d83-be49894d3fa0.7f3687b9-847d-4f86-bb5c-c73259e2b38e?h=210",
    label: "Whatsapp",
  },
  // Add more merchants as needed
];

const MerchantSettings = ({navigation}) => {
    const { user, flowerProvidersData, setHairstylesData, hairstylesData } =
    useContext(AuthContext); // Get current hairstylist (user) context
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [merchantKey, setMerchantKey] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const handleMerchantSelect = (merchantLabel) => {
    setSelectedMerchant(merchantLabel);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
       await handleUpdateMerchantDetails()
    } catch (error) {
        showToast("Merchant details linked successfully", "success", "top");
    }
    // Handle the form submission
  };

  async function handleUpdateMerchantDetails(){
    const merchantDetails = {
        merchantId: selectedMerchant !== 'Whatsapp' ? merchantId : '',
        merchantKey: selectedMerchant !== 'Whatsapp' ? merchantKey : '',
        paymentType: selectedMerchant,
    }
    updateFloristMerchantDetails(user?.uid,merchantDetails);
    updateUserMerchantDetails(user?.uid,merchantDetails).then(()=>{
        setIsLoading(false);
        showToast("Merchant details linked successfully", "success", "top");
        navigation.goBack();
    });
  }

  const getBackgroundColor = (merchantLabel) => {
    switch (merchantLabel) {
      case "YOCO":
        return "#01a9e0";
      case "Payfast":
        return "#fff";
      case "Whatsapp":
        return "#24d366";
      default:
        return "#f0f0f0"; // Default background color if no match
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={globalStyles.container}>
          <Text style={[globalStyles.title, styles.title]}>
            Select your desired Payment system
          </Text>
          <Text
            style={[
              globalStyles.subtitle,
              {
                marginTop: tokens.spacing.md,
                marginBottom: tokens.spacing.md,
                width: Dimensions.get("screen").width - 50,
              },
            ]}
          >
            {
              "Your merchant key and ID will be securely encrypted to ensure your data's safety. If you prefer to share payment links directly via WhatsApp, please select the WhatsApp option."
            }
          </Text>
          {/* Horizontal Scrollable Merchant Cards */}
          <View style={{ height: 100, width: "100%" }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.merchantContainer}
            >
              {merchants.map((merchant, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.merchantCard,
                    selectedMerchant === merchant.label && styles.selectedCard,
                    { backgroundColor: getBackgroundColor(merchant.label) },
                  ]}
                  onPress={() => handleMerchantSelect(merchant.label)}
                >
                  <Image
                    source={{ uri: merchant.uri }}
                    style={styles.merchantImage}
                  />
                  {/* <Text style={styles.merchantLabel}>{merchant.label}</Text> */}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Inputs for Merchant Key and Merchant ID */}
          {selectedMerchant !== "Whatsapp" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Merchant Key"
                value={merchantKey}
                onChangeText={setMerchantKey}
              />
              <TextInput
                style={styles.input}
                placeholder="Merchant ID"
                value={merchantId}
                onChangeText={setMerchantId}
              />
            </>
          )}

          {/* Submit Button */}
          {selectedMerchant && (
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                marginTop: 16,
              }}
            >
              <ButtonComponent
                text={
                  isLoading ? "Linking Merchant..." : "Link Merchant Details"
                }
                onPress={handleSubmit}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    textAlign: "center",
  },
  merchantContainer: {
    paddingHorizontal: 45,
    alignItems: "flex-start",
    width: Dimensions.get("screen").width - 100,
  },
  merchantCard: {
    height: 70,
    width: 70,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "white",
  },
  selectedCard: {
    borderColor: tokens.colors.skyBlueColor,
    backgroundColor: "white",
  },
  merchantImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    marginTop: 2,
  },
  merchantLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  input: {
    borderWidth: 0.4,
    borderColor: "gray",
    backgroundColor: tokens.colors.background,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: Dimensions.get("screen").width - 100,
  },
});

export default MerchantSettings;
