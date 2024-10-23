import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";

const Walkthrough = ({ elements, isVisible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementPosition, setElementPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible && elements[currentStep]?.ref?.current) {
      // Measure the position and size of the target element
      elements[currentStep].ref.current.measureInWindow((x, y, width, height) => {
        setElementPosition({ x, y, width, height });
      });

      // Animate the overlay opacity
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, currentStep]);

  const handleNext = () => {
    if (currentStep < elements.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Close if it's the last step
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        {/* Top overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              top: 0,
              left: 0,
              right: 0,
              height: elementPosition.y,
              opacity: animatedOpacity,
            },
          ]}
        />

        {/* Bottom overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              top: elementPosition.y + elementPosition.height,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: animatedOpacity,
            },
          ]}
        />

        {/* Left overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              top: elementPosition.y,
              left: 0,
              width: elementPosition.x,
              height: elementPosition.height,
              opacity: animatedOpacity,
            },
          ]}
        />

        {/* Right overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              top: elementPosition.y,
              left: elementPosition.x + elementPosition.width,
              right: 0,
              height: elementPosition.height,
              opacity: animatedOpacity,
            },
          ]}
        />

        {/* Tooltip / Description */}
        <View style={styles.tooltip}>
          <Text style={styles.description}>{elements[currentStep]?.description}</Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep < elements.length - 1 && (
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          )}

          {currentStep === elements.length - 1 && (
            <TouchableOpacity onPress={onClose} style={styles.nextButton}>
              <Text style={styles.nextText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  tooltip: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  navigationContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Walkthrough;
