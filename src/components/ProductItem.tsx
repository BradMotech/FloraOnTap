import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use Ionicons or any other preferred icon library
import tokens from '../styles/tokens'; // Adjust the path to your tokens or styles
import Badge from './Badge';
import { formatToRands } from '../utils/currencyUtil';
import globalStyles from '../styles/globalStyles';
import { useToast } from './ToastContext';

interface ProductItemCardProps {
  image: string;
  title: string;
  price: string;
  stockStatus?: string;
  providerEdit?: boolean;
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
  providerEdit = false,
  stockStatus,
  onViewDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
const {showToast} = useToast()
  return (
    <TouchableOpacity   onPress={() => {
      if (stockStatus === 'Out of Stock' && providerEdit !== true) {
        showToast('This item is out of stock.','danger');
      } else {
        onViewDetails();
      }
    }} style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.row}>
          <Text numberOfLines={2} style={[styles.title, { flexWrap: 'wrap', maxWidth: '100%' }]}>
            {title}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[globalStyles.planPrice]}>
            <Ionicons name="cash" size={12} color={tokens.colors.floraOnTapMainColor} />
            {"  "}{formatToRands(price)}
          </Text>
        </View>
        
        {/* Toggle Button */}
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {isExpanded ? 'Hide Details' : 'Show more Details'}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={tokens.colors.floraOnTapMainColor}
          />
        </TouchableOpacity>

        {/* Collapsible Details */}
        {isExpanded && (
          <View style={{marginTop:8}}>
            <View style={styles.row}>
              <Text style={styles.description} numberOfLines={3}>
                <Ionicons name="information-circle" size={14} color={tokens.colors.iconColor} />
                {" " + description}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.joinedOn}>
                <Ionicons name="calendar" size={12} color={tokens.colors.iconColor} />
                {" Added On: " + addedOn}
              </Text>
            </View>
          </View>
        )}
        
        {stockStatus && <View style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
          {stockStatus === 'Out of Stock' ? (<Badge variant="error" text={stockStatus} />) : (<Badge variant="success" text={stockStatus} />)}
        </View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    minWidth: Dimensions.get("window").width / 2.2,
    minHeight: Dimensions.get("window").width / 1.43,
    backgroundColor: tokens.colors.background,
    shadowColor: tokens.colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 1.5,
    borderWidth: 0.6,
    borderColor: tokens.colors.inactive,
    paddingBottom: 10,
    marginLeft: 2
  },
  image: {
    width: "100%",
    height: 180,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  details: {
    padding: 5,
    maxWidth: Dimensions.get("window").width / 2.2,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: tokens.colors.text,
    marginTop: 16,
    maxWidth: Dimensions.get("window").width / 2.2,
    fontFamily: 'GorditaRegular',
  },
  description: {
    fontSize: 12,
    color: tokens.colors.textColor,
    maxWidth: '100%',
    fontFamily: 'GorditaRegular',
  },
  joinedOn: {
    fontSize: 10,
    color: tokens.colors.textColor,
    maxWidth: 190,
    minWidth: Dimensions.get("window").width / 2.2,
    fontFamily: 'GorditaRegular',
  },
  phone: {
    fontSize: 12,
    color: tokens.colors.textColor,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  toggleText: {
    fontSize: 14,
    color: tokens.colors.floraOnTapMainColor,
    marginRight: 5,
  }
});

export default ProductItemCard;
