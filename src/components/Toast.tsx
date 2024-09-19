import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number; // Duration in milliseconds
  type: 'success' | 'info' | 'warning' | 'danger';
  position: 'top' | 'middle' | 'bottom'; // New position prop
}

const Toast: React.FC<ToastProps> = ({ message, visible, duration = 3000, type, position }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();

      const hideToast = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }, duration);

      return () => clearTimeout(hideToast);
    }
  }, [visible, fadeAnim, duration]);

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }, styles[type], styles[position]]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
  success: {
    backgroundColor: '#28a745', // Green
  },
  info: {
    backgroundColor: '#17a2b8', // Blue
  },
  warning: {
    backgroundColor: '#ffc107', // Yellow
  },
  danger: {
    backgroundColor: '#dc3545', // Red
  },
  top: {
    top: 50,
  },
  middle: {
    top: '50%',
    transform: [{ translateY: '-50%'}],
  },
  bottom: {
    bottom: 50,
  },
});

export default Toast;
