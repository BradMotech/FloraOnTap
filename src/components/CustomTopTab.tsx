import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import tokens from "../styles/tokens";
import ProductItemCard from "./ProductItem";
import { formatDate } from "../utils/dateFormat";
import globalStyles from "../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import ImageGalleryItem from "./ImageGalleryItem";
import ButtonComponent from "./buttonComponent";
import InputComponent from "./InputComponent";
import ImagePicker from "react-native-image-picker";
import { updateUserFriends } from "../firebase/dbFunctions";
import { useToast } from "./ToastContext";
import SearchComponent from "./SearchComponent";
import FilterBy from "./FilterBy";
import OpeningHours from "./OpeningHours";
import ReviewsScreen from "./Reviews";
import Badge from "./Badge";
import MapComponent from "./MapComponent";
import MasonryFlatList from "./MasonryFlatlist";
import MansoryImageGalleryItem from "./MansoryImageGalleryItem";

// Tab button component
const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Tab view component
const CustomTabView = ({
  salonData,
  ratingData,
  navigation,
  flowerProvidersDetails,
  isProvider,
}) => {
  const [activeTab, setActiveTab] = useState("Details");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [filterByFlag, setFilterByFlag] = useState<boolean>(false);
  const { showToast } = useToast();

  function sendMessageToUser(data: { id: string }) {
    updateUserFriends(data);
    // navigation.navigate("Chat");
    navigation.navigate("ChatToFlorist",{selectedFriendId:data.id,selectedFriendName:flowerProvidersDetails.name});
  }

  const renderItem = ({ item }: { item: any }) => (
    <ProductItemCard
      image={item.images[0].url}
      title={item.name}
      price={item.price}
      description={item.description}
      stockStatus={item.stockStatus}
      addedOn={formatDate(item.createdAt)}
      onViewDetails={() => {
        // Handle view details button press
        navigation.navigate("PlaceOrder", { floraDetails: item,flowerProvidersDetails:flowerProvidersDetails });
      }}
      phone={item.phone}
    />
  );

  function renderSalonProfileDetails(data): React.ReactNode {
    const firstLetter = data.name.charAt(0).toUpperCase();
    return (
      <View>
      {/* {data.bannerImage && <Image source={{ uri: data.bannerImage ? data.bannerImage :'https://cdn.dribbble.com/users/246611/screenshots/10748226/media/f17b711e4e14bb11e518f804352548ef.png?resize=800x600&vertical=center' }} style={{ width: '100%', height: 200, borderRadius: 12 }} />} */}
        <View style={{ width: Dimensions.get("screen").width - 22 }}>
          <View
            style={[
              globalStyles.imageView,
              {
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: tokens.colors.darkBlueColor,
                padding: 8,
                borderRadius: 12,
                width: "100%",
                marginTop:4
              },
            ]}
          >
            {data.image ? (
              <Image src={data.image} style={[globalStyles.Storycontainer]} />
            ) : (
              <View
                style={[
                  globalStyles.imagePlaceholder,
                  { height: 80, width: 80, borderRadius: 40, marginRight: 10 },
                ]}
              >
                <Text style={globalStyles.placeholderText}>{firstLetter}</Text>
              </View>
            )}
            <View
              style={{
                alignItems: "baseline",
                justifyContent: "center",
                display: "flex",width:'100%',marginLeft:16
              }}
            >
              <Text
                style={{
                  color: tokens.colors.background,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize:25
                }}
              >
                {/* <Ionicons
                  name={"person-circle-outline"}
                  size={15}
                  color={tokens.colors.gray}
                /> */}
                {data.name}
              </Text>
              <View style={{marginBottom:12}}></View>
              <Text style={{ color: tokens.colors.background }}>
                <Ionicons
                  name={"mail-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.email}
              </Text>
              <Text style={{ color: tokens.colors.background }}>
                <Ionicons
                  name={"call-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.phone}
              </Text>
              <Text style={{ color: tokens.colors.background }}>
                <Ionicons
                  name={"globe-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.province}
              </Text>
              <View style={globalStyles.separator}></View>
              <View
                style={{
                  height: 35,
                  alignItems: "flex-start",
                  display: "flex",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent:'center',
                    flexDirection:'row',
                    flex: 1,
                    backgroundColor: tokens.colors.skyBlueColor,
                    padding:6,
                    borderRadius: 5,
                    borderColor:tokens.colors.skyBlueColor,
                    borderWidth:0.3,
                    marginLeft:Platform.OS === 'ios' ? 70 : 0
                  }}
                  onPress={() => sendMessageToUser(data)}
                >
                  <Ionicons color={tokens.colors.background} name="chatbubble-outline" size={20} />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: tokens.colors.background,
                        fontFamily: "GorditaMedium",
                      }}
                    >
                      {" Send us a message"}
                    </Text>

                </TouchableOpacity>
              </View>
              {/* buttons */}
            </View>
          </View>
          {/* <View style={globalStyles.separator}></View> */}
          <View
            style={{ display: "flex", flexDirection: "row", marginTop: 12 }}
          >
            <Badge variant="details" text={"Online booking priority"} />
            <Badge variant="prebooking" text={"Allows Delivery"} />
          </View>
          <View
            style={[
              {
                backgroundColor: tokens.colors.background,
                borderRadius: 12,
                padding: 6,
                marginTop: 16,
              },
            ]}
          >
            <Text
              style={{
                color: tokens.colors.barkInspiredDescriptionTextColor,
                padding: 6,
              }}
            >
              {data.description}
            </Text>
          </View>
          <View style={globalStyles.separator}></View>
          {data.availability.length ? <View style={[globalStyles.columnWrapper, { marginTop: 16 }]}>
            <Text style={globalStyles.title}>Operating hours</Text>
            <OpeningHours hours={data.availability} />
          </View>:null}
          {data.availability.length ? <View style={globalStyles.separator}></View> : null}
          <View style={[globalStyles.columnWrapper, { marginTop: 16 }]}>
            <Text style={globalStyles.title}>Location details</Text>
            <View style={{marginTop:16}}>
            <Text style={[{ margin: 0 }, styles.linkUnderlinedLocation]}>
                  {data.location}
                </Text>
            {/* <MapComponent region={undefined}/> */}
            </View>
          </View>
          <View style={globalStyles.separator}></View>
          <View style={[globalStyles.columnWrapper, { marginTop: 16 }]}>
            <Text style={globalStyles.title}>Social Media</Text>
            <Text style={{ color: tokens.colors.barkInspiredTextColor }}><Text style={styles.links}>Website:</Text> <Text style={styles.linkUnderlined}>{data.website}</Text></Text>
            <Text style={{ color: tokens.colors.barkInspiredTextColor }}><Text style={styles.links}>Instagram:</Text> <Text style={styles.linkUnderlined}>{data.instagram}</Text></Text>
          </View>
          <View style={globalStyles.imageView}>{/* map here */}</View>
        </View>
      </View>
    );
  }

  const flattenSalonImages = () => {
    const imageArray: string[] = [];
    
    salonData.forEach((salon) => {
      salon.images.forEach((image) => {
        imageArray.push(image);
      });
    });
  
    return imageArray;
  };

const renderGallery = (): React.ReactNode => {
  const flattenedImages = flattenSalonImages();

  return (
    <MasonryFlatList
      data={flattenedImages}
      renderItem={({ item }) => <MansoryImageGalleryItem uris={[item]} />} // Pass single image as array
      columnCount={2}
      gap={10}
    />
  );
};

  function applyFilters(data) {
    setFilterByFlag(false);
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TabButton
          title="Details"
          isActive={activeTab === "Details"}
          onPress={() => setActiveTab("Details")}
        />
        <TabButton
          title="Portfolio"
          isActive={activeTab === "Portfolio"}
          onPress={() => setActiveTab("Portfolio")}
        />
        <TabButton
          title="Ratings"
          isActive={activeTab === "Ratings"}
          onPress={() => setActiveTab("Ratings")}
        />
        <TabButton
          title="Gallery"
          isActive={activeTab === "Gallery"}
          onPress={() => setActiveTab("Gallery")}
        />
      </View>

      {/* Tab content */}
      <ScrollView style={styles.content}>
        {activeTab === "Details" && (
          <View style={styles.pageContent}>
            {flowerProvidersDetails ? (
              <View>
                {/* Render salon data */}
                {!editProfile ? (
                  <View>{renderSalonProfileDetails(flowerProvidersDetails)}</View>
                ) : (
                  <View>{null}</View>
                )}
                {/* Add more salon details as needed */}
              </View>
            ) : (
              <Text style={styles.pageText}>No portfolio data available</Text>
            )}
          </View>
        )}
        {activeTab === "Portfolio" && (
          <View
            style={[styles.pageContent, { paddingLeft: 0, paddingRight: 0 }]}
          >
            {salonData ? (
              <View>
                {/* Render salon data */}
                {!filterByFlag ? (
                  <View style={{ width: Dimensions.get("screen").width - 22 }}>
                    <SearchComponent
                      value={""}
                      onChangeText={() => {}}
                      onSearch={() => {}}
                    />
                    <TouchableOpacity
                      style={{
                        height: 35,
                        width: 35,
                        borderRadius: 10,
                        backgroundColor: "white",
                        borderWidth: 0.5,
                        borderColor: tokens.colors.inactive,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                      onPress={() => setFilterByFlag(true)}
                    >
                      <Ionicons
                        name="filter-outline"
                        size={22}
                        color={tokens.colors.shadow}
                      />
                    </TouchableOpacity>
                    <FlatList
                      data={salonData}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id} // Ensure that you have a unique 'id' for each item
                      numColumns={2}
                      columnWrapperStyle={globalStyles.columnWrapper}
                      contentContainerStyle={globalStyles.gridContainer}
                    />
                  </View>
                ) : (
                  <View style={{ width: Dimensions.get("screen").width }}>
                    <FilterBy
                      onApplyFilter={function (filters: any): void {
                        applyFilters(filters);
                      }}
                    />
                  </View>
                )}

                {/* Add more salon details as needed */}
              </View>
            ) : (
              <Text style={styles.pageText}>No portfolio data available</Text>
            )}
          </View>
        )}
        {activeTab === "Ratings" && (
          <View style={styles.pageContent}>
            <ReviewsScreen provider={false} hairstylistId={flowerProvidersDetails.id} />
          </View>
        )}
        {activeTab === "Gallery" && (
          <View style={styles.pageContent}>
            {salonData ? (
              renderGallery()
            ) : (
              <Text style={styles.pageText}>No gallery available</Text>
            )}
            {/* Add gallery content here */}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
    backgroundColor: "#fff", // Added background color for visibility
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: tokens.colors.barkInspiredTextColor, // Active tab color
  },
  tabText: {
    fontSize: 16,
    color: tokens.colors.inactive,
    fontFamily: "GorditaRegular",
  },
  activeTabText: {
    color: tokens.colors.barkInspiredTextColor, // Active tab text color
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  pageContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  pageText: {
    fontSize: 18,
    color: "#333",
  },
  links:{
    color:"#333",
    margin:12
  },
  linkUnderlined:{
    textDecorationLine:"underline",
    color:tokens.colors.circularProgress,
    margin:12,
    textTransform:'lowercase'
  },
  linkUnderlinedLocation: {
    textDecorationLine: "underline",
    color: tokens.colors.circularProgress,
    // margin:12,
    textTransform: "lowercase",
  },
});

export default CustomTabView;
