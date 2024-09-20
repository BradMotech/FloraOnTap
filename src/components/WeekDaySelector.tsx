import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import tokens from "../styles/tokens";

const daysOfWeek = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

const WeekdaySelector = ({ selectedDays, setSelectedDays }) => {
  const [showTimePicker, setShowTimePicker] = useState({
    dayId: null,
    type: null, // 'start' or 'end'
  });
  const [timeSelection, setTimeSelection] = useState({});

  // Handle toggling a day
  const handleDaySelect = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  // Handle showing the time picker
  const showTimePickerForDay = (dayId, type) => {
    setShowTimePicker({ dayId, type });
  };

  // Handle time picker change
  const onTimeChange = (event, selectedTime) => {
    if (showTimePicker.dayId !== null && showTimePicker.type) {
      const updatedTime = {
        ...timeSelection,
        [showTimePicker.dayId]: {
          ...timeSelection[showTimePicker.dayId],
          [showTimePicker.type]: selectedTime || new Date(),
        },
      };
      setTimeSelection(updatedTime);
    }
    setShowTimePicker({ dayId: null, type: null }); // Close time picker after selection
  };

  const formatTime = (date) => {
    return date
      ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
      : "--:--";
  };

  return (
    <View>
      {daysOfWeek.map((day) => (
        <View key={day.id}>
          <TouchableOpacity
            onPress={() => handleDaySelect(day.id)}
            style={{
              padding: 10,
              backgroundColor: selectedDays.includes(day.id)
                ? tokens.colors.hairduMainColor
                : "#fff",
              marginVertical: 5,
              borderRadius: tokens.borderRadius.medium,
              height: 40,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                color: selectedDays.includes(day.id)
                  ? tokens.colors.background
                  : tokens.colors.hairduTextColorGreen,
              }}
            >
              {day.name}
            </Text>
          </TouchableOpacity>

          {/* Time Pickers for Selected Days */}
          {selectedDays.includes(day.id) && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 12,
              }}
            >
              {/* Start Time */}
              <TouchableOpacity
                onPress={() => showTimePickerForDay(day.id, "start")}
              >
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: tokens.colors.hairduMainColor,
                    padding: 3,
                  }}
                >
                  <Text style={{ borderRadius: 10, color: "white" }}>
                    Start: {formatTime(timeSelection[day.id]?.start)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* End Time */}
              <TouchableOpacity
                onPress={() => showTimePickerForDay(day.id, "end")}
              >
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: tokens.colors.hairduMainColor,
                    padding: 3,
                  }}
                >
                  <Text style={{ borderRadius: 10, color: "white" }}>
                    End: {formatTime(timeSelection[day.id]?.end)}
                  </Text>
                </View>
                {/* <Text>End: {formatTime(timeSelection[day.id]?.end)}</Text> */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {showTimePicker.dayId !== null && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onTimeChange}
          style={{ margin: 12 }}
        />
      )}
    </View>
  );
};

export default WeekdaySelector;