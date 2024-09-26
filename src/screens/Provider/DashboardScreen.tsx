import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import CircularProgressWithDetails from "../../components/CircularProgressWithDetails";
import { AuthContext } from "../../auth/AuthContext";
import {
  fetchHairstylesFromFirestore,
  fetchUserFromFirestore,
  subscribeToHairstylists,
} from "../../firebase/dbFunctions";
import tokens from "../../styles/tokens";
import CustomTabViewProvider from "../../components/CustomTopTabProvider";

const ProviderDashboard = ({ navigation }) => {
  const { user, hairstylistsData, setHairstylesData, hairstylesData } = useContext(AuthContext);
  const [hairstylistUserData, setHairstylistUserData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false); // Track refreshing status

  // Function to fetch data
  const fetchData = async () => {
    try {
      const hairStyles = await fetchHairstylesFromFirestore(user.uid);
      setHairstylesData(hairStyles);

      if (hairstylistUserData === null) {
        const userdata = await fetchUserFromFirestore(user.uid);
        setHairstylesData(userdata);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Refresh data on pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    // Subscribe to the hairstylists collection
    const unsubscribe = subscribeToHairstylists(user.uid, (data) => {
      setHairstylistUserData(data[0]);
    });

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]); // Re-run the effect when `uid` changes

  return (
    <View>
      <StatusBar hidden={true} />
      <SafeAreaView style={{ marginTop: tokens.spacing.lg * 2.5 }}>
        <ScrollView
          contentContainerStyle={globalStyles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ flex: 1 }}>
            <View>
              {hairstylistsData ? (
                <CircularProgressWithDetails
                  user={hairstylistUserData}
                  onRenewSubscription={() => navigation.navigate("Subscription")}
                  onFinanceProjections={() => navigation.navigate("Projections")}
                />
              ) : null}
            </View>

            <View style={globalStyles.separatorNoColor}></View>
            <View
              style={{
                flex: 1,
                marginTop: tokens.spacing.xs * 2,
                width: "100%",
              }}
            >
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
