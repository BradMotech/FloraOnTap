import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../auth/AuthContext';
import { addReview, fetchReviews } from '../firebase/dbFunctions';
import tokens from '../styles/tokens';
import { formatDate, formatTimeToPMAM } from '../utils/dateFormat';

interface ReviewsScreenProps {
  hairstylistId: string;
  provider: boolean;
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ hairstylistId,provider }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);  // Star rating state
  const { user } = useContext(AuthContext);  // Assuming you have user info in AuthContext

  // Fetch reviews and subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = fetchReviews(hairstylistId, (fetchedReviews) => {
      setReviews(fetchedReviews);
    });

    return () => unsubscribe();  // Clean up the subscription when component unmounts
  }, [hairstylistId]);

  // Handle adding a new review
  const handleAddReview = async () => {
    if (newReview.trim() === '' || rating === 0) return; // Ensure a review and rating are provided

    await addReview({
      customerId: user.uid,
      customerName: user.displayName || '',
      customerEmail: user.email || '',
      customerImage: '',  // Optional
      customerPhone: '',  // Optional
      description: newReview,
      rating,  // Add rating to the review
      hairstylistId
    });

    setNewReview('');  // Clear the textarea after submitting the review
    setRating(0);  // Reset the rating
  };

  // Function to render star rating
  const renderStars = (rating: number) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialCommunityIcons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={24}
          color={tokens.colors.gold}
          onPress={() => setRating(star)}  // Set the rating when a star is pressed
        />
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewTitle}>{item.customerName}</Text>
      <Text>{item.description}</Text>
      {renderStars(item.rating)} 
      <Text style={styles.reviewDate}>{formatTimeToPMAM(item.createdAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add Review Card */}
      {!provider ? <View style={styles.addReviewCard}>
        <TextInput
          style={styles.textArea}
          placeholder="Write your review..."
          value={newReview}
          onChangeText={setNewReview}
          multiline={true}
        />
        {renderStars(rating)} 

        <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
          <Text style={styles.addButtonText}>Add Review</Text>
        </TouchableOpacity>
      </View>: null}

      {/* Reviews List */}
     { reviews.length ? <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
      />:<ActivityIndicator size={'large'} color={tokens.colors.floraOnTapMainColor}/>}
    </View>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    width:Dimensions.get('screen').width
  },
  addReviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: tokens.colors.blackColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'GorditaRegular',
  },
  reviewsList: {
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: tokens.colors.fadedBackgroundGey,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'GorditaRegular',
  },
  reviewDate: {
    fontSize: 12,
    color: '#000',
    marginTop: 8,
    fontFamily: 'GorditaLight',
  },
});
