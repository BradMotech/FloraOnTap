import React, { useContext } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CustomTabView from "../../components/CustomTopTab";
import tokens from "../../styles/tokens";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../auth/AuthContext";
import globalStyles from "../../styles/globalStyles";

const FlowerShopDetails = ({ navigation }) => {
  const { hairstylesData } = useContext(AuthContext);
  const route = useRoute();
  const { hairStylistDetails }: any = route.params;

  return (
    <SafeAreaView
      style={[globalStyles.safeArea, { marginTop: tokens.spacing.lg * 2.5 }]}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <CustomTabView
          salonData={hairstylesData}
          ratingData={undefined}
          navigation={navigation}
          flowerProvidersDetails={hairStylistDetails}
          isProvider={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default FlowerShopDetails;
