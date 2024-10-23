import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Image, TouchableOpacity, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import tokens from '../styles/tokens';

interface ImageViewProps {
  isVisible: boolean;
  uris: { url: string }[];
  initialIndex: number;
  onClose: () => void;
}

const ImageView: React.FC<ImageViewProps> = ({ isVisible, uris, initialIndex, onClose }) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: initialIndex, animated: true });
    }
  }, [initialIndex, isVisible]);

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          {/* Image Slider */}
          <FlatList
            ref={flatListRef}
            data={uris}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: Dimensions.get('window').width,
              offset: Dimensions.get('window').width * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={styles.modalImage} />
            )}
          />

          {/* Current Image Index */}
          <Text style={styles.imageIndex}>
            {currentIndex + 1} / {uris.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: tokens.colors.blackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  imageIndex: {
    color: 'white',
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
  },
});

export default ImageView;
