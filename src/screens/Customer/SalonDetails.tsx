import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import CustomTabView from "../../components/CustomTopTab";
import tokens from "../../styles/tokens";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../auth/AuthContext";

const SalonDetails = ({ navigation }) => {
  const { hairstylesData } = useContext(AuthContext);
  const route = useRoute();
  const { hairStylistDetails } = route.params;

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <CustomTabView
              salonData={hairstylesData}
              ratingData={undefined}
              navigation={navigation}
              salonDetails={hairStylistDetails} isProvider={false}      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SalonDetails;
