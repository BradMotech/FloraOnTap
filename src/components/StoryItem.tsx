import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import globalStyles from '../styles/globalStyles';

interface StoryItemProps {
  onPress: () => void;
  src: string;
}

const StoryItem: React.FC<StoryItemProps> = ({ onPress, src }) => {
  return (
    <TouchableOpacity onPress={onPress} style={globalStyles.Storycontainer}>
      <Svg height="80" width="80" style={globalStyles.StorySvg}>
        <Circle
          cx="40"
          cy="40"
          r="40"
          stroke="#E1306C" // Color for the border
          strokeWidth="3"
          fill="transparent"
        />
      </Svg>
      <Image source={{ uri: src }} style={globalStyles.StoryImage} />
    </TouchableOpacity>
  );
};

export default StoryItem;
