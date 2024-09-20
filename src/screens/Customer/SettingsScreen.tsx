import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "../../styles/globalStyles";
import tokens from "../../styles/tokens";
import { AuthContext } from "../../auth/AuthContext";
import LoadingScreen from "../../components/LoadingScreen";

const ListItem = ({ title, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Text style={styles.listText}>{title}</Text>
    <MaterialIcons
      name="chevron-right"
      size={24}
      color={tokens.colors.hairduMainColor}
    />
  </TouchableOpacity>
);

const SettingsScreen = ({navigation}) => {
  const { logOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      }, 2000);
  }, []);
  const handleLogout = () => {
    logOut(); // Clear the user's authentication
    // Reset the navigation stack and navigate to the Login screen inside AuthNavigator
    setTimeout(() => {
      setIsLoading(false)
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthNavigator' }],
      });
    }, 3000);
  };
  return !isLoading ? (
    <SafeAreaView>
    <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={[styles.container,{width:'100%'}]}>
        <View style={globalStyles.separatorNoColor}></View>
        <View style={globalStyles.separatorNoColor}></View>
      <Text style={[globalStyles.title,{textAlign:'center'}]}>Settings</Text>
      <View style={styles.container}>
        <ListItem
          title="Privacy Policy"
          onPress={() => {
            /* Handle Privacy Policy navigation */
          }}
        />
        <ListItem
          title="Send Us a WhatsApp"
          onPress={() => {
            /* Handle WhatsApp navigation */
          }}
        />
        <ListItem
          title="Send Us an Email"
          onPress={() => {
            /* Handle Email navigation */
          }}
        />
        <ListItem
          title="FAQ"
          onPress={() => {
            navigation.navigate('FAQ')
          }}
        />
        <ListItem
          title="Logout"
          onPress={() => {
            /* Handle Email navigation */ 
            handleLogout()
          }}
        />
      </View>
        </View>
    </ScrollView>
    </SafeAreaView>
  ):(<LoadingScreen/>);
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    flex: 1,
    height:'100%'
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SettingsScreen;
