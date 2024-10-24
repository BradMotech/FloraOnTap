import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import globalStyles from "../styles/globalStyles";
import tokens from "../styles/tokens";
import ButtonComponent from "./buttonComponent";
import TimePicker from "./TimePicker";
import { Ionicons } from "@expo/vector-icons";
import { formatReadableDate } from "../utils/dateFormat";
import Badge from "./Badge";
import { maskPhoneNumber, maskText } from "../utils/maskPhoneNumber";

interface CalendarComponentProps {
  events: Record<
    string,
    { marked: boolean; dotColor?: string; customStyles?: any }
  >;
  agendaItems: Record<string, { name: string }[]>; // Events mapped by date
  onBookEvent: (date: string) => void; // Callback function to handle booking
  onEventClick?: (event: any) => void; // New prop for event click handler
  onTimeClick?: (event: any) => void; // New prop for event click handler
  allowBooking: boolean; // New prop for event click handler
  maskPhone:boolean,
  maskTextValue:boolean,
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  agendaItems,
  onBookEvent,
  onEventClick, // Accept the event click handler
  allowBooking,
  onTimeClick,
  maskPhone = false,
  maskTextValue = false,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get today's date
  const today = new Date();
  const current = today.toISOString().split("T")[0];

  // Calculate maxDate (5 years from today)
  const maxDate = new Date(today.setFullYear(today.getFullYear() + 5))
    .toISOString()
    .split("T")[0];

