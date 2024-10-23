// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import tokens from '../styles/tokens';
// import globalStyles from '../styles/globalStyles';
// import Badge from './Badge';

// interface Time {
//   hours: number;
//   minutes: number;
// }

// const TimePicker: React.FC<{ onTimeChange?: (time: Time) => void }> = ({ onTimeChange }) => {
//   const [selectedHours, setSelectedHours] = useState<number>(0);
//   const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
//   const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM'); // Default to AM

//   // Generate hours and minutes for the picker
//   const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
//   const minutes = Array.from({ length: 60 }, (_, i) => i);

//   // Handle change in hour selection
//   const handleHoursChange = (itemValue: number) => {
//     setSelectedHours(itemValue);
//     if (onTimeChange) onTimeChange({ hours: itemValue, minutes: selectedMinutes });
//   };

//   // Handle change in minutes selection
//   const handleMinutesChange = (itemValue: number) => {
//     setSelectedMinutes(itemValue);
//     if (onTimeChange) onTimeChange({ hours: selectedHours, minutes: itemValue });
//   };

//   // Determine AM or PM
//   const formatTime = (hours: number, minutes: number) => {
//     const amPm = selectedPeriod;
//     const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
//     const formattedMinutes = minutes.toString().padStart(2, '0');
//     return `${formattedHours}:${formattedMinutes} ${amPm}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Select Delivery Time</Text>
//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={selectedHours}
//           style={styles.picker}
//           onValueChange={handleHoursChange}
//           mode="dropdown" // Dropdown mode for consistency
//         >
//           {hours.map((hour) => (
//             <Picker.Item key={hour} label={hour.toString()} value={hour} />
//           ))}
//         </Picker>
//         <Text style={styles.separator}>:</Text>
//         <Picker
//           selectedValue={selectedMinutes}
//           style={styles.picker}
//           onValueChange={handleMinutesChange}
//           mode="dropdown" // Dropdown mode for consistency
//         >
//           {minutes.map((minute) => (
//             <Picker.Item key={minute} label={minute.toString()} value={minute} />
//           ))}
//         </Picker>
//         <Text style={styles.separator}> </Text>
//         <Picker
//           selectedValue={selectedPeriod}
//           style={styles.picker}
//           onValueChange={(value) => {
//             setSelectedPeriod(value);
//             const hours12 = value === 'PM' && selectedHours < 12 ? selectedHours + 12 : selectedHours;
//             if (onTimeChange) onTimeChange({ hours: hours12, minutes: selectedMinutes });
//           }}
//           mode="dropdown" // Dropdown mode for consistency
//         >
//           <Picker.Item label="AM" value="AM" />
//           <Picker.Item label="PM" value="PM" />
//         </Picker>
//       </View>
//       <View style={styles.selectedTime}>
//       <Text style={styles.selectedTime}>Selected Time: </Text>
//       <Badge variant='success' text={formatTime(selectedHours, selectedMinutes)}/>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: tokens.colors.bgFaint,
//     marginBottom: 6,
//     borderRadius: 14,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 0,
//     fontWeight: '500',
//     fontFamily:'GorditaMedium'
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     minWidth:Dimensions.get('screen').width - 60,
//     minHeight:Dimensions.get('screen').width/2 - 10,
//   },
//   picker: {
//     flex: 1, // Allow the picker to take up equal space
//     height: 50, // Uniform height for both platforms
//     backgroundColor: 'transparent', // Consistent background
//     borderRadius: 8, // Rounded edges for consistency
//     borderWidth: 1,
//     width:'100%',
//      fontFamily:'GorditaRegular',
//     borderColor: tokens.colors.inactive,
//     ...Platform.select({
//       ios: {
//         justifyContent: 'center', // Centering for iOS
//       },
//       android: {
//         paddingHorizontal: 5, // Android specific padding for a consistent look
//       },
//     }),
//   },
//   separator: {
//     fontSize: 20,
//     marginHorizontal: 10,
//   },
//   selectedTime: {
//     fontSize: 16,
//     fontWeight: '600',
//      fontFamily:'GorditaRegular',
//      alignItems:'center',
//      justifyContent:'center',
//      display:'flex',
//      flexDirection:'row'
//   },
// });

// export default TimePicker;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import tokens from '../styles/tokens';
import globalStyles from '../styles/globalStyles';
import Badge from './Badge';

interface Time {
  hours: number;
  minutes: number;
}

const TimePicker: React.FC<{ onTimeChange?: (time: Time) => void }> = ({ onTimeChange }) => {
  const [hours, setHours] = useState<string>('12');  // Default to 12
  const [minutes, setMinutes] = useState<string>('00'); // Default to 00
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');  // Default to AM

  // Function to handle hours change
  const handleHoursChange = (text: string) => {
    if (validateTimeInput(text, 1, 12)) {
      setHours(text);
      if (onTimeChange) onTimeChange({ hours: parseInt(text, 10), minutes: parseInt(minutes, 10) });
    }
  };

  // Function to handle minutes change
  const handleMinutesChange = (text: string) => {
    if (validateTimeInput(text, 0, 59)) {
      setMinutes(text);
      if (onTimeChange) onTimeChange({ hours: parseInt(hours, 10), minutes: parseInt(text, 10) });
    }
  };

  // Function to toggle between AM and PM
  const togglePeriod = () => {
    setPeriod((prev) => (prev === 'AM' ? 'PM' : 'AM'));
  };

  // Helper function to validate the time input (hours and minutes)
  const validateTimeInput = (text: string, min: number, max: number) => {
    const number = parseInt(text, 10);
    return text === '' || (!isNaN(number) && number >= min && number <= max);
  };

  // Format time for display
  const formatTime = (hours: string, minutes: string) => {
    const formattedHours = hours.padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Delivery Time</Text>
      <View style={styles.inputContainer}>
        {/* Input for Hours */}
        <TextInput
          style={styles.input}
          value={hours}
          onChangeText={handleHoursChange}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="HH"
        />
        <Text style={styles.separator}>:</Text>
        {/* Input for Minutes */}
        <TextInput
          style={styles.input}
          value={minutes}
          onChangeText={handleMinutesChange}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
        />
        <Text style={styles.separator}> </Text>
        {/* Button to toggle AM/PM */}
        <Text style={styles.period} onPress={togglePeriod}>
          {period}
        </Text>
      </View>
      <View style={styles.selectedTime}>
        <Text style={styles.selectedTimeLabel}>Selected Time: </Text>
        <Badge variant="success" text={formatTime(hours, minutes)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: tokens.colors.bgFaint,
    marginBottom: 6,
    borderRadius: 14,
    width:'100%'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    fontFamily: 'GorditaMedium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    borderColor: tokens.colors.inactive,
    backgroundColor: 'white',
    fontFamily: 'GorditaRegular',
  },
  separator: {
    fontSize: 20,
    marginHorizontal: 10,
    color: tokens.colors.textColor,
  },
  period: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'GorditaRegular',
    color: tokens.colors.blackColor,
    paddingHorizontal: 10,
  },
  selectedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  selectedTimeLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GorditaRegular',
  },
});

export default TimePicker;
