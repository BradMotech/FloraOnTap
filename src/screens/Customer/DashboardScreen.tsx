import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
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
  fetchFloraProvidersFromFirestore,
  fetchUserFromFirestore,
} from "../../firebase/dbFunctions";
import SalonItemCard, { locationDetails } from "../../components/SalonItem";
import PanoramaScrollCarousel from "../../components/PanoramScrollCarousel";
import Tab from "../../components/Tab";
import PlaceholderComponent from "../../components/placeholderComponent";
import CustomModal from "../../components/CustomModal";
import StoriesPreview from "./StoriesPreview";
import StoriesModal from "../../components/StoriesModal";
import LocationInput from "../../components/LocationInput";

const promotionImages = [
  {
    url: "https://pbs.twimg.com/media/FtrRLRCWYAEE33e?format=jpg&name=large",
    href: "https://example.com/promo1",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8c9FkJPdRm_WtF79deQMTLqshtjBqzMcvRw&s",
    href: "https://example.com/promo2",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrMgC9BQGfbl0yDrhaa6E1KfaARYqPdDqCDg&s",
    href: "https://example.com/promo3",
  },
];

const DashboardScreen = ({ navigation }) => {
  const { user, flowerProvidersData, setHairstylesData, setFloraProvidersData,hairstylesData } =
    useContext(AuthContext);
const [modalVisible, setModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState(flowerProvidersData || []);
  const [originalData, setOriginalData] = useState(flowerProvidersData || []);
  const [floraData, setFloraData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false); 
  const [activeTab, setActiveTab] = useState("All"); 
  const [currentUserlocationDetails, setCurrentUserlocationDetails] = useState<locationDetails>(null);
const  [currentUserData, setCurrentUserData] = useState<any>({});
   // Function to fetch data
   const fetchData = async () => {
    try {
        const userdata = await fetchUserFromFirestore(user.uid);
        setCurrentUserData(userdata);
        // Here we duplicate the flowerProvidersData to have 10 entries
    // const duplicatedData = [];
    // if (flowerProvidersData) { 
    //   for (let i = 0; i < 4; i++) { 
    //     duplicatedData.push({ ...flowerProvidersData[i % flowerProvidersData.length], id: `${i}` }); // Ensure each item has a unique id
    //   }
    //   setFloraProvidersData(duplicatedData); // Set duplicated data
    //   setOriginalData(duplicatedData); // Set original data to duplicated as well
    //   setFilteredData(duplicatedData); // Set filtered data to duplicated as well
    // }
    // Here we duplicate the flowerProvidersData to have 10 entries, can remove the code between so i don't duplicate in prod
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (flowerProvidersData === null) {
      fetchFloraProvidersFromFirestore().then((data) => {
        setFloraProvidersData(data);
      });
    }
    if (flowerProvidersData) {
      setOriginalData(flowerProvidersData);
      setFilteredData(flowerProvidersData);
    }
    fetchData();
  }, [flowerProvidersData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchFloraProvidersFromFirestore();
      setFloraProvidersData(data);
      setOriginalData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <SalonItemCard
      image={item.image}
      title={item.name}
      rating={item.rating}
      description={item.description}
      currentUserlocationDetails={currentUserlocationDetails || currentUserData.coordinates}
      floraUserlocationDetails={item.coordinates} 
      joinedOn={formatDate(item.createdAt)}
      floristId={item.id}
      onViewDetails={() => {
        fetchFloraProvidersFromFirestore(item.id)
          .then((userdata) => {
            navigation.navigate("FlowerShopDetails", {
              salonData: item,
              hairStylistDetails: userdata[0],
            });
          })
          .catch(() => { });
        fetchHairstylesFromFirestore(item.id).then((hairStyles) => {
          setHairstylesData(hairStyles);
          setFloraData(hairStyles)
        });
      } }
      phone={item.phone}   />
  );

  const filterSalons = (text) => {
    setSearchText(text);
    if (text) {
      const lowercasedText = text.toLowerCase();
      const filtered = originalData.filter(
        (stylist) =>
          stylist.name.toLowerCase().includes(lowercasedText) ||
          stylist.phone.toLowerCase().includes(lowercasedText) ||
          stylist.description.toLowerCase().includes(lowercasedText)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(originalData);
    }
  };

  // Array of tab titles
  const tabTitles = ["All", "Florists", "Plant Sellers", "Nurseries",];

  const handleLocationSelect = (locationDetails) => {
    console.warn('Location Selected', `Name: ${locationDetails.placeName}\nCoordinates: (${locationDetails.latitude}, ${locationDetails.longitude})`);
    setCurrentUserlocationDetails(locationDetails)
  };

  return flowerProvidersData ? (
    <SafeAreaView
      style={[globalStyles.safeArea, { marginTop: tokens.spacing.lg * 2.4 }]}
    >
      <StatusBar hidden={true} />
      <ScrollView
        contentContainerStyle={globalStyles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={globalStyles.dashboard}>
          <LocationInput showSubTitle={true} label={'Showing Flora near...'} placeholder={'e.g 282 Furrow rd...'} onSearchPress={undefined} onLocationSelect={handleLocationSelect} selectedLocation={currentUserData?.coordinates?.placeName} />
          <PanoramaScrollCarousel images={promotionImages} onPress={function (): void {
             setModalVisible(true);
          } } />
          <Text style={[globalStyles.title,{marginTop:22}]}>Top Rated</Text>
          <View style={globalStyles.separatorNoColor}></View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={globalStyles.storyContainerHorizontal}
          >
            {flowerProvidersData?.map((storyData, index) => {
              return (
                <StoryItem
                  key={index}
                  onPress={(item) => {
                    fetchFloraProvidersFromFirestore(storyData.id)
                      .then((userdata) => {
                        navigation.navigate("FlowerShopDetails", {
                          salonData: item,
                          hairStylistDetails: userdata[0],
                        });
                      })
                      .catch(() => {});
                    fetchHairstylesFromFirestore(storyData.id).then(
                      (hairStyles) => {
                        setHairstylesData(hairStyles);
                      }
                    );
                  }}
                  src={storyData.image}
                  name={storyData.name}
                />
              );
            })}
          </ScrollView>
          <SearchComponent
            value={searchText}
            onChangeText={(text) => filterSalons(text)}
            onSearch={(text) => {
              // Implement search logic here if needed
            }}
          />
          <View style={globalStyles.separator}></View>
          <Text style={globalStyles.title}>Plant vendors</Text>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Tab 
              titles={tabTitles} 
              activeTab={activeTab} 
              onTabPress={setActiveTab} 
            />
          </View>
          <View style={globalStyles.separatorNoColor}></View>
          {activeTab === "All" && (
            (filteredData.length ? <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No stores to show"}/>)
          )}
          {activeTab === "Florists" && (
            (filteredData.filter((x)=>x.floraProviderCategory === "Florist").length ? <FlatList
              data={filteredData.filter((x)=>x.floraProviderCategory === "Florist")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Florists to show"}/>)
          )}
          {activeTab === "Plant Sellers" && (
            (filteredData.filter((x)=>x.floraProviderCategory === "Plant Sellers").length ? <FlatList
              data={filteredData.filter((x)=>x.floraProviderCategory === "Plant Sellers")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Plant Sellers to show"}/>)
          )}
          {activeTab === "Nurseries" && (
            (filteredData.filter((x)=>x.floraProviderCategory === "Nurseries").length ? <FlatList
              data={filteredData.filter((x)=>x.floraProviderCategory === "Nurseries")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Nurseries to show"}/>)
          )}
          
          {/* Add similar FlatList rendering for other tabs as needed */}
        </View>
        {modalVisible ? <StoriesModal
        visible={modalVisible}
        isSubmititng={null}
        onClose={function (): void {
          setModalVisible(false);
        }}
        children={<StoriesPreview images={promotionImages}/>}
        onConfirm={() => {
          // confirmSettingBooking();
        }}
      ></StoriesModal>:null}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoadingScreen />
  );
};

export default DashboardScreen;
