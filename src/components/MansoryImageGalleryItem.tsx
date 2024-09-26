import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ImageView from './ImageView';

interface ImageGalleryItemProps {
  uris: string[];
}

const MansoryImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ uris }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Open the modal with the clicked image
  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };
  const getRandomHeight = () => {
    const minHeight = 150;
    const maxHeight = 300;
    return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  };

  return (
    <>
      {uris.map((uri, index) => {
        console.log('Image URI:', uri); // Debugging the image URI
        return (
          <TouchableOpacity onPress={() => openModal(index)}>
          <View
            key={index}
            style={[styles.imageContainer, { height: getRandomHeight() }]}
          >
            <Image
              source={{ uri: uri.url }}
              style={styles.image}
              onError={() => console.log('Error loading image:', uri)} // Debugging image loading error
            />
          </View>
          </TouchableOpacity>
        );
      })}
      {isModalVisible && (
        <ImageView
          isVisible={isModalVisible}
          uris={uris}
          initialIndex={selectedIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#ccc', // Set a background color for placeholder effect
  },
});

export default MansoryImageGalleryItem;
