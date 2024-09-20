import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image,Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import globalStyles from '../styles/globalStyles';
import tokens from '../styles/tokens';

interface StoryItemProps {
  onPress: () => void;
  src: string;
  name: string;
}

const StoryItem: React.FC<StoryItemProps> = ({ onPress, src ,name}) => {
  const firstLetter = name.charAt(0).toUpperCase();
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
      {src ? <Image source={{ uri: src }} style={globalStyles.StoryImage} />:<View style={[globalStyles.StoryImage,{backgroundColor:tokens.colors.hairduMainColor,alignItems:'center',justifyContent:'center'}]}><Text style={globalStyles.placeholderText}>{firstLetter}</Text></View>}
    </TouchableOpacity>
  );
};

export default StoryItem;
