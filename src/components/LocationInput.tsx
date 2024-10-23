import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For the search icon
import { FontAwesome } from '@expo/vector-icons'; // For the blue dot and pin
import tokens from '../styles/tokens';
import globalStyles from '../styles/globalStyles';

const LocationInput = ({ label, placeholder, onSearchPress, onLocationSelect,selectedLocation,showSubTitle = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
  
    useEffect(() => {
      if(selectedLocation){
        setInputValue(selectedLocation)
      }
    }, []);

    // Fetching place suggestions from Google Places API
    const fetchPlaceSuggestions = async (input) => {
      if (input.length < 3) return; // Start searching after 3 characters
  
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyCbCTiO9UHe5adLop_2AZux7QwBDBljYVQ`;
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        if (data.predictions) {
          setSuggestions(data.predictions);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
  
    // Fetch place details (to get location coordinates) using the place ID
    const fetchPlaceDetails = async (placeId) => {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCbCTiO9UHe5adLop_2AZux7QwBDBljYVQ`;
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        if (data.result) {
          const { geometry, name } = data.result;
          const locationDetails = {
            placeName: name,
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
          };
          return locationDetails;
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };
  
    // Handle input change and fetch suggestions
    const handleInputChange = (text) => {
      setInputValue(text);
      fetchPlaceSuggestions(text);
    };
  
    // Handle location selection
    const handleLocationSelect = async (placeId) => {
      try {
        // Fetch the location details using the placeId
        const locationDetails = await fetchPlaceDetails(placeId);
        console.log("🚀 ~ handleLocationSelect ~ locationDetails:", locationDetails)
        
        // Ensure the details are successfully fetched before proceeding
        if (locationDetails) {
          console.log('Location details fetched:', locationDetails); // For debugging
          
          // Call the parent's callback with the location details
          onLocationSelect(locationDetails);
          
          // Set the input value to the selected place name
          setInputValue(locationDetails.placeName);
          
          // Clear the suggestions list after the location is selected
          setSuggestions([]);
        } else {
          console.warn('Location details could not be fetched');
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        {showSubTitle && <Text
              style={[globalStyles.subtitle, { marginTop: tokens.spacing.md, marginBottom: tokens.spacing.md}]}
            >
              {'Will only show Flora providers within a 45km radius from your location.'}
            </Text>}
        <View style={styles.inputContainer}>
          {/* Left side: Blue dot */}
          <View style={styles.iconWrapperLeft}>
            <FontAwesome name="dot-circle-o" size={24} color={tokens.colors.hairduTextColorGreen} />
          </View>
  
          {/* Input field */}
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={inputValue}
            onChangeText={handleInputChange}
          />
  
          {/* Right side: Search icon */}
          <TouchableOpacity onPress={onSearchPress} style={styles.iconWrapperRight}>
            <MaterialIcons name="search" size={24} color="#666" />
          </TouchableOpacity>
        </View>
  
        {/* Display location suggestions */}
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleLocationSelect(item.place_id)}
              >
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

export default LocationInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingRight: 10, // Space for the search icon
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  iconWrapperLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10, // Space between icon and input
    marginRight: 5, // Separate the icon from the input field
    borderRightColor:'grey',
    borderRightWidth:0.8,
    paddingRight:3
  },
  trailLine: {
    width: 1,
    height: 30,
    backgroundColor: '#ccc',
    marginVertical: 2,
  },
  iconWrapperRight: {
    padding: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    fontSize: 16,
  },
});
