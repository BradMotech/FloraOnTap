import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";

interface Props {
  marginTop?: number;
  borderWidth?: number; // Updated type to match React Native's expected number type for borderWidth
  borderColor?: string; // Updated type to match React Native's expected color type
  textColor?: string; // Fixed type to match React Native's expected color type
  text: string;
  width?: number;
  buttonColor?: string;
  onPress?: () => void; 
}

const ButtonComponent = ({
  marginTop,
  text,
  textColor,
  borderColor,
  borderWidth,
  buttonColor,
  width,
  onPress
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        globalStyles.buttonWrapper,
        {
          marginTop: marginTop,
          borderColor: borderColor ? borderColor : null,
          borderWidth: borderWidth ? borderWidth : null,
          backgroundColor:buttonColor ? buttonColor : tokens.colors.hairduMainColor,
          width:width ? width :'100%'
        },
      ]}
      onPress={onPress}
    >
      {textColor ? (
        <Text style={[globalStyles.buttonTextColor, { color: textColor }]}>
          {text}
        </Text>
      ) : (
        <Text style={globalStyles.buttonTextColor}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonComponent;
