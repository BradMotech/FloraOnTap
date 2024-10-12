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

  // Format Firestore timestamps or return the time as is with AM/PM
  function formatTime(time: { seconds: number; nanoseconds: number } | string): string {
    // Check if the input is a string
    if (typeof time === "string") {
      // If the string already contains 'AM' or 'PM', return it as is
      if (time.toUpperCase().includes("AM") || time.toUpperCase().includes("PM")) {
        return time;
      }

      // If no 'AM' or 'PM' is found, append AM/PM based on basic assumptions
      const [hourPart, minutePart] = time.split(':');
      const hours = parseInt(hourPart, 10);

      // Determine AM/PM based on the hour value
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM

      return `${formattedHours}:${minutePart}${ampm}`;
    }

    // Handle Firestore timestamp formatting
    if (time && typeof time === "object" && "seconds" in time && "nanoseconds" in time) {
      const jsDate = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);
      
      const hours = jsDate.getHours();
      const minutes = jsDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM/PM
      const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits

      return `${formattedHours}:${formattedMinutes}${ampm}`;
    }

    return ""; // Return an empty string if input doesn't match either case
  }

  return (
    <View style={styles.container}>
      {hours.map((hour, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.day}>{hour.day}</Text>
          <Text style={styles.time}>
            {formatTime(hour.startTime) + " - " + formatTime(hour.endTime)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
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
    color: '#555',
  },
  time: {
    fontSize: 16,
    color: '#555',
  },
});

export default OpeningHours;
