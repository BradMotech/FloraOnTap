import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import globalStyles from '../styles/globalStyles'; // Import your global styles
import tokens from '../styles/tokens';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.background} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.hairduMainColor, // You can adjust this color to match your theme
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: tokens.colors.background, // Adjust text color to fit your theme
  },
});

export default LoadingScreen;
