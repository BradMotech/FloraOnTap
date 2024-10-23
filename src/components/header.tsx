import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,StyleSheet,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {  fetchNotificationsRealtime } from "../firebase/dbFunctions";

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
  const { userData,user } = useContext(AuthContext);
  const [notificationList, setNotificationList] = useState<any>([]);
  const firstLetter = userData?.name?.charAt(0).toUpperCase();
  function onNotificationsPress(){
    navigation.navigate('Notifications')
  }

  useEffect(() => {
    // Fetch notifications in real-time
    const unsubscribe = fetchNotificationsRealtime(user?.uid, (newNotifications) => {
      const unRead = newNotifications.filter((d)=> d.read === "unread")
      setNotificationList(unRead)
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [user?.uid]);


  return (
    <SafeAreaView style={[globalStyles.safeArea, { paddingTop: insets.top }]}>
      <View style={globalStyles.headerContainer}>
        { <TouchableOpacity
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
        </TouchableOpacity>}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            globalStyles.title,
            { color: tokens.colors.blackColor, minWidth: 120,maxWidth: 120 },
          ]}
        >
          {title}
        </Text>
        <TouchableOpacity onPress={onNotificationsPress}>
          <View
            style={[styles.iconContainer, { marginRight: -100 }]}
          >
            {/* Notification Icon */}
            <Ionicons size={24} name="notifications-outline" />

            {/* Badge */}
            {notificationList.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationList.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
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
const styles = StyleSheet.create({
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 4, // Adjust position as needed
    top: 4, // Adjust position as needed
    backgroundColor: tokens.colors.skyBlueColor,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
export default Header;
