import React, { useContext, useEffect } from "react";
import { View, Text, ScrollView, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import globalStyles from "../../styles/globalStyles";
import Header from "../../components/header";
import CircularProgressWithDetails from "../../components/CircularProgressWithDetails";
import { AuthContext } from "../../auth/AuthContext";
import {
  fetchHairstylesFromFirestore,
  fetchUserFromFirestore,
} from "../../firebase/dbFunctions";
import SearchComponent from "../../components/SearchComponent";
import { formatDate } from "../../utils/dateFormat";
import ProductItemCard from "../../components/ProductItem";
import CustomTabView from "../../components/CustomTopTab";
import tokens from "../../styles/tokens";
import { useToast } from "../../components/ToastContext";
import CustomTabViewProvider from "../../components/CustomTopTabProvider";
import ButtonComponent from "../../components/buttonComponent";

const ProviderDashboard = ({ navigation }) => {
  const {
    signIn,
    setUserType,
    userType,
    user,
    hairstylistsData,
    setHairstylesData,
    hairstylesData,
  } = useContext(AuthContext);
  const { showToast } = useToast();
  useEffect(() => {
    fetchUserFromFirestore(user.uid)
      .then((userdata) => {
        setHairstylesData(userdata);
      })
      .catch(() => {});

    fetchHairstylesFromFirestore(user.uid).then((hairStyles) => {
      setHairstylesData(hairStyles);
    });
  }, [user]);

  return (
    <View>
    <StatusBar hidden={true} />
    <SafeAreaView style={{ marginTop: tokens.spacing.xs * 0.5 }}>
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={{ flex: 1 }}>
          <View>
            {hairstylistsData ? (
              <CircularProgressWithDetails user={hairstylistsData[0]} />
            ) : null}
          </View>

          <View style={globalStyles.separatorNoColor}></View>
          <View
            style={{ flex: 1, marginTop: tokens.spacing.xs * 2, width: "100%" }}
          >
            <View style={{marginBottom:6}}>
            <ButtonComponent onPress={() => navigation.navigate('AddProduct')} text={"Upload Portfolio"}/>
            </View>
            {hairstylesData && hairstylistsData ? (
              <CustomTabViewProvider
                salonData={hairstylesData}
                salonDetails={hairstylistsData[0]}
                ratingData={undefined}
                navigation={navigation}
                isProvider={true}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
};

export default ProviderDashboard;
