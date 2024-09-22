import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import tokens from "../styles/tokens";

const TextAreaComponent = ({ maxLength = 200, placeholder = "Type here...", onTextChange }) => {
  const [text, setText] = useState("");
  const [height, setHeight] = useState(40); // Initial height for the TextInput

  const handleTextChange = (inputText) => {
    setText(inputText);
    // Pass the text back to the parent component
    if (onTextChange) {
      onTextChange(inputText);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.textArea, { height: Math.max(40, height) }]}
        multiline={true}
        onChangeText={handleTextChange}
        onContentSizeChange={(event) =>
          setHeight(event.nativeEvent.contentSize.height)
        }
        value={text}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
      <Text style={styles.counter}>
        {text.length} / {maxLength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
    borderColor:tokens.colors.inactive,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  textArea: {
    fontSize: 16,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  counter: {
    textAlign: "right",
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
});

export default TextAreaComponent;
