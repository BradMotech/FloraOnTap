import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import from react-native-vector-icons
import globalStyles from '../styles/globalStyles';
import tokens from '../styles/tokens';

interface SearchComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (text: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ value, onChangeText, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText(''); // Clear the input field
  };

  const handleSearch = () => {
    onSearch(value); // Trigger search with the current value
  };

  return (
    <View style={globalStyles.inputContainer}>
      <TextInput
        style={globalStyles.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value.length > 0 && isFocused ? (
        // Show clear icon if there's text and input is focused
        <TouchableOpacity style={styles.icon} onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color={tokens.colors.gray} />
        </TouchableOpacity>
      ) : (
        // Show search icon if input is empty or not focused
        <TouchableOpacity style={styles.icon} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={tokens.colors.gray} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});

export default SearchComponent;
