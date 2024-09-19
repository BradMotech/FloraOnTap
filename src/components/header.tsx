import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../styles/globalStyles';
import tokens from '../styles/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderProps = {
  title: string;
  profileImageUrl: string;
  navigation:any
};

const Header: React.FC<HeaderProps> = ({ title, profileImageUrl ,navigation}) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[globalStyles.safeArea,{ paddingTop: insets.top }]}>  
      <View style={globalStyles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              // Implement any action for the menu button if needed
            }
          }}
        >
          <MaterialIcons 
            name={navigation.canGoBack() ? "arrow-back" : "menu"} 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
        <Text style={[globalStyles.title, { color: tokens.colors.background }]}>{title}</Text>
        <TouchableOpacity>
          <Image source={{ uri: profileImageUrl }} style={globalStyles.profileImage} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
