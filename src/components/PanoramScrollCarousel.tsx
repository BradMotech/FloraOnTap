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
  showUser:boolean;
  onPress:()=> void
}

const PanoramaScrollCarousel: React.FC<PanoramaScrollCarouselProps> = ({ images,onPress,showUser = true }) => {
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
          <TouchableOpacity style={styles.image} key={index} activeOpacity={0.8} onPress={onPress}>
            <Image resizeMode='cover' source={{ uri: imageItem.url }} style={{height:'100%',width:'100%',borderRadius:20}} />
            {showUser && <View
              style={{
                position: "absolute",
                bottom: -10,
                left: -5,
                marginLeft: 12,
                display: "flex",
                flexDirection: "row",
                justifyContent:'center',
                alignItems:'center',
                marginBottom:15,backgroundColor:'#000',
                padding:6,
                borderRadius:30
              }}
            >
              <Image
                resizeMode="cover"
                source={{ uri: imageItem.url }}
                style={{ height: 40, width: 40, borderRadius: 20 }}
              />
              <Text style={[globalStyles.title,{color:'#fff',fontSize:12}]}>{"  Flora on Tap"}</Text>
            </View>}
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
