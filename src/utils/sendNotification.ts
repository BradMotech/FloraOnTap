// import { firebase } from "@react-native-firebase/messaging";
import '@react-native-firebase/functions';

// Function to send notification
export const sendNotification = async (token: string, title: string, body: string) => {
    const firebaseServerKey = 'BPWYdb0-U3U3uQXBNdezuLBSpz0N_-7_wNbOu7aTwIUO_qwCpxiygT_jh01M3gLneFIHenSKw90rfkEdImS6dik'; // Get this from Firebase Console > Project Settings > Cloud Messaging
  
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Authorization': `key=${firebaseServerKey}`, // Server key from Firebase project settings
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token, // The FCM device token
          notification: {
            title: title, // Notification title
            body: body,   // Notification body
          },
          // Optional data payload if you want to pass extra data
          data: {
            customDataKey: 'customDataValue',
          },
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Notification sent successfully:', result);
      } else {
        console.error('Error sending notification:', result);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

