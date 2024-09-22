
// import React from 'react';
// import { View, Image, StyleSheet, FlatList } from 'react-native';

// interface ImageGalleryItemProps {
//   uris: { uri: string }[]; // Array of objects with a `uri` property
// }

// const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({ uris }) => {
//   // Render each image
//   const renderItem = ({ item }: { item: { url: string } }) => (
//     <Image source={{ uri: item.url }} style={styles.image} />
//   );

//   return (
//     <FlatList
//       data={uris}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.uri} // Ensure URIs are unique
//       numColumns={3} // Adjust this based on the number of images per row
//       contentContainerStyle={styles.container}
//     />
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     // justifyContent: 'center',
//     // alignItems: 'center',
//   },
//   image: {
//     width: 100, // Fixed width
//     height: 100, // Fixed height
//     margin: 5,  // Optional margin between images
//     resizeMode: 'cover', // Ensure images cover the area without distortion
//   },
// });

// export default ImageGalleryItem;


import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ImageView from './ImageView';

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

  // Render each image
  // const renderItem = ({ item, index }: { item: { uri: string }; index: number }) => (
  //   <TouchableOpacity onPress={() => openModal(index)}>
  //     <Image source={{ uri: item.uri }} style={styles.image} />
  //    </TouchableOpacity>
  // );

  const renderItem = ({ item ,index}: { item: { url: string };index }) => (
    <TouchableOpacity onPress={() => openModal(index)}>
    <Image source={{ uri: item.url }} style={styles.image} />
    </TouchableOpacity> 
  );

  return (
    <>
<FlatList
        data={uris}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        numColumns={3} // Adjust based on the number of images per row
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
    margin: 5,  // Optional margin between images
    resizeMode: 'cover', // Ensure images cover the area without distortion
  },
});

export default ImageGalleryItem;

