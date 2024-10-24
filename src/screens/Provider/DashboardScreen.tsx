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
  fetchAppointmentsPending,
  fetchHairstylesFromFirestore,
  fetchUserFromFirestore,
  subscribeToFloraProviders,
} from "../../firebase/dbFunctions";
import tokens from "../../styles/tokens";
import CustomTabViewProvider from "../../components/CustomTopTabProvider";
import FAB from "../../components/FAB";

const ProviderDashboard = ({ navigation }) => {
  const {
    user,
    flowerProvidersData,
    setHairstylesData,
    hairstylesData,
    setAppointments,
  } = useContext(AuthContext);
  const [hairstylistUserData, setHairstylistUserData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false); // Track refreshing status
  const actions = [
    { iconName: "camera", label: "Camera", backgroundColor: "#f44336" },
    // { iconName: 'chatbubbles', label: 'Chat', backgroundColor: '#2196f3' },
    // { iconName: 'document', label: 'Docs', backgroundColor: '#4caf50' },
  ];
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

  // Function to fetch user type from the database
  const fetchUserTypeFromDatabase = async (uid: string): Promise<string> => {
    try {
      const userDoc = await fetchUserFromFirestore(uid);
      return userDoc?.selectedRoleValue ?? "Customer"; // Default to 'Customer' if no type is found
    } catch (error) {
      console.error("Error fetching user type from database:", error);
      return "Customer"; // Default to 'Customer' on error
    }
  };

  async function fetchPendingAppointments() {
    const fetchedUserType = await fetchUserTypeFromDatabase(user.uid);
    const userType = fetchedUserType === "Provider" ? "provider" : "customer";
    const fetchedAppointments = await fetchAppointmentsPending(
      user?.uid,
      userType
    );
    setAppointments(fetchedAppointments);
  }

  useEffect(() => {
    fetchData();
    fetchPendingAppointments();
  }, [user]);

  useEffect(() => {
    // Subscribe to the flowerProviders collection
    const unsubscribe = subscribeToFloraProviders(user.uid, (data) => {
      setHairstylistUserData(data[0]);
    });

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]); // Re-run the effect when `uid` changes

  function onAddCustomersImages(): void {
    navigation.navigate('AddCustomerImages')
  }

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
              {flowerProvidersData ? (
                <CircularProgressWithDetails
                  user={hairstylistUserData}
                  onRenewSubscription={() =>
                    navigation.navigate("Subscription")
                  }
                  onFinanceProjections={() =>
                    navigation.navigate("Projections")
                  }
                  onLinkMerchantAccount={() =>
                    navigation.navigate("MerchantSettings")
                  }
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
              {hairstylesData && flowerProvidersData ? (
                <CustomTabViewProvider
                  salonData={hairstylesData}
                  flowerProvidersDetails={flowerProvidersData[0]}
                  ratingData={undefined}
                  navigation={navigation}
                  isProvider={true}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
        <FAB pressChildButon={()=> onAddCustomersImages()} position={"bottomRight"} actions={actions} />
      </SafeAreaView>
    </View>
  );
};

export default ProviderDashboard;
