import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'error' | 'details' | 'prebooking' | 'noIcon'; // Example variants
  selectable?: boolean;
  onSelect?: (text: string) => void;
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'success', selectable = false, onSelect }) => {
  const handleSelect = () => {
    if (selectable && onSelect) {
      onSelect(text); // Notify parent when selected
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.badgeContainer,
        variant === 'success' && styles.successVariant,
        variant === 'error' && styles.errorVariant,
        variant === 'details' && styles.detailsVariant,
        variant === 'prebooking' && styles.prebookingVariant,
        variant === 'noIcon' && styles.noIconVariant,
      ]}
      disabled={!selectable} // Make Touchable only if selectable
      onPress={handleSelect}
    >
      {variant === 'success' && (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <Path
            d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM6.9675 12.2175L4.275 9.525C3.9825 9.2325 3.9825 8.76 4.275 8.4675C4.5675 8.175 5.04 8.175 5.3325 8.4675L7.5 10.6275L12.66 5.4675C12.9525 5.175 13.425 5.175 13.7175 5.4675C14.01 5.76 14.01 6.2325 13.7175 6.525L8.025 12.2175C7.74 12.51 7.26 12.51 6.9675 12.2175Z"
            fill="#47BF9C"
          />
        </Svg>
      )}
      {variant === 'error' && (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path
          d="M8 10V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V10H20V12H19L17.2 19C17.1 19.6 16.6 20 16 20H8C7.4 20 6.9 19.6 6.8 19L5 12H4V10H8ZM10 8V10H14V8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8ZM7.2 12L9 18H15L16.8 12H7.2Z"
          fill="red"
        />
        </Svg>
      )}
      {variant === 'details' && (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <Path
            d="M3 7.875C2.3775 7.875 1.875 8.3775 1.875 9C1.875 9.6225 2.3775 10.125 3 10.125C3.6225 10.125 4.125 9.6225 4.125 9C4.125 8.3775 3.6225 7.875 3 7.875ZM3 3.375C2.3775 3.375 1.875 3.8775 1.875 4.5C1.875 5.1225 2.3775 5.625 3 5.625C3.6225 5.625 4.125 5.1225 4.125 4.5C4.125 3.8775 3.6225 3.375 3 3.375ZM3 12.375C2.3775 12.375 1.875 12.885 1.875 13.5C1.875 14.115 2.385 14.625 3 14.625C3.615 14.625 4.125 14.115 4.125 13.5C4.125 12.885 3.6225 12.375 3 12.375ZM6 14.25H15C15.4125 14.25 15.75 13.9125 15.75 13.5C15.75 13.0875 15.4125 12.75 15 12.75H6C5.5875 12.75 5.25 13.0875 5.25 13.5C5.25 13.9125 5.5875 14.25 6 14.25ZM6 9.75H15C15.4125 9.75 15.75 9.4125 15.75 9C15.75 8.5875 15.4125 8.25 15 8.25H6C5.5875 8.25 5.25 8.5875 5.25 9C5.25 9.4125 5.5875 9.75 6 9.75ZM5.25 4.5C5.25 4.9125 5.5875 5.25 6 5.25H15C15.4125 5.25 15.75 4.9125 15.75 4.5C15.75 4.0875 15.4125 3.75 15 3.75H6C5.5875 3.75 5.25 4.0875 5.25 4.5Z"
            fill="#AF37FB"
          />
        </Svg>
      )}
      {variant === 'prebooking' && (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <Path d="M10.8 4.5L10.5 3H3.75V15.75H5.25V10.5H9.45L9.75 12H15V4.5H10.8Z" fill="#F7BF53" />
        </Svg>
      )}
      {variant === 'noIcon' && null}

      <Text style={styles.badgeText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4, // Replace this with marginRight for spacing if gap is not supported
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    margin: 3,
  },
  successVariant: {
    backgroundColor: '#E6F8F2', // Light green for success
  },
  noIconVariant: {
    backgroundColor: '#E6F8F2', // Light green for success
  },
  errorVariant: {
    backgroundColor: '#FDEDED', // Light red for error
  },
  detailsVariant: {
    backgroundColor: '#ede8fd', // Light red for error
  },
  prebookingVariant: {
    backgroundColor: '#fdf2dd', // Light red for error
  },
  badgeText: {
    fontFamily: 'gordita-regular',
    fontSize: 12,
  },
});

export default Badge;
