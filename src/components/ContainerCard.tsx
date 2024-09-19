import React, { ReactNode } from 'react'; // Import ReactNode from 'react'
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import globalStyles from '../styles/globalStyles';

interface ContainerCardProps {
  children: ReactNode; // Allows for any valid React children
  style?: ViewStyle; // Optional style prop to extend or override default styles
}

const ContainerCard: React.FC<ContainerCardProps> = ({ children, style }) => {
  return (
    <View style={[globalStyles.containerCard, style]}>
      <ScrollView style={globalStyles.scrollInCardContainer}>
      {children} 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ContainerCard;
