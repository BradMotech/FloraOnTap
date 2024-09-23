import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";
import globalStyles from "../../styles/globalStyles";
import CalendarComponent from "../../components/CalendarComponent";
import { TITLES } from "../../utils/Constants/constantTexts";
import { AuthContext } from "../../auth/AuthContext";
import {
  cancelBooking,
  fetchAppointmentsByCustomerId,
} from "../../firebase/dbFunctions";
import AppointmentModal from "../../components/AppointmentModal";
import { useToast } from "../../components/ToastContext";
import LoadingScreen from "../../components/LoadingScreen";

const AppointmentsScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancelBookingFlag, setCancelBookingFlag] = useState<boolean>(false);
  const [foundEvents, setFoundEvents] = useState<any[]>();
  const { showToast } = useToast();
  const { hairstylistsData, user, setHairstylesData, setHairstylistsData } =
    useContext(AuthContext);
  const [formattedEvents, setFormattedEvents] = useState({
    events: {},
    agendaItems: {},
  });

  const formatDateToYYYYMMDD = (isoDateString) => {
    try {
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  useEffect(() => {
    const unsubscribe = fetchAppointmentsByCustomerId(
      user.uid,
      (fetchedData) => {
        try {
          // Initialize objects to accumulate events and agenda items
          const events = {};
          const agendaItems = {};

          // Process each fetched appointment
          fetchedData.forEach((appointment) => {
            if (appointment.events && Array.isArray(appointment.events)) {
              appointment.events.forEach((event) => {
                const eventDate = formatDateToYYYYMMDD(event.start); // Assuming `event.date` is in YYYY-MM-DD format

                // Add or update the event date in the events object
                if (!events[eventDate]) {
                  events[eventDate] = {
                    marked: true,
                    dotColor: event.backColor, // Customize based on your event data
                    customStyles: {
                      container: {
                        backgroundColor: "blue", // Customize as needed
                      },
                      text: {
                        color: "white", // Customize as needed
                      },
                    },
                  };
                }

                // Add the event to the agendaItems object
                if (!agendaItems[eventDate]) {
                  agendaItems[eventDate] = [];
                }
                agendaItems[eventDate].push({
                  name: event.text,
                  appointmentDetails: appointment,
                  hairstylistId: appointment.providerId,
                }); // Customize based on your event data
              });
            }
          });

          // Update state with formatted events and agenda items
          setFormattedEvents({ events, agendaItems });
          setIsLoading(false);
        } catch (error) {
          console.error("Error processing fetched data:", error);
        }
      }
    );

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, [user.uid, cancelBookingFlag]);

  const handleEventClick = (event: any) => {
    console.warn("🚀 ~ handleEventClick ~ event:", event);
    setModalVisible(true);
    setSelectedEvent(event);
  };

  function confirmCancelBooking(appointment: any): void {
    cancelBooking(appointment.appointmentDetails.id).then((data) => {
      setModalVisible(false);
      setCancelBookingFlag(true);
      showToast(
        "Appointment cancelled successfully, the salon has been notified",
        "success",
        "top"
      );
    });
  }

  return !isLoading ? (
    <SafeAreaView>
      {selectedEvent && (
        <AppointmentModal
          visible={modalVisible}
          event={selectedEvent}
          onClose={() => setModalVisible(false)}
          title={"Appointment management"}
          leftButtonTitle={"Cancel booking"}
          rightButtonTitle={"cancel"}
          onConfirm={() => confirmCancelBooking(selectedEvent)}
        />
      )}
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={globalStyles.container}>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>

          <CalendarComponent
            onEventClick={handleEventClick}
            events={formattedEvents.events}
            agendaItems={formattedEvents.agendaItems}
            onBookEvent={function (date: string): void {}}
            allowBooking={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <LoadingScreen></LoadingScreen>
  );
};

const styles = StyleSheet.create({});

export default AppointmentsScreen;
