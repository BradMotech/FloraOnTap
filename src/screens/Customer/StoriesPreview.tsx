// import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

const StoriesPreview = ({ images }) => {
    // const route = useRoute();
    // const { images }: any = route.params
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0); // Progress of the current story
  const intervalRef = useRef(null); // Ref to hold the interval for progress

  // Move to the next story
  const goToNextStory = () => {
    if (currentStoryIndex < images.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  // Move to the previous story
  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  // Auto move to the next story after 5 seconds
  useEffect(() => {
    setProgress(0); // Reset progress when story changes

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(intervalRef.current);
          goToNextStory();
        }
        return prev + 0.01; // Increase progress over time
      });
    }, 50); // Adjust this for faster/slower progress (0.01 progress per 50ms = ~5 seconds)

    return () => clearInterval(intervalRef.current); // Clear interval when component unmounts
  }, [currentStoryIndex]);

  // Scroll to the current story
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: currentStoryIndex * width,
        animated: true,
      });
    }
  }, [currentStoryIndex]);

  return (
    <View style={styles.container}>
      {/* Scrollable stories */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        scrollEnabled={false} // Disable manual scrolling, we handle it ourselves
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.url }} style={styles.storyImage} />
        ))}
      </ScrollView>

      {/* Tap zones for skipping stories */}
      <View style={styles.tapZoneContainer}>
        <TouchableOpacity style={styles.tapZoneLeft} onPress={goToPrevStory} />
        <TouchableOpacity style={styles.tapZoneRight} onPress={goToNextStory} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {images.map((_, index) => (
          <View key={index} style={styles.progressBarWrapper}>
            <View
              style={[
                styles.progressBar,
                {
                  width: index === currentStoryIndex ? `${progress * 100}%` : index < currentStoryIndex ? '100%' : '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width,
    height,
    resizeMode: 'cover',
  },
  tapZoneContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    flexDirection: 'row',
  },
  tapZoneLeft: {
    width: '50%',
    height: '100%',
  },
  tapZoneRight: {
    width: '50%',
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    backgroundColor: '#333',
    marginHorizontal: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#fff',
  },
});

export default StoriesPreview;
