import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../auth/AuthContext";

type HeaderProps = {
  title: string;
  profileImageUrl: string;
  navigation: any;
};

const Header: React.FC<HeaderProps> = ({
  title,
  profileImageUrl,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { userData } = useContext(AuthContext);
  const firstLetter = userData?.name?.charAt(0).toUpperCase() || "Brad";

  return (
    <SafeAreaView style={[globalStyles.safeArea, { paddingTop: insets.top }]}>
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
            name={navigation.canGoBack() ? "arrow-back" : null}
            size={28}
            color={tokens.colors.blackColor}
          />
        </TouchableOpacity>
        <Text style={[globalStyles.title, { color: tokens.colors.blackColor }]}>
          {title}
        </Text>
        <TouchableOpacity>
          <View
            style={[
              globalStyles.imagePlaceholder,
              { height: 50, width: 50, borderRadius: 25, marginRight: 10 },
            ]}
          >
            <Text style={globalStyles.placeholderText}>{firstLetter}</Text>
          </View>
          {/* <Image source={{ uri: profileImageUrl }} style={globalStyles.profileImage} /> */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
