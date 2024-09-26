import React from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get device width to size images

interface ImageItem {
  url: string;
  href: string;
}

interface PanoramaScrollCarouselProps {
  images: ImageItem[];
}

const PanoramaScrollCarousel: React.FC<PanoramaScrollCarouselProps> = ({ images }) => {
  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled // Enables snapping to each image
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((imageItem, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              // Handle press navigation to the `href`
              // For example, you can use navigation.navigate if using react-navigation
              console.log(`Navigating to: ${imageItem.href}`);
            }}
          >
            <Image source={{ uri: imageItem.url }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: width * 0.6, // Adjust height relative to width for a panoramic look
    marginVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  image: {
    width: width - 40, // Width with some margin for better look
    height: width * 0.6,
    borderRadius: 10,
    marginHorizontal: 2,
    resizeMode: 'cover',
  },
});

export default PanoramaScrollCarousel;
