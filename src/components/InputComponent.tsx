import React, { forwardRef, useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TextInputProps, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or import from 'react-native-vector-icons/Ionicons'
import globalStyles from '../styles/globalStyles';
import tokens from '../styles/tokens';
import { IoniconName } from '../types/IconTypes';

interface InputComponentProps {
  iconName: IoniconName; // Use the type defined
  error?: boolean;
  value: string;
  keyboardType: TextInputProps['keyboardType'];
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  ref?: React.RefObject<TextInput>;
  secureTextEntry?: boolean; // Add secureTextEntry prop
  placeholder?: string;
}

const InputComponent = forwardRef<TextInput, InputComponentProps>(({
  iconName,
  error,
  value,
  keyboardType,
  onChangeText,
  onSubmitEditing,
  secureTextEntry = false, // Default to false
  placeholder
}, ref) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [inputError, setInputError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password validation logic
  const validatePassword = (text: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Minimum 8 characters, at least 1 uppercase letter and 1 number
    if (!passwordRegex.test(text)) {
      setInputError(true);
      setErrorMessage('Password must be at least 8 characters long, contain an uppercase letter and a number');
    } else {
      setInputError(false);
      setErrorMessage('');
    }
  };

  // Text validation logic (minimum 3 characters)
  const validateText = (text: string) => {
    if (text.length < 3) {
      setInputError(true);
      setErrorMessage('Text must be at least 3 characters long');
    } else {
      setInputError(false);
      setErrorMessage('');
    }
  };

  // Validation logic triggered on text change
  const handleTextChange = (text: string) => {
    onChangeText(text);
    if (isSecure) {
      validatePassword(text);
    } else {
      validateText(text);
    }
  };

  const toggleSecureEntry = () => {
    setIsSecure(prevState => !prevState);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={[
        globalStyles.inputContainer,
        {
          borderColor: inputError ? tokens.colors.error : tokens.colors.inactive,
          borderWidth: 0.5,
          borderRadius: 8
        }
      ]}>
        <Ionicons name={iconName} size={20} color={tokens.colors.gray} style={styles.icon} />
        <TextInput
          ref={ref}
          style={globalStyles.inputField}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={isSecure} // Use the state to toggle secure text entry
          onSubmitEditing={onSubmitEditing} // Handle Enter key
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.toggleButton} onPress={toggleSecureEntry}>
            <Ionicons
              name={isSecure ? "eye-off" : "eye"}
              size={20}
              color={tokens.colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Show error message if validation fails */}
      {inputError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  errorText: {
    color: tokens.colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default InputComponent;
