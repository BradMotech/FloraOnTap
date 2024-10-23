import React from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, View, Dimensions, Text } from 'react-native';
import globalStyles from '../styles/globalStyles';

const { width } = Dimensions.get('window'); // Get device width to size images

interface ImageItem {
  url: string;
  href: string;
}

interface PanoramaScrollCarouselProps {
  images: ImageItem[];
  onPress:()=> void
}

const PanoramaScrollCarousel: React.FC<PanoramaScrollCarouselProps> = ({ images,onPress }) => {
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
          <TouchableOpacity key={index} activeOpacity={0.8} onPress={onPress}>
            <Image source={{ uri: imageItem.url }} style={styles.image} />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                marginLeft: 22,
                display: "flex",
                flexDirection: "row",
                justifyContent:'center',
                alignItems:'center',
                marginBottom:15,backgroundColor:'#000',
                padding:6,
                borderRadius:12
              }}
            >
              <Image
                source={{ uri: imageItem.url }}
                style={{ height: 40, width: 40, borderRadius: 20 }}
              />
              <Text style={[globalStyles.title,{color:'#fff'}]}>{" Burgeon Flora"}</Text>
            </View>
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
