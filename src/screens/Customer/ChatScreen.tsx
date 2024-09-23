import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import ChatComponent from '../../components/ChatComponent';
import { fetchUserFriendsData } from '../../firebase/dbFunctions';
import tokens from '../../styles/tokens';
import LoadingScreen from '../../components/LoadingScreen';
import { useRoute } from '@react-navigation/native';
import globalStyles from '../../styles/globalStyles';


interface Friend {
  id: string;
  name: string; // Assuming the Users collection has a 'name' field
  image: string; // Assuming the Users collection has a 'name' field
}

const ChatScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedFriendName, setSelectedFriendName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch friends on component mount
  useEffect(() => {

    const loadFriends = async () => {
      try {
        const fetchedFriends = await fetchUserFriendsData(); // Fetch friends from Firebase
        setFriends(fetchedFriends); // Set fetched friends
        setIsLoading(false)
        console.warn("🚀 ~ loadFriends ~ fetchedFriends:", fetchedFriends)
      } catch (error) {
        console.error("Error fetching friends:", error);
      } 
    };

    loadFriends();
  }, []);

  // Render a single friend item
  const renderFriendItem = ({ item }: { item: Friend }) => {
    // Extract the first letter of the friend's name
    const firstLetter = item.name.charAt(0).toUpperCase();
  
    return (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={() => {
          setSelectedFriendId(item.id);
          setSelectedFriendName(item.name);
        }} // When friend is selected, pass their ID
      >
        <View style={styles.row}>
          {item.image ? (
            <Image style={styles.image} source={{ uri: item.image }} />
          ) : (
            // Display the first letter as a fallback if there's no image
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>{firstLetter}</Text>
            </View>
          )}
          <Text style={styles.friendName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  // If a friend is selected, show the chat screen
  if (selectedFriendId) {
    return (
      <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
        <TouchableOpacity onPress={()=>setSelectedFriendId(null)} style={{ marginLeft: 16,marginTop:tokens.spacing.xs * 2,width:'100%',alignItems:'center',flexDirection:'row' }}><Ionicons name='chevron-back' size={22} /><Text>Chatting to <Text style={{fontWeight:'700'}}>{selectedFriendName}</Text></Text></TouchableOpacity>
        <ChatComponent receiverId={selectedFriendId} />
      </SafeAreaView>
    );
  }

  // Render friends list if no friend is selected yet
  return !isLoading ? (
    <SafeAreaView   style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
    <View style={{ flex: 1, width: "100%" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Salons:</Text>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
          ListEmptyComponent={
            <>
              {isLoading ? <ActivityIndicator
                size="large"
                color={tokens.colors.hairduMainColor}
              /> :  <Text>No friends found.</Text>}
             
            </>
          }
          contentContainerStyle={styles.friendsList}
        />
      </View>
    </View>
    </SafeAreaView>
  ) : (
    <LoadingScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily:'GorditaMedium'
  },
  friendsList: {
    flexGrow: 1,
  },
  image: {
    height: 40,
    width: 40,borderRadius:20
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  friendItem: {
    padding: 18,
    backgroundColor: tokens.colors.bgFaint,
    borderRadius: 3,
    marginVertical: 5,
    borderBottomColor: tokens.colors.inactive,
    borderBottomWidth: 0.5,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "300",
    marginLeft:16,
    fontFamily:'GorditaMedium'
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.hairduMainColor, // Placeholder background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    color: '#fff', // Text color for the placeholder
  },
});

export default ChatScreen;
