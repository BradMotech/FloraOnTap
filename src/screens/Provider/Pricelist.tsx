import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import tokens from "../../styles/tokens";
import PayFastModal from "../../components/PayFastModal";
import { formatToRands } from "../../utils/currencyUtil";
import { SubscribeToPlanForUserAndHairstylist } from "../../firebase/dbFunctions";
import { AuthContext } from "../../auth/AuthContext";

export const PRICINGOPTIONS = [
  {
    id: 0,
    name: "Basic Plan - 10% off",
    price: 439.99,
    credits:20,
    features: [
      "20 credits pack",
      "4 Flora orders",
      "100MB Gallery Storage",
      "Basic Support",
    ],
  },
  {
    id: 1,
    name: "Starter Plan - 15% off",
    price: 839.99,
    credits:40,
    features: [
      "40 credits pack",
      "8 Flora orders",
      "1GB Gallery Storage",
      "Priority Support",
    ],
  },
  {
    id: 2,
    name: "Business Plan - 20% off",
    price: 1499.99,
    credits:80,
    features: [
      "80 credits pack",
      "16 Flora orders",
      "Chat system to manage appointment follow ups",
      "Financial projections",
      "Unlimited Gallery Storage",
      "Dedicated Support",
    ],
  },
];

const PriceList = () => {
  const { user } = useContext(AuthContext);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const paymentData = {
    merchant_id: "15553273",
    merchant_key: "y20wnrvfcrbsk",
    return_url: "https://google.com",
    cancel_url: "https://google.com",
    notify_url: "https://google.com",
    email_address: "brad@motech.dev",
    name_first: "bradley",
    name_last: "mamanyoha",
    amount: PRICINGOPTIONS[selectedPlan]?.price.toString(),
    m_payment_id: "000001",
    item_name: PRICINGOPTIONS[selectedPlan]?.name.toString(),
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    updateSubscriptionPlan()
  };

 const updateSubscriptionPlan = async () => {
   await SubscribeToPlanForUserAndHairstylist(
     user.uid,
     PRICINGOPTIONS[selectedPlan].credits,
     PRICINGOPTIONS[selectedPlan].name
   );
 };

  const handleSelectPlan = (id: number) => {
    setSelectedPlan(id);
    console.warn(PRICINGOPTIONS[id])
  };

  const renderPlan = ({ item }: { item: (typeof PRICINGOPTIONS)[0] }) => (
    <TouchableOpacity
      style={[
        styles.planContainer,
        selectedPlan === item.id ? styles.selectedPlan : null,
      ]}
      onPress={() => handleSelectPlan(item.id)}
    >
      <Text style={styles.planTitle}>{item.name}</Text>
      <Text style={styles.planPrice}>{formatToRands(item.price)}</Text>
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <Text key={index} style={styles.featureText}>
            • {feature}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
    <View style={styles.container}>
      <FlatList
        data={PRICINGOPTIONS.slice(0, 3)} // Limit to first 3 options
        renderItem={renderPlan}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      {selectedPlan !== null && (
        <>
          <Text style={styles.selectedText}>
            Selected Plan: {PRICINGOPTIONS[selectedPlan].name}
          </Text>
          <TouchableOpacity
            onPress={() => openModal()}
            style={[
              globalStyles.button,
              {
                width: "auto",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 16,
              },
            ]}
          >
            <Text style={{ color: tokens.colors.background }}>Proceed</Text>
          </TouchableOpacity>
        </>
      )}
      <PayFastModal
        isVisible={modalVisible}
        onClose={closeModal}
        paymentData={paymentData}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    paddingVertical: 10,
  },
  planContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  selectedPlan: {
    borderColor: "#007AFF",
    backgroundColor: "#e7f3ff",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 5,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
});

export default PriceList;
