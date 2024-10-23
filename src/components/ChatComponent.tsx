import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ImageBackground, Platform, Keyboard } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebase';
import globalStyles from '../styles/globalStyles';
import tokens from '../styles/tokens';
import { updateNotificationReadStatus } from '../firebase/dbFunctions';

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: Timestamp;
}

const ChatComponent: React.FC<{ receiverId: string }> = ({ receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [currentUser.uid, receiverId]),
      where('receiverId', 'in', [currentUser.uid, receiverId])
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });

      fetchedMessages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
      setMessages(fetchedMessages);
      if (fetchedMessages.length > 0) {
        setLatestMessage(fetchedMessages[fetchedMessages.length - 1].text);
      } else {
        setLatestMessage(null);
      }
    });

    return unsubscribe;
  }, [currentUser, receiverId]);

  const sendMessage = async () => {
    Keyboard.dismiss();
    if (newMessage.trim() === '' || !currentUser) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      senderId: currentUser.uid,
      receiverId: receiverId,
      createdAt: Timestamp.now(),
    });

    setNewMessage('');
    await updateNotificationReadStatus(null,'unread',receiverId,'new message',newMessage,currentUser?.uid);
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleString(); // Includes both date and time
    } 
    return '';
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUser?.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.rightMessage : styles.leftMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{formatDate(item.createdAt)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust based on platform
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust for iOS if needed
    >
      <ImageBackground source={{ uri: 'https://hairdu2024.web.app/hairdubraidsbackground3.png' }} style={globalStyles.backgroundImage}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted={false}
          contentContainerStyle={styles.chatContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.latestMessageContainer}>
          <Text style={styles.latestMessageText}>{latestMessage || 'No messages yet'}</Text>
        </View> */}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chatContainer: {
    paddingVertical: 10,
    flexGrow: 1, // Ensure the FlatList grows to take available space
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  leftMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  rightMessage: {
    backgroundColor: '#d0e0ff',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  messageText: {
    fontSize: 16,
    fontFamily:'GorditaMedium'
  },
  messageTime: {
    fontSize: 10,
    fontFamily:'GorditaMedium',
    color:tokens.colors.textColor,
    marginTop:4
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#dddddd',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cccccc',
    fontFamily:'GorditaMedium'
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'GorditaMedium'
  },
  latestMessageContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#dddddd',
  },
  latestMessageText: {
    fontSize: 16,
    color: '#888',
    fontFamily:'GorditaMedium'
  },
});

export default ChatComponent;
