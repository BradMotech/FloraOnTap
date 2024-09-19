import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For star icons

interface RatingProps {
  rating: number; // Rating out of 5
  size: number; // Rating size
}

const Rating: React.FC<RatingProps> = ({ rating,size }) => {
  // Generate an array with 5 items, where the value is either true (filled star) or false (empty star)
  const stars = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <View style={styles.container}>
      {stars.map((isFilled, index) => (
        <MaterialCommunityIcons
          key={index}
          name={isFilled ? 'star' : 'star-outline'}
          size={size}
          color={isFilled ? '#fbc02d' : '#b0bec5'} // Yellow for filled, gray for empty
          style={styles.star}
        />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      <Text style={styles.ratingText}>/</Text>
      <Text style={styles.ratingText}>5</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#616161', // Adjust color if needed
    marginLeft: 4,
  },
});

export default Rating;
