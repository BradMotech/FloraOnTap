import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions
} from "react-native";
import tokens from "../styles/tokens";
import ProductItemCard from "./ProductItem";
import { formatDate } from "../utils/dateFormat";
import globalStyles from "../styles/globalStyles";
import { Ionicons } from '@expo/vector-icons'; 
import ImageGalleryItem from "./ImageGalleryItem";
import ButtonComponent from "./buttonComponent";
import InputComponent from "./InputComponent";
import ImagePicker from 'react-native-image-picker';
import { updateUserFriends } from "../firebase/dbFunctions";
import { useToast } from "./ToastContext";
import SearchComponent from "./SearchComponent";
import FilterBy from "./FilterBy";

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
const CustomTabViewProvider = ({ salonData, ratingData, navigation, salonDetails,isProvider }) => {
  const [activeTab, setActiveTab] = useState("Details");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [filterByFlag, setFilterByFlag] = useState<boolean>(false);
  const { showToast } = useToast();

  function sendMessageToUser(data: { id: string }) {
    updateUserFriends(data);
    navigation.navigate('Chat')
  }

  const renderItem = ({ item }: { item: any }) => (
    <ProductItemCard
      image={item.images[0].url}
      title={item.name}
      price={item.price}
      description={item.description}
      addedOn={formatDate(item.createdAt)}
      onViewDetails={() => {
        // Handle view details button press
        navigation.navigate("EditProduct", { docId: item.id });
      }}
      phone={item.phone}
    />
  );

  function renderSalonProfileDetails(data): React.ReactNode {
    const firstLetter = data.name.charAt(0).toUpperCase();
    return (
      <View>
        <View style={{width:Dimensions.get('screen').width-22}}>
          <View
            style={[
              globalStyles.imageView,
              {
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "flex-start",
              },
            ]}
          >
            {data.image ?<Image src={data.image} style={[globalStyles.Storycontainer]} />: <View style={[globalStyles.imagePlaceholder,{height:80,width:80,borderRadius:40,marginRight:10}]}>
              <Text style={globalStyles.placeholderText}>{firstLetter}</Text>
            </View>}
            <View
              style={{
                alignItems: "baseline",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Text
                style={{
                  color: tokens.colors.textColor,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={"person-circle-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.name}
              </Text>
              <Text style={{ color: tokens.colors.textColor }}>
                <Ionicons
                  name={"mail-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.email}
              </Text>
              <Text style={{ color: tokens.colors.textColor }}>
                <Ionicons
                  name={"call-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.phone}
              </Text>
              <Text style={{ color: tokens.colors.textColor }}>
                <Ionicons
                  name={"globe-outline"}
                  size={15}
                  color={tokens.colors.gray}
                />
                {"  " + data.province}
              </Text>
              <TouchableOpacity
                style={{
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
                onPress={() => sendMessageToUser(data)}
              >
                <Text
                  style={{
                    color: tokens.colors.textColor,
                    textAlign: "center",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    style={{ marginLeft: 16, marginTop: tokens.spacing.lg * 3 }}
                  />
                  <Text style={{ marginBottom: 22, color: "blue" }}>
                    {" Send message"}
                  </Text>
                </Text>
              </TouchableOpacity>
              {/* buttons */}
            </View>
          </View>
          
          {isProvider ? <View
            style={{ width: "100%", display: "flex", flexDirection: "row",justifyContent:'space-between' }}
          >
            <View style={{width:Dimensions.get('screen').width/2 - 15}}>
            <ButtonComponent
              marginTop={10}
              text={"Edit profile"}
              onPress={() => setEditProfile(true)}
            />
            </View>
            <View style={{width:Dimensions.get('screen').width/2 - 15}}>
            <ButtonComponent marginTop={10} text={"Renew subscription"} />
            </View>
          </View>:null}
          <View style={globalStyles.imageView}>
            <Text style={{ color: tokens.colors.textColor, padding: 6 }}>
              {data.description}
            </Text>
          </View>
          <View style={globalStyles.imageView}>{/* map here */}</View>
        </View>
      </View>
    );
  }

  function EditProfile({ data, onSave, onCancel }) {
    const [name, setName] = useState(data?.name);
    const [email, setEmail] = useState(data?.email);
    const [phone, setPhone] = useState(data?.phone);
    const [description, setDescription] = useState(data?.description);
    const [image, setImage] = useState(data?.image);
  
    const handleImagePick = () => {
      // ImagePicker.showImagePicker({}, (response) => {
      //   if (response.didCancel) {
      //     console.log("User cancelled image picker");
      //   } else if (response.error) {
      //     console.log("ImagePicker Error: ", response.error);
      //   } else {
      //     setImage(response.uri);
      //   }
      // });
    };
  
    const handleSave = () => {
      // Add validation and save logic here
      if (!name || !email || !phone || !description) {
        showToast('Error: Please fill all fields','warning','middle')
        
        return;
      }
  
      const updatedData = { name, email, phone, description, image };
      onSave(updatedData);
    };
  
    return (
      <View style={globalStyles.container}>
        <View style={[globalStyles.imageView, { flexDirection: 'row', alignItems: 'center' }]}>
          <ButtonComponent text="Change Profile Image" onPress={handleImagePick} />
          {image && <Image source={{ uri: image }} style={globalStyles.Storycontainer} />}
        </View>
  
        <InputComponent
          iconName="person-outline"
          // value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <InputComponent
          iconName="mail-outline"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Enter email"
        />
        <InputComponent
          iconName="call-outline"
          // value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
          placeholder="Enter phone number"
        />
        <InputComponent
          iconName="information-circle-outline"
          // value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />
  
        <ButtonComponent text="Save Changes" onPress={handleSave} />
        <ButtonComponent text="Cancel" onPress={onCancel} />
      </View>
    );
  };

  const renderGallery = (): React.ReactNode => {
    return (
      <>
        {salonData?.map((mappedImages, index) => (
          <ImageGalleryItem key={index} uris={mappedImages.images} />
        ))}
      </>
    );
  };

  function applyFilters(data) {
    setFilterByFlag(false)
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
            {salonDetails ? (
              <View>
                {/* Render salon data */}
                {!editProfile ? (
                  <View>{renderSalonProfileDetails(salonDetails)}</View>
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
                { !filterByFlag ? 
                  <View style={{width:Dimensions.get("screen").width - 22}}>
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
                        alignItems:'center',
                        justifyContent:'center',
                        marginBottom:10
                      }}
                      onPress={()=>setFilterByFlag(true)}
                    >
                      <Ionicons name="filter-outline" size={22} color={tokens.colors.shadow} />
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
                :
                <View style={{width:Dimensions.get("screen").width}}>
                <FilterBy onApplyFilter={function (filters: any): void {
                  applyFilters(filters)
                } }/>
                </View>
                }
             
                {/* Add more salon details as needed */}
              </View>
            ) : (
              <Text style={styles.pageText}>No portfolio data available</Text>
            )}
          </View>
        )}
        {activeTab === "Ratings" && (
          <View style={styles.pageContent}>
            {ratingData && ratingData.length > 0 ? (
              ratingData.map((rating, index) => (
                <View key={index}>
                  <Text style={styles.pageText}>Rating: {rating.score}</Text>
                  <Text style={styles.pageText}>Comment: {rating.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.pageText}>No ratings available</Text>
            )}
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
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9", // Added background color for visibility
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: tokens.colors.hairduMainColor, // Active tab color
  },
  tabText: {
    fontSize: 16,
    color: tokens.colors.inactive,
  },
  activeTabText: {
    color: tokens.colors.hairduMainColor, // Active tab text color
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
});

export default CustomTabViewProvider;

