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
  fetchHairstylistsFromFirestore,
} from "../../firebase/dbFunctions";
import SalonItemCard from "../../components/SalonItem";
import PanoramaScrollCarousel from "../../components/PanoramScrollCarousel";
import Tab from "../../components/Tab";
import PlaceholderComponent from "../../components/placeholderComponent";

const promotionImages = [
  {
    url: "https://thamanibeauty.co.za/wp-content/uploads/2021/06/DSCF0707-1024x683.jpg",
    href: "https://example.com/promo1",
  },
  {
    url: "https://thamanibeauty.co.za/wp-content/uploads/2022/03/Thamani-Beauty-Bar4879-1024x683.jpg",
    href: "https://example.com/promo2",
  },
  {
    url: "https://thamanibeauty.co.za/wp-content/uploads/2022/03/Thamani-Beauty-Bar4888-1024x683.jpg",
    href: "https://example.com/promo3",
  },
];

const DashboardScreen = ({ navigation }) => {
  const { user, hairstylistsData, setHairstylesData, setHairstylistsData } =
    useContext(AuthContext);

  const [filteredData, setFilteredData] = useState(hairstylistsData || []);
  const [originalData, setOriginalData] = useState(hairstylistsData || []);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false); 
  const [activeTab, setActiveTab] = useState("All"); 

  useEffect(() => {
    if (hairstylistsData === null) {
      fetchHairstylistsFromFirestore().then((data) => {
        setHairstylistsData(data);
      });
    }
    if (hairstylistsData) {
      setOriginalData(hairstylistsData);
      setFilteredData(hairstylistsData);
    }
  }, [hairstylistsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchHairstylistsFromFirestore();
      setHairstylistsData(data);
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
      joinedOn={formatDate(item.createdAt)}
      onViewDetails={() => {
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
  const tabTitles = ["All", "Barbershop", "Hair Salon", "Nail Salon", "Skin Care"];

  return hairstylistsData ? (
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
          <PanoramaScrollCarousel images={promotionImages} />
          <Text style={globalStyles.title}>Top Rated</Text>
          <View style={globalStyles.separatorNoColor}></View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={globalStyles.storyContainerHorizontal}
          >
            {hairstylistsData?.map((storyData, index) => {
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
          <Text style={globalStyles.title}>Specialists</Text>
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
            />:<PlaceholderComponent text={"No salons to show"}/>)
          )}
          {activeTab === "Barbershop" && (
            (filteredData.filter((x)=>x.salonType === "Barbershop").length ? <FlatList
              data={filteredData.filter((x)=>x.salonType === "Barbershop")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Barbershop to show"}/>)
          )}
          {activeTab === "Hair Salon" && (
            (filteredData.filter((x)=>x.salonType === "Hair Salon").length ? <FlatList
              data={filteredData.filter((x)=>x.salonType === "Hair Salon")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Hair Salon to show"}/>)
          )}
          {activeTab === "Nail Salon" && (
            (filteredData.filter((x)=>x.salonType === "Nail Salon").length ? <FlatList
              data={filteredData.filter((x)=>x.salonType === "Nail Salon")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Nail Salon to show"}/>)
          )}
          {activeTab === "Skin Care" && (
            (filteredData.filter((x)=>x.salonType === "Skin Care").length ? <FlatList
              data={filteredData.filter((x)=>x.salonType === "Skin Care")}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={globalStyles.columnWrapper}
              contentContainerStyle={globalStyles.gridContainer}
            />:<PlaceholderComponent text={"No Skin Care to show"}/>)
          )}
          {/* Add similar FlatList rendering for other tabs as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoadingScreen />
  );
};

export default DashboardScreen;
