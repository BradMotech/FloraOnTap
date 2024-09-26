// import { PermissionsAndroid, Platform } from 'react-native';

// const requestLocationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'This app requires access to your location.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Location permission granted');
//         return true;
//       } else {
//         console.log('Location permission denied');
//         return false;
//       }
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   } else {
//     // For iOS, permissions are handled differently
//     // You may want to use a library like react-native-permissions for more granular control
//     return true; // Assuming permissions are always granted for iOS in this example
//   }
// };

// export default requestLocationPermission;
