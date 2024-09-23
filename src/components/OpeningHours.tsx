import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '../styles/tokens';

interface OpeningHoursProps {
  hours: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

const OpeningHours: React.FC<OpeningHoursProps> = ({ hours }) => {
    function formatTime(
        date: { seconds: number; nanoseconds: number } | null
      ): string {
        if (!date) return ""; // Handle null input
    
        // Convert Firestore timestamp to a JavaScript Date object
        const jsDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    
        const hours = jsDate.getHours();
        const minutes = jsDate.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
        const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits
    
        return `${formattedHours}:${formattedMinutes}${ampm}`;
      }

  return (
    <View style={styles.container}>
      {hours.map((hour, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.day}>{hour.day}</Text>
          <Text style={styles.time}>{formatTime(hour.startTime as any) + " - "+ formatTime(hour.endTime as any)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius:12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.fadedBackgroundGey,
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    color: '#555',
  },
});

export default OpeningHours;
