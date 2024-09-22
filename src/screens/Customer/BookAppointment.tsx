import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Dimensions } from "react-native";
import ImageGalleryItem from "../../components/ImageGalleryItem";
import { useRoute } from "@react-navigation/native";
import globalStyles from "../../styles/globalStyles";
import tokens from "../../styles/tokens";
import { TITLES } from "../../utils/Constants/constantTexts";
// import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { Ionicons } from '@expo/vector-icons';
import CalendarComponent from "../../components/CalendarComponent";
import CustomModal from "../../components/CustomModal";
import { formatDate } from "../../utils/dateFormat";
import { fetchAppointmentsByHairstylistId, makeBooking } from "../../firebase/dbFunctions";
import { AuthContext } from "../../auth/AuthContext";
import { useToast } from "../../components/ToastContext";
import LoadingScreen from "../../components/LoadingScreen";
import { sendNotification } from "../../utils/sendNotification";

const BookAppointment = () => {
  const [selectedTime, setSelectedTime] = useState();
  const [makeBookingFlag, setMakeBookingFlag] = useState<boolean>(false);
  const [selectedBookingTimeSlot, setSelectedBookingTimeSlot] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<any>();
    const { userData,user, setHairstylesData, setHairstylistsData } =
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
  const route = useRoute();
  const { showToast } = useToast();
  const { hairstyleDetails }:any = route.params; // Assuming hairstyleDetails has images, price, description, etc.

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
        const fetchedData = await fetchAppointmentsByHairstylistId(hairstyleDetails.hairstylistId);

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
  }, [hairstyleDetails.hairstylistId,makeBookingFlag]); 
  
  function renderModalChildren(data:any){
    
    return (
        <View>
            <Text >Confirm Appointment</Text>
            <Text >
              Do you want to proceed with booking this appointment?
            </Text>
            <Text >Date: {selectedDate}</Text>
            <Text >Time: {selectedTime}</Text>
        </View>
    )
  }

  const createEventsArray = (start: string, end: string, description: string, text: string,arrivalTime:string,backColor:string,serviceName:string) => {
    return [
      {
        start,
        end,
        description,
        text,
        arrivalTime,
        backColor,
        serviceName
      },
    ];
  };

  const formatTimeTo24Hour = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    let hours24 = hours;
    if (period === 'PM' && hours < 12) {
      hours24 += 12; // Convert PM hour to 24-hour format
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0; // Convert 12 AM to 00 hours
    }
    return `${String(hours24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  function getRandomColor(colors: string[]): string {
    // Check if colors array is not empty
    if (colors.length === 0) {
      throw new Error("The colors array is empty.");
    }
  
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * colors.length);
  
    // Return the color code at the random index
    return colors[randomIndex];
  }


  function confirmSettingBooking() {
    setIsLoading(true)
    const googleCalendarColors = [
      '#FF6F61', // Coral
      '#6B8E23', // Olive Drab
      '#4682B4', // Steel Blue
      '#FFD700', // Gold
      '#FF1493', // Deep Pink
      '#1E90FF', // Dodger Blue
      '#32CD32', // Lime Green
      '#FF6347', // Tomato
      '#40E0D0', // Turquoise
      '#9370DB', // Medium Purple
    ];
const bgColor = getRandomColor(googleCalendarColors);
    const { hours, minutes }:any = selectedBookingTimeSlot;
    const period = selectedBookingTimeSlot?.period; // This will be 'AM' or 'PM'
    
    // Format the time to 24-hour format
    const formattedTime = formatTimeTo24Hour(hours, minutes, period);
    setSelectedTime(formattedTime as any)
    // Construct startDate in ISO format
    const startDate = `${selectedDate}T${formattedTime}`;

    const events = createEventsArray(
      startDate, // Example start time
      startDate, // Example end time
      hairstyleDetails.description,    // Example description
      "Booking - "+hairstyleDetails.name ,           // Example text
      formattedTime ,           // arrival time text
      bgColor ,           // bgcolor text
      "Sample text" ,           // service name text
    );
  
    // Update hairstyleDetails with the new events array
    const updatedHairstyleDetails = {
      ...hairstyleDetails,
      events, // Add the events array here
    };

    const userDataArray = [userData];
    makeBooking(user.uid, updatedHairstyleDetails, selectedDate, "",events,userDataArray as any).then(async (data) => {
      // alert("here is the booking made" + hairstyleDetails.fcmtoken);
      setMakeBookingFlag(true);
      showToast("successfully placed an appoitment",'success','top');
      setModalVisible(false);
      setIsLoading(false);
      await sendNotification(hairstyleDetails.fcmtoken,"testing within app","you're welcome").then((data)=>{
        alert(data)
      });
    });
  }

  return !isLoading ? (
    <SafeAreaView style={[globalStyles.safeArea, { marginTop: tokens.spacing.xs * 0 }]}>
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={globalStyles.imageView}>
          {/* Image Gallery */}
          <ImageGalleryItem uris={hairstyleDetails.images}></ImageGalleryItem>
          
          {/* Separator */}
          <View style={globalStyles.separatorNoColor}></View>

          {/* Details Section */}
          <Text style={[globalStyles.title, { textAlign: 'left', width: '100%', paddingLeft: 16 }]}>
            {"Details"}
          </Text>
          <View style={globalStyles.separatorNoColor}></View>
          {/* Detail Items with Icons */}
          <View style={styles.flexStart}>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={15} style={styles.icon} />
            <Text style={styles.detailText}>{`Price: R`} <Text style={[styles.price,globalStyles.value]}>{hairstyleDetails.price}</Text></Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="book-outline" size={15} style={styles.icon} />
            <Text style={styles.detailText}>{`Description: ${hairstyleDetails.description}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="male-female" size={15} style={styles.icon} />
            <Text style={styles.detailText}>{`Gender: `} <Text style={globalStyles.value}>{hairstyleDetails.gender}</Text></Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cut-outline" size={15} style={styles.icon} />
            <Text style={styles.detailText}>{`Service Type:`} <Text style={globalStyles.value}>{hairstyleDetails.serviceType}</Text></Text>
          </View>
          </View>
          <View style={globalStyles.separatorNoColor}></View>
          <CalendarComponent onEventClick={()=>{}} onTimeClick={(time)=>{setSelectedBookingTimeSlot(time)}} events={formattedEvents.events} agendaItems={formattedEvents.agendaItems} onBookEvent={function (date: string): void {
            setSelectedDate(date);
            setModalVisible(true);
          } } allowBooking={true} />
        </View>
      </ScrollView>

      <CustomModal visible={modalVisible} onClose={function (): void {
        setModalVisible(false);
        setSelectedDate(null);
      } } children={renderModalChildren("")} onConfirm={()=>{
        confirmSettingBooking()
      }}>
        
      </CustomModal>
    </SafeAreaView>
  ):(<LoadingScreen/>);
};

// Styles
const styles = StyleSheet.create({
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
    paddingLeft: 16,
  },
  icon: {
    marginRight: 8, // Space between icon and text
    color: tokens.colors.hairduMainColor, // Customize the icon color if needed
  },
  detailText: {
    fontSize: 14,
    color: "#333", // Customize text color
    maxWidth:Dimensions.get('screen').width -60,
    paddingRight:12
  },
  flexStart: {
    textAlign: "center",
    backgroundColor: tokens.colors.bgFaint,
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  price: {
    fontWeight: "700",
    paddingLeft:6,
    paddingRight:6
  },
});

export default BookAppointment;
