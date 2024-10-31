
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ImageView from "./ImageView";

interface ImageGalleryItemProps {
  uris: { uri: string }[]; // Array of objects with a `uri` property
}

const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ uris }) => {
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

  const renderItem = ({ item, index }: { item: { url: string }; index }) => (
    <TouchableOpacity onPress={() => openModal(index)}>
      <Image source={{ uri: item.url }} style={[styles.image,{width:uris.length <= 3 ? (Dimensions.get('screen').width/2-20) :100,height:uris.length <= 3 ? (Dimensions.get('screen').width/2-20) :100},{width:uris.length == 1  ? (Dimensions.get('screen').width-50) :100,height:uris.length === 1 ? (Dimensions.get('screen').width/1.2) :100}]} />
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={uris}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        numColumns={uris.length <= 3 ? 2 : 3} // Adjust based on the number of images per row
        contentContainerStyle={styles.container}
      />

      {/* ImageView Modal */}
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

// Styles
const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  image: {
    width: 100, // Fixed width
    height: 100, // Fixed height
    margin: 5, // Optional margin between images
    borderRadius:8,
    resizeMode: "cover", // Ensure images cover the area without distortion
  },
});

export default ImageGalleryItem;
