import React, { forwardRef, useState } from 'react';
import { StyleSheet, View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
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
  placeholder?:string,
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
}, ref,...props) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(prevState => !prevState);
  };

  return (
    <View style={[
      globalStyles.inputContainer,
      { borderColor: error ? tokens.colors.error : tokens.colors.inactive }
    ]}>
      <Ionicons name={iconName} size={20} color={tokens.colors.gray} style={styles.icon} />
      <TextInput
        ref={ref}
        style={globalStyles.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        {...props}
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
});

export default InputComponent;
