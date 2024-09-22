import AsyncStorage from '@react-native-async-storage/async-storage';


export const getTokenFromStorage = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('fcmToken');
      if (token !== null) {
        console.log("Token retrieved from AsyncStorage:", token);
        return token;
      } else {
        console.log("No token found in AsyncStorage");
        return null;
      }
    } catch (error) {
      console.log("Failed to retrieve token from AsyncStorage", error);
      return null;
    }
  };