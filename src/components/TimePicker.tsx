import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tokens from '../styles/tokens';
import globalStyles from '../styles/globalStyles';

interface Time {
  hours: number;
  minutes: number;
}

const TimePicker: React.FC<{ onTimeChange?: (time: Time) => void }> = ({ onTimeChange }) => {
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM'); // Default to AM

  // Generate hours and minutes for the picker
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Handle change in hour selection
  const handleHoursChange = (itemValue: number) => {
    setSelectedHours(itemValue);
    if (onTimeChange) onTimeChange({ hours: itemValue, minutes: selectedMinutes });
  };

  // Handle change in minutes selection
  const handleMinutesChange = (itemValue: number) => {
    setSelectedMinutes(itemValue);
    if (onTimeChange) onTimeChange({ hours: selectedHours, minutes: itemValue });
  };

  // Determine AM or PM
  const formatTime = (hours: number, minutes: number) => {
    const amPm = selectedPeriod;
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Time</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedHours}
          style={styles.picker}
          onValueChange={handleHoursChange}
        >
          {hours.map((hour) => (
            <Picker.Item key={hour} label={hour.toString()} value={hour} />
          ))}
        </Picker>
        <Text style={styles.separator}>:</Text>
        <Picker
          selectedValue={selectedMinutes}
          style={styles.picker}
          onValueChange={handleMinutesChange}
        >
          {minutes.map((minute) => (
            <Picker.Item key={minute} label={minute.toString()} value={minute} />
          ))}
        </Picker>
        <Text style={styles.separator}> </Text>
        <Picker
          selectedValue={selectedPeriod}
          style={styles.picker}
          onValueChange={(value) => {
            setSelectedPeriod(value);
            const hours12 = value === 'PM' && selectedHours < 12 ? selectedHours + 12 : selectedHours;
            if (onTimeChange) onTimeChange({ hours: hours12, minutes: selectedMinutes });
          }}
        >
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>
      <Text style={styles.selectedTime}>Selected Time: <Text style={globalStyles.value}>{formatTime(selectedHours, selectedMinutes)}</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: tokens.colors.bgFaint,
    marginBottom: 6,
    borderRadius: 14,
  },
  label: {
    fontSize: 16,
    marginBottom: 0,
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 80,
  },
  separator: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  selectedTime: {
    fontSize: 16,
    fontWeight:'600'
  },
});

export default TimePicker;