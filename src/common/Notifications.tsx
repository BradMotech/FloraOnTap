import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";
import {
  deleteNotification,
  fetchNotificationsRealtime,
  updateNotificationReadStatus,
  updateNotificationReadStatusOnly,
  updateUserFriends,
} from "../firebase/dbFunctions";
import { AuthContext } from "../auth/AuthContext";
import { formatDate, formatReadableDate } from "../utils/dateFormat";

const Notifications = ({navigation}) => {
  const { userData, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const handleReadToggle = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );

    updateNotificationReadStatusOnly(id, "read", user?.uid,user?.uid);
  };

  const handleDelete = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    deleteUserNotifications(id)
  };

  async function deleteUserNotifications(id) {
    await deleteNotification(id, user.uid);
  }
  useEffect(() => {
    // Fetch notifications in real-time
    const unsubscribe = fetchNotificationsRealtime(
      user?.uid,
      (newNotifications) => {
        setNotifications(newNotifications);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [user?.uid]);

  function sendMessageToUser(data: { senderId: string }) {
    // updateUserFriends(data);
    navigation.navigate("ChatToFlorist",{selectedFriendId:data.senderId,selectedFriendName:''});
  }

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem,{borderColor:item.read === 'unread' ? '#2ecc71' : 'white'}]}>
      <View style={styles.notificationHeader}>
        <View style={{maxWidth:Dimensions.get('screen').width - 100,minWidth:Dimensions.get('screen').width - 150}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detailsText}>{formatDate(item.timestamp)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleReadToggle(item.id)}>
            <Ionicons
              name={item.read ? "chevron-up-outline" : "chevron-down-outline"}
              size={24}
              color="#7a7a7a"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={24} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>
      {item.read === 'read' && (
        <View style={styles.notificationDetails}>
          <Text style={styles.detailsText}>{item.details}</Text>
          {item.title === 'new message' && <TouchableOpacity onPress={()=>sendMessageToUser(item)}>
            <Text style={[styles.detailsText,{color:tokens.colors.skyBlueColor}]}>{'Reply'}</Text> 
            </TouchableOpacity>}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[globalStyles.safeArea, { marginTop: tokens.spacing.lg * 2.4 }]}
    >
      <StatusBar hidden={true} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, minHeight: "100%" }}
        //   refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //   }
      >
        <View style={styles.container}>
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f7", // Light background similar to iOS settings background
  },
  listContainer: {
    paddingBottom: 16,
  },
  notificationItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    maxWidth: "75%",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 16,
  },
  notificationDetails: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
  },
});

export default Notifications;
