import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Ionicons or any other preferred icon library
import tokens from '../styles/tokens'; // Adjust the path to your tokens or styles
import Rating from './Rating';
import globalStyles from '../styles/globalStyles';

interface ProductItemCardProps {
  image: string;
  title: string;
  price: string;
  description: string;
  addedOn: string;
  phone: string; // Added phone prop
  onViewDetails: () => void;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  image,
  title,
  price,
  description,
  addedOn,
  phone,
  onViewDetails,
}) => {
  return (
    <TouchableOpacity onPress={onViewDetails} style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.row}>
          <Text numberOfLines={2} style={[styles.title,{ flexWrap: 'wrap', maxWidth: '100%',lineHeight: 18, }]}><Ionicons name="book-outline" size={12} color={tokens.colors.iconColor} />{" "+title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[globalStyles.planPrice]}><Ionicons name="cash" size={12} color={tokens.colors.hairduMainColor} />{"  "}R {price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.description} numberOfLines={3}><Ionicons name="information-circle-outline" size={12} color={tokens.colors.iconColor} />{" "+description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.joinedOn}><Ionicons name="calendar" size={12} color={tokens.colors.iconColor} /> Added On: {addedOn}</Text>
        </View>
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
    minHeight: Dimensions.get("window").width / 1.43,
    // margin: 1,
    backgroundColor: tokens.colors.background,
    shadowColor: tokens.colors.shadow, // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset for iOS
    shadowOpacity: 0.25, // Shadow opacity for iOS
    shadowRadius: 10, // Shadow blur radius for iOS
    elevation: 5, // Shadow for Android
    borderWidth: 0.6,
    borderColor: tokens.colors.inactive,
    paddingBottom:10,
    marginLeft:2
    // width:'100%'
  },
  image: {
    width: "100%",
    height: 120, // Adjust height as needed
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  details: {
    padding: 5,
    maxWidth:(Dimensions.get("window").width / 2.2),
    overflow: "hidden",
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
    fontWeight: "bold",
    color:tokens.colors.text,
    marginTop:16,
    maxWidth:(Dimensions.get("window").width / 2.2),
    overflow: "hidden",
     fontFamily:'GorditaMedium'
    // marginLeft: 10,
  },
  rating: {
    fontSize: 16,
    color: tokens.colors.primary, // Adjust to fit your theme
    marginLeft: 10,
  },
  phone: {
    fontSize: 12,
    color: tokens.colors.textColor,
    marginLeft: 10,
  },
  description: {
    fontSize: 12,
    color: tokens.colors.textColor,
    // marginBottom: 10,
    maxWidth: 130,
    minWidth: Dimensions.get("window").width / 2.5,
    // maxHeight: tokens.spacing.lg,
    overflow: "hidden", // Ensure text is clipped
  },
  joinedOn: {
    fontSize: 12,
    color: tokens.colors.textColor,
    // marginLeft: 10,
    maxWidth: 120,
    minWidth: Dimensions.get("window").width / 2.8,
  },
  button: {
    backgroundColor: tokens.colors.hairduMainColor, // Adjust to fit your theme
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
  priceContainer: {
    backgroundColor: '#d3eace',
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    display: "flex",
    textAlign: "center",
    // width:'auto',
    // minWidth:100,
    maxWidth:70,
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:3,
  },
});

export default ProductItemCard;
