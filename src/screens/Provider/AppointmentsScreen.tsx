import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import globalStyles from "../../styles/globalStyles";
import CalendarComponent from "../../components/CalendarComponent";
import { TITLES } from "../../utils/Constants/constantTexts";
import { AuthContext } from "../../auth/AuthContext";
import {
  acceptBooking,
  declineBooking,
  fetchAppointmentsByHairstylistId,
  updateHairStylistSubscriptionCredits,
  updateUserSubscriptionCredits,
} from "../../firebase/dbFunctions";
import AppointmentModal from "../../components/AppointmentModal";
import { useToast } from "../../components/ToastContext";
import tokens from "../../styles/tokens";
import LoadingScreen from "../../components/LoadingScreen";

const AppointmentsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [bookingFlag, setBookingFlag] = useState<boolean>(false);
    const [formattedEvents, setFormattedEvents] = useState({
      events: {},
      agendaItems: {},
    });
    
    const { user,userData } = useContext(AuthContext);
    const { showToast } = useToast();
  
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
      console.log(JSON.stringify(userData.subscription.totalCredits));
      console.log(JSON.stringify(userData.subscription.creditsLeft));
      /**
       *  subscription: {
            plan: "Free Trial",
            expires: new Date(),
            paid: false,
            paidAt: new Date(),
            paidUntil: new Date(),
            totalCredits: 40,
            creditsLeft: 40,
            paidMethod: "",
            paidAmount: 0,
            paidCurrency: "ZAR",
            paidStatus: "Free Trial",
            paidDate: new Date(),
          },
       */
    }, []);
    useEffect(() => {
      const unsubscribe = fetchAppointmentsByHairstylistId(user.uid, (fetchedData) => {
        const events = {};
        const agendaItems = {};
  
        fetchedData.forEach((appointment) => {
          if (appointment.events && Array.isArray(appointment.events)) {
            appointment.events.forEach((event) => {
              const eventDate = formatDateToYYYYMMDD(event.start); // Assuming `event.start` is a valid date
  
              // Add or update the event date in the events object
              if (!events[eventDate]) {
                events[eventDate] = {
                  marked: true,
                  dotColor: event.backColor,
                  customStyles: {
                    container: {
                      backgroundColor: 'blue', // Customize as needed
                    },
                    text: {
                      color: 'white', // Customize as needed
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
              });
            });
          }
        });
  
        // Update state with formatted events and agenda items
        setFormattedEvents({ events, agendaItems });
      });
  
      return () => unsubscribe(); // Cleanup listener on unmount
    }, [user.uid, bookingFlag]);

  const handleEventClick = (event: any) => {
    console.warn("🚀 ~ handleEventClick ~ event:", event);
    setModalVisible(true);
    setSelectedEvent(event);
  };

  function acceptClientBooking(appointment: any): void {
    setIsLoading(true)
    acceptBooking(appointment.appointmentDetails.id).then((data) => {
      setModalVisible(false);
      setBookingFlag(true);
      updateUserSubscriptionCredits(user.uid,appointment.appointmentDetails.selectedHairstyle.serviceValue);
      updateHairStylistSubscriptionCredits(user.uid,appointment.appointmentDetails.selectedHairstyle.serviceValue);
      showToast(
        "Appointment approved successfully, the Customer has been notified",
        "success",
        "top"
      );
      setIsLoading(false)
    });
  }

  function confirmCancelBooking(appointment: any): void {
    declineBooking(appointment.appointmentDetails.id).then((data) => {
      setModalVisible(false);
      setBookingFlag(true);
      showToast(
        "Appointment declined successfully, the customer has been notified",
        "danger",
        "top"
      );
    });
  }

  return !isLoading ? (
    <SafeAreaView  style={[globalStyles.safeArea,{marginTop:tokens.spacing.lg * 2.4}]}>
      {selectedEvent && (
        <AppointmentModal
          visible={modalVisible}
          event={selectedEvent}
          onClose={() => confirmCancelBooking(selectedEvent)}
          title={"Appointment management"}
          leftButtonTitle={"Accept"}
          rightButtonTitle={"Decline"}
          onConfirm={() => acceptClientBooking(selectedEvent)}
        />
      )}
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={globalStyles.container}>
          {/* <View style={globalStyles.separatorNoColor}></View> */}
          {/* <View style={globalStyles.separatorNoColor}></View> */}
          {/* <Text style={globalStyles.title}>{TITLES.APPOINTMENTS}</Text> */}
          <CalendarComponent
            allowBooking={false}
            onEventClick={handleEventClick}
            events={formattedEvents.events}
            agendaItems={formattedEvents.agendaItems}
            onBookEvent={function (date: string): void {
              //  alert(date);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  ):(<LoadingScreen/>);
};

const styles = StyleSheet.create({});

export default AppointmentsScreen;
