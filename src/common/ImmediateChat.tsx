import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import ChatScreen from '../screens/Provider/ChatScreen';
import ChatComponent from '../components/ChatComponent';
import globalStyles from '../styles/globalStyles';
import { Ionicons } from '@expo/vector-icons'; 
import tokens from '../styles/tokens';
import { useRoute } from '@react-navigation/native';

const ImmediateChat = () => {
    const route = useRoute();
    const { selectedFriendId,selectedFriendName }: any = route.params;
    return (
        <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
        <TouchableOpacity style={{ marginLeft: 16,marginTop:tokens.spacing.xs * 2,width:'100%',alignItems:'center',flexDirection:'row' }}>{selectedFriendName !== '' && <Text>Chatting to <Text style={{fontWeight:'700'}}>{selectedFriendName}</Text></Text>}</TouchableOpacity>
        <ChatComponent receiverId={selectedFriendId} />
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default ImmediateChat;
