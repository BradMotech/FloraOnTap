import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface TextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  placeholder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChangeText,
  maxLength = 200,
  placeholder = 'Type here...',
}) => {
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0);

  // Update height based on content size
  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setTextAreaHeight(contentHeight);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        maxLength={maxLength}
        multiline
        onContentSizeChange={handleContentSizeChange}
        style={[styles.textArea, { height: Math.max(35, textAreaHeight) }]}
      />
      <Text style={styles.charCount}>
        {value.length}/{maxLength}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  charCount: {
    marginTop: 5,
    color: '#888',
    fontSize: 14,
  },
});

export default TextArea;
