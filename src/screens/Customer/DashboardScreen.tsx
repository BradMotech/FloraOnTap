import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, SafeAreaView,StatusBar } from "react-native";
import globalStyles from "../../styles/globalStyles";
import { AuthContext } from "../../auth/AuthContext";
import StoryItem from "../../components/StoryItem";
import SearchComponent from "../../components/SearchComponent";
import LoadingScreen from "../../components/LoadingScreen";
import ProductItemCard from "../../components/ProductItem";
import tokens from "../../styles/tokens";
import { formatDate } from "../../utils/dateFormat";
import {
  fetchHairstylesFromFirestore,
  fetchHairstylistsFromFirestore,
  fetchUserFromFirestore,
} from "../../firebase/dbFunctions";
import SalonItemCard from "../../components/SalonItem";

const DashboardScreen = ({ navigation }) => {
  const { hairstylistsData, setHairstylesData, setHairstylistsData } =
    useContext(AuthContext);
     // State to hold the filtered data
  const [filteredData, setFilteredData] = useState(hairstylistsData || []);
  
  // Store the original data
  const [originalData, setOriginalData] = useState(hairstylistsData || []);

   // State to manage the search input value
   const [searchText, setSearchText] = useState("");


  useEffect(() => {
    if (hairstylistsData) {
      setOriginalData(hairstylistsData);
      setFilteredData(hairstylistsData); // Initially set the filteredData to the original data
    }
  }, [hairstylistsData]);

  const renderItem = ({ item }: { item: any }) => (
    <SalonItemCard
      image={item.image}
      title={item.name}
      rating={item.rating}
      description={item.description}
      joinedOn={formatDate(item.createdAt)}
      onViewDetails={() => {
        // Handle view details button press
        fetchHairstylistsFromFirestore(item.id)
          .then((userdata) => {
            navigation.navigate("SalonDetails", {
              salonData: item,
              hairStylistDetails: userdata[0],
            });
          })
          .catch(() => {});
        fetchHairstylesFromFirestore(item.id).then((hairStyles) => {
          setHairstylesData(hairStyles);
        });
      }}
      phone={item.phone}
    />
  );

  function filterSalons(text) {
    setSearchText(text);
    
    if (text) {
      const lowercasedText = text.toLowerCase();
  
      const filtered = originalData.filter((stylist) =>
        stylist.name.toLowerCase().includes(lowercasedText) ||
        stylist.phone.toLowerCase().includes(lowercasedText) ||
        stylist.description.toLowerCase().includes(lowercasedText)
      );
  
      setFilteredData(filtered);
    } else {
      // If the search text is empty, reset the data to the original data
      setFilteredData(originalData);
    }
  }

  return hairstylistsData ? (
    <SafeAreaView
      style={[globalStyles.safeArea]}
    >
       {/* Hide the status bar */}
       <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={globalStyles.dashboard}>
          <Text style={globalStyles.title}>Top Rated</Text>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false} // Optional: Hide horizontal scroll indicator
            contentContainerStyle={globalStyles.storyContainerHorizontal}
          >
            {hairstylistsData?.map((storyData: any, index) => {
              return (
                <StoryItem
                  key={index}
                  onPress={(item) => {
                    fetchHairstylistsFromFirestore(storyData.id)
                      .then((userdata) => {
                        navigation.navigate("SalonDetails", {
                          salonData: item,
                          hairStylistDetails: userdata[0],
                        });
                      })
                      .catch(() => {});
                    fetchHairstylesFromFirestore(storyData.id).then((hairStyles) => {
                      setHairstylesData(hairStyles);
                    });
                  }}
                  src={storyData.image}
                  name={storyData.name}
                />
              );
            })}
          </ScrollView>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>
          <SearchComponent
            value={searchText}
            onChangeText={function (text: string): void {
              filterSalons(text);
            }}
            onSearch={function (text: string): void {
              // throw new Error("Function not implemented.");
            }}
          />
          <Text style={globalStyles.title}>Hair Specialists</Text>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id} // Ensure that you have a unique 'id' for each item
            numColumns={2}
            columnWrapperStyle={globalStyles.columnWrapper}
            contentContainerStyle={globalStyles.gridContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoadingScreen />
  );
};

export default DashboardScreen;
