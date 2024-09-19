
import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';

interface ImageGalleryItemProps {
  uris: { uri: string }[]; // Array of objects with a `uri` property
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ uris }) => {
  // Render each image
  const renderItem = ({ item }: { item: { url: string } }) => (
    <Image source={{ uri: item.url }} style={styles.image} />
  );

  return (
    <FlatList
      data={uris}
      renderItem={renderItem}
      keyExtractor={(item) => item.uri} // Ensure URIs are unique
      numColumns={3} // Adjust this based on the number of images per row
      contentContainerStyle={styles.container}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  image: {
    width: 100, // Fixed width
    height: 100, // Fixed height
    margin: 5,  // Optional margin between images
    resizeMode: 'cover', // Ensure images cover the area without distortion
  },
});

export default ImageGalleryItem;
