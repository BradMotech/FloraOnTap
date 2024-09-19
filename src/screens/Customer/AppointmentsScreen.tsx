import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";
import globalStyles from "../../styles/globalStyles";
import CalendarComponent from "../../components/CalendarComponent";
import { TITLES } from "../../utils/Constants/constantTexts";
import { AuthContext } from "../../auth /AuthContext";
import { cancelBooking, fetchAppointmentsByCustomerId } from "../../firebase/dbFunctions";
import AppointmentModal from "../../components/AppointmentModal";
import { useToast } from "../../components/ToastContext";
import LoadingScreen from "../../components/LoadingScreen";

const AppointmentsScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState();
  const [modalVisible, setModalVisible] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancelBookingFlag, setCancelBookingFlag] = useState<boolean>(false);
  const [foundEvents, setFoundEvents] = useState<any[]>();
  const { showToast } = useToast();
  const { hairstylistsData,user, setHairstylesData, setHairstylistsData } =
  useContext(AuthContext);
  const events = {
    "2024-09-15": {
      marked: true,
      dotColor: "red",
      customStyles: {
        container: {
          backgroundColor: "blue",
        },
        text: {
          color: "white",
        },
      },
    },
    "2024-09-16": {
      marked: true,
      dotColor: "green",
      customStyles: {
        container: {
          backgroundColor: "orange",
        },
        text: {
          color: "white",
        },
      },
    },
  };

  const agendaItems = {
    "2024-09-15": [
      { name: "Event 1 on 2024-09-15" },
      { name: "Event 2 on 2024-09-15" },
    ],
    "2024-09-16": [
      { name: "Event 1 on 2024-09-16" },
      { name: "Event 2 on 2024-09-16" },
    ],
  };
  const [formattedEvents, setFormattedEvents] = useState({ events: {}, agendaItems: {} });

  const formatDateToYYYYMMDD = (isoDateString) => {
    try {
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchAndFormatEvents = async () => {
      try {
        // Fetch appointments
        const fetchedData = await fetchAppointmentsByCustomerId(user.uid);

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
                  dotColor: event.backColor, // You can customize this based on your event data
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
              agendaItems[eventDate].push({ name: event.text,appointmentDetails:appointment,hairstylistId:appointment.providerId }); // Customize based on your event data
            });
          }
        });

        // Update state with formatted events and agenda items 
        setFormattedEvents({ events, agendaItems });  
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching and formatting events:', error);
      }
    };

    fetchAndFormatEvents();
  }, [user.uid,cancelBookingFlag]);

  const handleEventClick = (event: any) => {
    console.warn("🚀 ~ handleEventClick ~ event:", event)
    setModalVisible(true)
    setSelectedEvent(event)
  };
  
  function confirmCancelBooking(appointment: any): void {
    cancelBooking(appointment.appointmentDetails.id).then((data) => {
      setModalVisible(false);
      setCancelBookingFlag(true)
      showToast('Appointment cancelled successfully, the salon has been notified',"success",'top')
    });
  }

  return !isLoading ? (
    <SafeAreaView>
      {selectedEvent && (
        <AppointmentModal
          visible={modalVisible}
          event={selectedEvent}
          onClose={() => setModalVisible(false)}
          title={"Appointment decline"}
          leftButtonTitle={"Cancel booking"}
          rightButtonTitle={"cancel"}
          onConfirm={()=>confirmCancelBooking(selectedEvent)}
        />
      )}
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={globalStyles.container}>
          <View style={globalStyles.separatorNoColor}></View>
          <View style={globalStyles.separatorNoColor}></View>
          <Text style={globalStyles.title}>{TITLES.APPOINTMENTS}</Text>
          <CalendarComponent
            onEventClick={handleEventClick}
            events={formattedEvents.events}
            agendaItems={formattedEvents.agendaItems}
            onBookEvent={function (date: string): void {
            } } allowBooking={false}          />
        </View>
      </ScrollView>
    </SafeAreaView>
  ):(<LoadingScreen></LoadingScreen>);
};

const styles = StyleSheet.create({});

export default AppointmentsScreen;
