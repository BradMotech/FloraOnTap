import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
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
import {
  fetchCustomerImagesByFloristId,
  fetchHairstylesFromFirestore,
  updateHairStylistAvailability,
  updateHairStylistProfileDetails,
  updateUserAvailability,
  updateUserFriends,
  updateUserProfileDetails,
} from "../firebase/dbFunctions";
import { useToast } from "./ToastContext";
import SearchComponent from "./SearchComponent";
import FilterBy from "./FilterBy";
import OpeningHours from "./OpeningHours";
import ReviewsScreen from "./Reviews";
import { AuthContext } from "../auth/AuthContext";
import Badge from "./Badge";
import MapComponent from "./MapComponent";
import MasonryFlatList from "./MasonryFlatlist";
import MansoryImageGalleryItem from "./MansoryImageGalleryItem";
import ProfileEdit from "./ProfileEdit";
import PatronsListScreen from "./PatronsList";
import UpdateOperatingHoursModal from "./UpdateOperatingHoursModal";
import FAB from "./FAB";
import PanoramaScrollCarousel from "./PanoramScrollCarousel";

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
const CustomTabViewProvider = ({
  salonData,
  ratingData,
  navigation,
  flowerProvidersDetails,
  isProvider,
}) => {
  const [activeTab, setActiveTab] = useState("Details");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [editProfileDetails, setEditProfileDetails] = useState<boolean>(false);
  const [filterByFlag, setFilterByFlag] = useState<boolean>(false);
  const [updateOperatingHoursModal, setUpdateOperatingHoursModal] =
    useState<boolean>(false);
  const { showToast } = useToast();
  // State to hold the filtered data
  const [filteredData, setFilteredData] = useState(salonData || []);

  // Store the original data
  const [originalData, setOriginalData] = useState(salonData || []);

  // State to manage the search input value
  const [searchText, setSearchText] = useState("");
  const { user, flowerProvidersData, setHairstylesData, hairstylesData } = useContext(AuthContext);// Get current hairstylist (user) context

  const [allCustomerImages, setAllCustomerImages] = useState([]);

  const fecthAllCustomerImages=async()=>{
    let images = []
      await fetchCustomerImagesByFloristId(user?.uid).then((data:any)=>{
        console.log("🚀 ~ awaitfetchAllCustomerImages ~ data:" + data)
        data.forEach((res)=>{
          console.log("🚀 ~ data.forEach ~ res:"+ res.images);
          res.images.forEach((img)=>{
            console.log("🚀 ~ res.images.forEach ~ img:", img)
            images.push(img);
            // alert(img)
          })
        })
        setAllCustomerImages(images)
      });
    }

    useEffect(() => {
      fecthAllCustomerImages();
    }, []);
  // Function to fetch data
  const fetchData = async () => {
    try {
      const hairStyles = await fetchHairstylesFromFirestore(user.uid);
      setHairstylesData(hairStyles);

      // if (hairstylistUserData === null) {
      //   const userdata = await fetchUserFromFirestore(user.uid);
      //   setHairstylesData(userdata);
      // }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (salonData) {
      setOriginalData(salonData);
      setFilteredData(salonData); // Initially set the filteredData to the original data
    }
  }, [salonData]);

  function sendMessageToUser(data: { id: string }) {
    updateUserFriends(data);
    navigation.navigate("Chat");
  }

  const renderItem = ({ item }: { item: any }) => (
    <ProductItemCard
      image={item?.images[0].url}
      title={item?.name}
      price={item?.price}
      stockStatus={item?.stockStatus}
      providerEdit={true}
      description={item?.description}
      addedOn={
        formatDate(item?.createdAt)
          ? formatDate(item?.createdAt)
          : formatDate(item?.updatedAt)
      }
      onViewDetails={() => {
        // Handle view details button press
        navigation.navigate("EditProduct", { docId: item.id });
      }}
      phone={item.phone}
    />
  );

  function renderSalonProfileDetails(data): React.ReactNode {
    const firstLetter = data.name.charAt(0).toUpperCase();
    async function updateUserAvailabilityDetails(data: any) {
      // For users
      await updateUserAvailability(user.uid, data).then(() => {
        setUpdateOperatingHoursModal(false);
        fetchData()
      });

      // For flowerProviders
      await updateHairStylistAvailability(user.uid, data);
    }

    return (
      <>
        <View>
          {/* {data.bannerImage && <Image
            source={{ uri: data.bannerImage }}
            style={{ width: "100%", height: 200, borderTopRightRadius: 12,borderTopLeftRadius: 12 }}
          />} */}
          <View style={{ width: Dimensions.get("screen").width - 22 }}>
          <PanoramaScrollCarousel showUser={false} images={allCustomerImages} onPress={function (): void {
            //  setModalVisible(true);
          } } />
            <View
              style={[
                globalStyles.imageView,
                {
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  backgroundColor: tokens.colors.darkBlueColor,
                  padding: 8,
                  borderRadius: 12,
                  marginTop:2
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {data.image ? (
                  <Image
                    src={data.image}
                    style={[globalStyles.Storycontainer]}
                  />
                ) : (
                  <View
                    style={[
                      globalStyles.imagePlaceholder,
                      {
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        marginRight: 10,
                      },
                    ]}
                  >
                    <Text style={globalStyles.placeholderText}>
                      {firstLetter}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    alignItems: "baseline",
                    justifyContent: "center",
                    display: "flex",marginLeft:12
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

                  <View style={globalStyles.separatorNoColor}></View>
                  <View style={styles.separator}></View>
                  <View style={globalStyles.separatorNoColor}></View>
                  {/* buttons */}
                </View>
              </View>
              {isProvider ? (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      // height: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent:'center',
                      flexDirection:'row',
                      flex: 1,
                      backgroundColor: 'transparent',
                      padding:4,
                      borderRadius: 5,
                    }}
                    onPress={() => setEditProfileDetails(true)}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: tokens.colors.background,
                        fontFamily: "GorditaMedium",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color={tokens.colors.background}
                      />
                      {"  Edit Profile"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                  style={{
                    // height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent:'center',
                    flexDirection:'row',
                    flex: 1,
                    backgroundColor:tokens.colors.skyBlueColor,
                    padding:4,
                    borderRadius: 5,
                    paddingTop:8,
                    paddingBottom:8,
                  }}
                  onPress={() => navigation.navigate("AddProduct")}
                >
                  <Ionicons color={tokens.colors.background} name="book-outline" size={20} />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: tokens.colors.background,
                        fontFamily: "GorditaMedium",
                      }}
                    >
                      {" Add Portfolio"}
                    </Text>

                </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 12 }}
            >
              <Badge variant="details" text={"Online booking priority"} />
              <Badge variant="prebooking" text={"Allows pre-booking"} />
            </View>
            <View style={styles.separator}></View>
            <View
              style={[
                {
                  backgroundColor: tokens.colors.fadedBackgroundGey,
                  borderRadius: 12,
                  padding: 6,
                },
              ]}
            >
              <Text style={{ color: tokens.colors.textColor, padding: 6 }}>
                {data.description}
              </Text>
            </View>
            <View style={styles.separator}></View>
            <View style={[globalStyles.columnWrapper, { marginTop: 16 }]}>
              <Text style={globalStyles.title}>Operating hours</Text>
              <View style={styles.updateOperatingHours}>
                <ButtonComponent
                  onPress={() => setUpdateOperatingHoursModal(true)}
                  text={"Update operating hours"}
                />
              </View>
              <OpeningHours hours={data.availability} />
            </View>
            <View style={globalStyles.separator}></View>
            <View style={[globalStyles.columnWrapper, { marginTop: 16 }]}>
              <Text style={globalStyles.title}>Location details</Text>
              <View style={{ marginTop: 16 }}>
                <Text style={[{ margin: 0 }, styles.linkUnderlinedLocation]}>
                  {data.location}
                </Text>
                {/* <MapComponent region={undefined} /> */}
              </View>
            </View>
            <View style={[globalStyles.columnWrapper, { marginTop: 16 }]}>
              <Text style={globalStyles.title}>Social Media</Text>
              <View style={{ marginTop: 16 }}></View>
              <Text style={{ color: tokens.colors.barkInspiredTextColor }}>
                <Text style={styles.links}>Website:</Text>{" "}
                <Text style={styles.linkUnderlined}>{data.website}</Text>
              </Text>
              <Text style={{ color: tokens.colors.barkInspiredTextColor }}>
                <Text style={styles.links}>Instagram:</Text>{" "}
                <Text style={styles.linkUnderlined}>{data.instagram}</Text>
              </Text>
            </View>
            <View style={globalStyles.imageView}>{/* map here */}</View>
          </View>
        </View>
        <UpdateOperatingHoursModal
          isVisible={updateOperatingHoursModal}
          onClose={() => setUpdateOperatingHoursModal(false)}
          onUpdate={(data) => updateUserAvailabilityDetails(data)}
        />
      </>
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

  function filterSalons(text) {
    setSearchText(text);

    if (text) {
      const lowercasedText = text.toLowerCase();
      // alert(JSON.stringify(originalData))
      const filtered = originalData.filter(
        (stylist) =>
          stylist.name.toLowerCase().includes(lowercasedText) ||
          // stylist.price.toLowerCase().includes(lowercasedText) ||
          stylist.serviceType.toLowerCase().includes(lowercasedText) ||
          stylist.description.toLowerCase().includes(lowercasedText)
      );

      setFilteredData(filtered);
    } else {
      // If the search text is empty, reset the data to the original data
      setFilteredData(originalData);
    }
  }

  const handleProfileUpdate = async (updatedData) => {
    console.log("Updated profile data:", updatedData);
    // Call your update function here with updatedData
    await updateUserProfileDetails(user.uid, updatedData).then(() => {
      setEditProfileDetails(false);
    });
    await updateHairStylistProfileDetails(user.uid, updatedData);
    fetchData();
    // Optionally navigate or show a success message
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
                {!editProfileDetails ? (
                  <View>{renderSalonProfileDetails(flowerProvidersDetails)}</View>
                ) : (
                  <ProfileEdit
                    data={flowerProvidersDetails}
                    isProvider={true}
                    navigation={navigation}
                    onPress={handleProfileUpdate}
                    handleClose={() => setEditProfileDetails(false)}
                  />
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
                      value={searchText}
                      onSearch={() => {}}
                      onChangeText={function (text: string): void {
                        filterSalons(text);
                      }}
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
                      data={filteredData}
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
            <ReviewsScreen provider={true} floristId={user.uid} />
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

        {activeTab === "Patrons" && (
          <View style={styles.pageContent}>
            <View style={globalStyles.separatorNoColor}></View>

            <Text style={globalStyles.GorditaRegular}>
              Your success is not achieved alone; your patrons are the heart and
              foundation of your business, representing the true strength behind
              everything you do.
            </Text>
            <View style={globalStyles.separatorNoColor}></View>
            <View style={{ width: Dimensions.get("screen").width / 2.5 }}>
              <ButtonComponent
                onPress={() => navigation.navigate("AddPatrons")}
                text={"Add Patrons"}
              />
            </View>
            <View style={globalStyles.separatorNoColor}></View>
            <PatronsListScreen uid={user.uid} onSelectPatron={() => {}} />
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
  separator: {
    height: 0.3,
    width: Dimensions.get("screen").width,
    backgroundColor: tokens.colors.gray,
    opacity: 0.5,
    marginTop: 6,
    marginBottom: 6,
  },
  updateOperatingHours: {
    margin: 12,
    marginTop: 18,
  },
  links: {
    color: "#333",
    margin: 12,
  },
  linkUnderlined: {
    textDecorationLine: "underline",
    color: tokens.colors.circularProgress,
    margin: 12,
    textTransform: "lowercase",
  },
  linkUnderlinedLocation: {
    textDecorationLine: "underline",
    color: tokens.colors.circularProgress,
    // margin:12,
    textTransform: "lowercase",
  },
});

export default CustomTabViewProvider;
