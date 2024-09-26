import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapComponent = ({ region }) => {
  // Dummy region for demonstration
  const defaultRegion = {
    latitude: -34.9285,  // Example coordinates (Adelaide, Australia)
    longitude: 138.6007,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const initialRegion = region || defaultRegion;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        loadingEnabled={true}
      >
        <Marker coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 190, // Set the height of the container
    width: '100%', // Make it full width
    borderRadius:12
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Fill the container
  },
});

export default MapComponent;
