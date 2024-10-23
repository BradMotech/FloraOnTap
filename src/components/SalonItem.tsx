import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Use Ionicons or any other preferred icon library
import tokens from "../styles/tokens"; // Adjust the path to your tokens or styles
import Rating from "./Rating";
import globalStyles from "../styles/globalStyles";
import Badge from "./Badge";
import { fetchHairstylesFromFirestore } from "../firebase/dbFunctions";

export type locationDetails = {
  placeName:string,
  longitude:number,
  latitude:number
}
interface SalonItemCardProps {
  image: string;
  title: string;
  rating: number;
  currentUserlocationDetails: locationDetails;
  floraUserlocationDetails: locationDetails;
  description: string;
  floristId: string;
  joinedOn: string;
  phone: string; // Added phone prop
  onViewDetails: () => void;
}

const SalonItemCard: React.FC<SalonItemCardProps> = ({
  image,
  title,
  rating,
  description,
  joinedOn,
  currentUserlocationDetails,
  floraUserlocationDetails,
  floristId,
  phone,
  onViewDetails,
}) => {
  const firstLetter = title.charAt(0).toUpperCase();
  const [floraData, setFloraData] = useState<any>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity is 1
 // Function to change image
 const nextImage = () => {
  Animated.timing(fadeAnim, {
    toValue: 0, // Fade out the current image
    duration: 500, // Duration of the fade
    useNativeDriver: true, // Enable native driver for better performance
  }).start(() => {
    // After fade out, change the image and fade back in
    if (floraData && floraData.length > 0) {
    const randomIndex = Math.floor(Math.random() * floraData.length);
    // setCurrentImageIndex((prevIndex) => (prevIndex + 1) % floraData.length);
    // console.warn("🚀 ~ nextImage ~ randomIndex:", randomIndex)
    setCurrentImageIndex(randomIndex);
    // alert(floraData.length)
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in the new image
      duration: 500,
      useNativeDriver: true,
    }).start();}
  });
};

  useEffect(() => {
    fetchHairstylesFromFirestore(floristId).then((flora) => {
      // aler("🚀 ~ fetchHairstylesFromFirestore ~ hairStyles:", hairStyles)
      const floraImages = flattenSalonImages(flora);
    // alert("🚀 ~ fetchHairstylesFromFirestore ~ floraImages:"+ floraImages)
      setFloraData(floraImages);
    });
  }, []);

 

  const flattenSalonImages = (flora) => {
    const imageArray: string[] = [];
    
    flora.forEach((salon) => {
      salon.images.forEach((image) => {
        imageArray.push(image);
      });
    });
    console.log("🚀 ~ flattenSalonImages ~ imageArray:", imageArray)
  
    return imageArray;
  };

  // Automatically change image every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 9000); // 6 seconds interval
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const calculateDistance = (
    location1: locationDetails | null,
    location2: locationDetails | null
  ): string => {
    // Check if either location1 or location2 is null
    if (!location1 || !location2) {
      return "No distance "; // or return "Invalid locations" or any fallback message
    }
  
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  
    // Earth's radius in kilometers
    const earthRadiusKm = 6371;
  
    // Destructure latitudes and longitudes
    const { latitude: lat1, longitude: lon1 } = location1;
    const { latitude: lat2, longitude: lon2 } = location2;
  
    // Convert latitudes and longitudes to radians
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLatRad = toRadians(lat2 - lat1);
    const deltaLonRad = toRadians(lon2 - lon1);
  
    // Haversine formula
    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Distance in kilometers
    const distanceKm = earthRadiusKm * c;
  
    // Convert to meters if the distance is less than 1 kilometer
    if (distanceKm < 1) {
      const distanceMeters = distanceKm * 1000;
      return `${distanceMeters.toFixed(0)} meters`;
    }
  
    // Otherwise, return in kilometers
    return `${distanceKm.toFixed(2)} km`;
  };

  return (
    <TouchableOpacity onPress={onViewDetails} style={styles.card}>
      {!floraData.length ? (
        <Animated.Image
        source={{ uri: floraData[currentImageIndex]?.url }}
        style={[styles.image, { opacity: fadeAnim }]} // Bind opacity to the fadeAnim value
      />
      ) : (
        <View
          style={[
            styles.image,
            {
              backgroundColor: tokens.colors.floraOnTapMainColor,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Image  style={[styles.image,]} source={{ uri: image }}/>
        </View>
      )}
      <View style={styles.details}>
        <View style={styles.row}>
        <Image source={{ uri: image }} style={{height:40,width:40,borderRadius:20}} />
          <Text style={styles.title}>{" "+title}</Text>
        </View>
        {/* <View style={styles.row}>
          {rating ? <Rating rating={rating} size={0} /> : null}
        </View> */}
        {/* <View style={styles.row}>
        <Image source={{ uri: image }} style={{height:40,width:40,borderRadius:20}} />
        </View> */}
        {/* <View style={styles.row}>
          <Text style={styles.phone}>
            <Ionicons
              name="call-outline"
              size={12}
              color={tokens.colors.hairduTextColorGreen}
            />
            {" " + phone}
          </Text>
        </View> */}
        {/* <View style={styles.row}>
          <Text style={styles.description} numberOfLines={3}>
            <Ionicons
              name="information-circle-outline"
              size={12}
              color={tokens.colors.hairduTextColorGreen}
            />
            {" " + description}
          </Text>
        </View> */}
        <View style={styles.row}>
          <Text style={styles.joinedOn}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={tokens.colors.hairduTextColorGreen}
            />{" "}
            Joined On: {joinedOn}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 6 }}>
          <Badge variant="details" text={"Prio"} />
          <Badge variant="prebooking" text={"Pre-book"} />
        </View>
        <View style={{ display: "flex", flexDirection: "row", marginTop: 0 }}>
          <Badge variant="noIcon" text={calculateDistance(currentUserlocationDetails,floraUserlocationDetails) + ' from you'} />
        </View>
        {/* <Badge text={'Popular salon'}/>   */}
        {/* <TouchableOpacity style={styles.button} onPress={onViewDetails}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    minWidth: Dimensions.get("window").width / 2.2,
    // maxHeight: Dimensions.get('window').width /1.5,
    minHeight: Dimensions.get("window").width / 2.5,
    // margin: 1,
    backgroundColor: tokens.colors.background,
    shadowColor: tokens.colors.shadow, // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.25, // Shadow opacity for iOS
    shadowRadius: 10, // Shadow blur radius for iOS
    elevation: 1.5, // Shadow for Android
    borderWidth: 0.6,
    borderColor: tokens.colors.inactive,
    paddingBottom: 22,
    // width:'100%'
  },
  image: {
    width: "100%",
    height: 200, // Adjust height as needed
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
  details: {
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    display: "flex",
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 0,
    marginTop:6,
    fontFamily: "GorditaRegular",
  },
  rating: {
    fontSize: 16,
    color: tokens.colors.primary, // Adjust to fit your theme
    marginLeft: 10,
    fontFamily: "GorditaRegular",
  },
  phone: {
    fontSize: 12,
    color: tokens.colors.textColor,
    fontFamily: "GorditaRegular",
    // marginLeft: 10,
  },
  description: {
    fontSize: 12,
    color: tokens.colors.textColor,
    // marginBottom: 10,
    maxWidth: 130,
    minWidth: Dimensions.get("window").width / 2.5,
    // maxHeight:tokens.spacing.lg,
    overflow: "hidden", // Ensure text is clipped
    fontFamily: "GorditaRegular",
  },
  joinedOn: {
    fontSize: 12,
    color: tokens.colors.textColor,
    // marginLeft: 10,
    // maxWidth:120,
    // minWidth:Dimensions.get('window').width /2.8,
    alignItems: "baseline",
    justifyContent: "center",
    fontFamily: "GorditaRegular",
  },
  button: {
    backgroundColor: tokens.colors.floraOnTapMainColor, // Adjust to fit your theme
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SalonItemCard;