  // Handler when a date is selected on the calendar
  const onDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date); // Update the selected date in state
  };

  // Handle click on agenda event
  const handleEventPress = (event: any) => {
    Alert.alert("Event Clicked", `You clicked on: ${event.name}`);
    // You can handle additional logic here, such as navigating to a detailed view of the event
  };

  // Render agenda items as clickable
  const renderItem = (item: any) => {
    const eventDate = selectedDate || "";
    const eventStyle = events[eventDate] || {};
    const backgroundColor = item.appointmentDetails.appointmentStatus === "OUT FOR DELIVERY"
    ? `${'#47BF9C'}80` // Add 80 for 50% opacity in hex
    : `${tokens.colors.skyBlueColor}`; // Default to white with 50% opacity

    return (
      <TouchableOpacity
        style={[
          globalStyles.itemCalendarRender,
          { backgroundColor, padding: 12, marginTop: 8, marginRight: 8 },
        ]} // Apply the background color
        onPress={() => {onEventClick(item)}} // Event click handler passed from parent
      >
        <View>
          <View
            style={[
              globalStyles.imagePlaceholder,
              { height: 30, width: 30, borderRadius: 15, marginBottom: 10 },
            ]}
          >
            <Text style={globalStyles.placeholderText}>
              {item.appointmentDetails.userCustomerInfo[0]?.name
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <Text
            style={[
              globalStyles.GorditaMedium,
              { color: backgroundColor === "#fff" ? "black" : "white" },
            ]}
          >
            <Ionicons name={"person-circle-outline"} size={15} color={"#fff"} />
            {" " + item.name}
          </Text>
          {maskTextValue ? <Text
            style={[
              globalStyles.GorditaMedium,
              { color: backgroundColor === "#fff" ? "black" : "white" },
            ]}
          >
            <Ionicons name={"person-circle-outline"} size={15} color={"#fff"} />
            {" " +
              maskText(item.appointmentDetails.userCustomerInfo[0]?.name +
              " " +
              item.appointmentDetails.userCustomerInfo[0]?.surname)}
          </Text>:<Text
            style={[
              globalStyles.GorditaMedium,
              { color: backgroundColor === "#fff" ? "black" : "white" },
            ]}
          >
            <Ionicons name={"person-circle-outline"} size={15} color={"#fff"} />
            {" " +
              item.appointmentDetails.userCustomerInfo[0]?.name +
              " " +
              item.appointmentDetails.userCustomerInfo[0]?.surname}
          </Text>}
         { maskPhone ? <Text
            style={[
              globalStyles.GorditaMedium,
              { color: backgroundColor === "#fff" ? "black" : "white" },
            ]}
          >
            <Ionicons name={"call"} size={15} color={"#fff"} />
            {" Cell number : " + maskPhoneNumber(item.appointmentDetails.userCustomerInfo[0]?.phone)}
          </Text> :
          <Text
          style={[
            globalStyles.GorditaMedium,
            { color: backgroundColor === "#fff" ? "black" : "white" },
          ]}
        >
          <Ionicons name={"call"} size={15} color={"#fff"} />
          {" Cell number : " + item.appointmentDetails.userCustomerInfo[0]?.phone}
        </Text>
          }
         { maskPhone ? <Text
            style={[
              globalStyles.GorditaMedium,
              { color: backgroundColor === "#fff" ? "black" : "white" },
            ]}
          >
            <Ionicons name={"call"} size={15} color={"#fff"} />
            {" Whatsapp number : " + maskPhoneNumber(item.appointmentDetails.events[0]?.whatsappNumber)}
          </Text> :
          <Text
          style={[
            globalStyles.GorditaMedium,
            { color: backgroundColor === "#fff" ? "black" : "white" },
          ]}
        >
          <Ionicons name={"call"} size={15} color={"#fff"} />
          {" Whatsapp number : " + item.appointmentDetails.events[0]?.whatsappNumber}
        </Text>
          }
        <Text style={[
            globalStyles.GorditaMedium,
            { color: backgroundColor === "#fff" ? "black" : "white",marginTop:6 },
          ]}>
          {"Location :  " + '\n'} <Text style={{color:tokens.colors.skyBlueColor}}>{item.appointmentDetails.events[0]?.end.placeName}</Text>
        </Text>
        {maskTextValue ? <Text style={[
            globalStyles.GorditaMedium,
            { color: backgroundColor === "#fff" ? "black" : "white" },
          ]}>
          {"Special Message :  " + '\n' + '\n' +  maskText(item.appointmentDetails.events[0]?.specialMessage)}
        </Text>:<Text style={[
            globalStyles.GorditaMedium,
            { color: backgroundColor === "#fff" ? "black" : "white" },
          ]}>
          {"Special Message :  " + '\n' + '\n' +  item.appointmentDetails.events[0]?.specialMessage}
        </Text>}
          <View
            style={{width:'100%',alignItems:'flex-start',display:'flex',flexDirection:'row'}}
          >
           <Badge variant='success' text={formatReadableDate(item.appointmentDetails.events[0].start)}/> 
          </View>
          <View style={styles.badge}>
            <Text
              style={{
                color:
                  item.appointmentDetails.appointmentStatus === "OUT FOR DELIVERY"
                    ? "green"
                    : "red",
                fontWeight: "800",
                fontSize: 10,
              }}
            >
              {" " + item.appointmentDetails.appointmentStatus}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // Custom marked dates
  const markedDates = Object.keys(events).reduce((acc, date) => {
    const appointmentStatus = agendaItems[date]?.[0]?.appointmentDetails.appointmentStatus;
    console.warn("🚀 ~ markedDates ~ appointmentStatus:", appointmentStatus)
    acc[date] = {
      ...events[date],
      dotColor: appointmentStatus === "OUT FOR DELIVERY" ? "#47BF9C" : tokens.colors.skyBlueColor, // Match with background logic
    };
    return acc;
  }, {});
  
  // Also handle the selected date
  markedDates[selectedDate || ""] = {
    selected: true,
    selectedColor: tokens.colors.floraOnTapMainColor,
    selectedTextColor: "white",
    ...events[selectedDate || ""],
  };
  // const markedDates = {
  //   ...events,
  //   [selectedDate || ""]: {
  //     selected: true,
  //     selectedColor: tokens.colors.floraOnTapMainColor,
  //     selectedTextColor: "white",
  //     ...events[selectedDate || ""],
  //   },
  // };

  // Handle booking event
  const handleBookEvent = () => {
    if (selectedDate) {
      onBookEvent(selectedDate);
    } else {
      Alert.alert("No Date Selected", "Please select a date to book an event.");
    }
  };

  return (
    <View style={[{ width: "100%", flex: 1, padding: 10 }]}>
      <Calendar
        current={current}
        minDate="2020-01-01"
        maxDate={maxDate}
        monthFormat={"yyyy MM"}
        markedDates={markedDates}
        onDayPress={onDayPress} // When a date is pressed, update state
      />

      {/* The Agenda component, synced with selected date */}
      {selectedDate && (
        <View style={styles.agendaContainer}>
          <Agenda
            selected={selectedDate} // Sync Agenda with the selected date
            items={{
              [selectedDate]: agendaItems[selectedDate] || [],
            }}
            renderItem={renderItem} // Render each item as clickable
            theme={{
              arrowColor: "#4f4f4f",
              monthTextColor: "#4f4f4f",
              selectedDayBackgroundColor: "#00adf5",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#00adf5",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              agendaDayTextColor: "#00adf5",
              agendaDayNumColor: "#00adf5",
              agendaTodayColor: "#00adf5",
              agendaKnobColor: "#00adf5",
            }}
          />
        </View>
      )}

      {/* Button to book the event */}
      {selectedDate && (
        <View style={globalStyles.bookingContainer}>
          {allowBooking ? (
            <TimePicker onTimeChange={(time) => onTimeClick(time)}></TimePicker>
          ) : null}
          {allowBooking ? (
            <ButtonComponent text="Place an Order" onPress={handleBookEvent} />
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  agendaContainer: {
    flex: 1,
    padding: 2, // Add padding to the agenda container
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  badge: {
    backgroundColor: "white",
    width: undefined,
    maxWidth:150,
    padding: 2,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
});

export default CalendarComponent;
