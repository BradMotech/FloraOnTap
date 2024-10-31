import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import ImageGalleryItem from "../../components/ImageGalleryItem";
import { useRoute } from "@react-navigation/native";
import globalStyles from "../../styles/globalStyles";
import tokens from "../../styles/tokens";
import { TITLES } from "../../utils/Constants/constantTexts";
// import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { Ionicons } from "@expo/vector-icons";
import CalendarComponent from "../../components/CalendarComponent";
import CustomModal from "../../components/CustomModal";
import {
  fetchAppointmentsByHairstylistId,
  makeBooking,
  updateHairStylistSubscriptionCredits,
  updateNotificationReadStatus,
  updateUserSubscriptionCredits,
} from "../../firebase/dbFunctions";
import { AuthContext } from "../../auth/AuthContext";
import { useToast } from "../../components/ToastContext";
import LoadingScreen from "../../components/LoadingScreen";
import { sendNotification } from "../../utils/sendNotification";
import { formatToRands } from "../../utils/currencyUtil";
import ReceiptModal from "../../components/RecieptModal";
import PatronsListScreen from "../../components/PatronsList";
import TextAreaComponent from "../../components/TextAreaComponent";
import LocationInput from "../../components/LocationInput";
import { locationDetails } from "../../components/SalonItem";
import InputComponent from "../../components/InputComponent";
import PayFastModal from "../../components/PayFastModal";

const PlaceOrder = () => {
  const [selectedTime, setSelectedTime] = useState();
  const [makeBookingFlag, setMakeBookingFlag] = useState<boolean>(false);
  const [selectedBookingTimeSlot, setSelectedBookingTimeSlot] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [phoneEntered, setPhoneEntered] = useState<string>('');
  const { userData, user, setHairstylesData, setFloraProvidersData } =
    useContext(AuthContext);
  const route = useRoute();
  const { showToast } = useToast();
  const { floraDetails, flowerProvidersDetails }: any = route.params; // Assuming floraDetails has images, price, description, etc.
  const [formattedEvents, setFormattedEvents] = useState({
    events: {},
    agendaItems: {},
  });
  const [recieptModalVisible, setRecieptModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null); // State to hold receipt data
  const [selectedPatron, setSelectedPatron] = useState({});
  const [isSubmittingAppointment, setIsSubmittingAppointment] = useState(false);
  const [isOutOfCredits, setIsOutOfCredits] = useState(false);
  const [specialMessage, setSpecialMessage] = useState("");
  const [deliverylocationDetails, setDeliverylocationDetails] = useState<locationDetails>(null);
  const [paymentData, setPaymentData] = useState<any>();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    { credits: 10, price: "R79.99",priceInValue:79.99 },
    { credits: 50, price: "R150.00",priceInValue:150.00 },
    { credits: 100, price: "R250.00",priceInValue:150.00 },
  ];

  const handleLocationSelect = (locationDetails) => {
    console.warn('Location Selected', `Name: ${locationDetails.placeName}\nCoordinates: (${locationDetails.latitude}, ${locationDetails.longitude})`);
    setDeliverylocationDetails(locationDetails)
  };

  const formatDateToYYYYMMDD = (isoDateString) => {
    try {
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  useEffect(() => {
    const unsubscribe = fetchAppointmentsByHairstylistId(
      floraDetails.floristId,
      (fetchedData) => {
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
                      backgroundColor: "blue",
                    },
                    text: {
                      color: "white",
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
                floristId: appointment.providerId,
              });
            });
          }
        });

        // Update state with formatted events and agenda items
        setFormattedEvents({ events, agendaItems });
        setIsLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [floraDetails.floristId, makeBookingFlag]);

  function renderModalChildren(data: any) {
    return (
      <View>
        <Text
          style={[globalStyles.GorditaBold, { marginBottom: 16, fontSize: 22 }]}
        >
          Confirm Order Details
        </Text>
        <Text style={globalStyles.GorditaRegular}>
          Do you want to proceed with placing this order?
        </Text>
        <View style={{ maxHeight: 230 }}>
          <ImageGalleryItem uris={floraDetails.images} />
        </View>
        <Text style={globalStyles.GorditaRegular}>Whatsapp number : {specialMessage}</Text>
        <Text style={globalStyles.GorditaRegular}>Card Message : {phoneEntered}</Text>
        <Text style={globalStyles.GorditaRegular}>Delivery location: {deliverylocationDetails?.placeName}</Text>
        <Text style={globalStyles.GorditaRegular}>Date: {selectedDate}</Text>
      </View>
    );
  }

  const createEventsArray = (
    start: string,
    end: any,
    description: string,
    text: string,
    arrivalTime: string,
    backColor: string,
    specialMessage: string,
    whatsappNumber: string,
  ) => {
    return [
      {
        start,
        end,
        description,
        text,
        arrivalTime,
        backColor,
        specialMessage,
        whatsappNumber
      },
    ];
  };

  const formatTimeTo24Hour = (
    hours: number,
    minutes: number,
    period: "AM" | "PM"
  ) => {
    let hours24 = hours;
    if (period === "PM" && hours < 12) {
      hours24 += 12; // Convert PM hour to 24-hour format
    } else if (period === "AM" && hours === 12) {
      hours24 = 0; // Convert 12 AM to 00 hours
    }
    return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
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

  const closeModal = () => {
    setPaymentModalVisible(false);
  };

  function firstCheckIfCanOrder(){
    alert(userData?.subscription.totalCredits)
    if(userData?.subscription.totalCredits > 0){
      setIsOutOfCredits(true)
    }else{
      confirmSettingBooking()
    }
  }

  function confirmSettingBooking() {
    // alert("floral data : "+JSON.stringify(flowerProvidersDetails))
    if(flowerProvidersDetails.merchant.paymentType !== "Whatsapp"){
      const paymentData = {
        merchant_id: "15553273",
        merchant_key: "y20wnrvfcrbsk",
        return_url: "https://google.com",
        cancel_url: "https://google.com",
        notify_url: "https://google.com",
        email_address: "brad@motech.dev",
        name_first: "bradley",
        name_last: "mamanyoha",
        amount: floraDetails?.price.toString(),
        m_payment_id: "000001", 
        item_name: floraDetails?.name.toString(),
      };
    setPaymentData(paymentData); 
    setPaymentModalVisible(true)
    }
    

    setModalVisible(false);
    setIsLoading(true);
    const googleCalendarColors = [
      "#FF6F61", // Coral
      "#6B8E23", // Olive Drab
      "#4682B4", // Steel Blue
      "#FFD700", // Gold
      "#FF1493", // Deep Pink
      "#1E90FF", // Dodger Blue
      "#32CD32", // Lime Green
      "#FF6347", // Tomato
      "#40E0D0", // Turquoise
      "#9370DB", // Medium Purple
    ];
    const bgColor = getRandomColor(googleCalendarColors);
    const { hours, minutes }: any = selectedBookingTimeSlot;
    const period = selectedBookingTimeSlot?.period; // This will be 'AM' or 'PM'

    // Format the time to 24-hour format
    const formattedTime = formatTimeTo24Hour(hours, minutes, period);
    setSelectedTime(formattedTime as any);
    // Construct startDate in ISO format
    const startDate = `${selectedDate}T${formattedTime}`;

    const events = createEventsArray(
      startDate, // Example start time
      deliverylocationDetails, // Example end time
      floraDetails.description, // Example description
      "Order - " + floraDetails.name + " " +"R "+floraDetails.price, // Example text
      formattedTime, // arrival time text
      bgColor, // bgcolor text
      specialMessage // service name text
      ,phoneEntered //Whatsapp number
    );

    // Update floraDetails with the new events array
    const updatedHairstyleDetails = {
      ...floraDetails,
      events, // Add the events array here
    };

    const userDataArray = [userData];
    makeBooking(
      user.uid,
      updatedHairstyleDetails,
      selectedDate,
      "",
      events,
      userDataArray as any
    ).then(async (data) => {
      console.warn("🚀 ~ ).then ~ data:", data)
      setIsSubmittingAppointment(true);
      setRecieptModalVisible(true);
      setReceiptData(data.receipt);
      setModalVisible(false);
      // alert("here is the booking made" + floraDetails.fcmtoken);
      setMakeBookingFlag(true);
      showToast("successfully placed a booking", "success", "top");
      const details = "Booking made for : "+ floraDetails.name + " " + "R "+ floraDetails.price ;
      const orderTitle = "Order - : "+ floraDetails.name;
      await updateNotificationReadStatus(data.bookingId,'unread',floraDetails?.floristId,orderTitle,details,user?.uid);
      // deduct from current user 
      updateUserSubscriptionCredits(
        user?.uid,
        10
      );
      updateHairStylistSubscriptionCredits(
        user?.uid,
        10
      );
      // deduct from florsit
      updateUserSubscriptionCredits(
        floraDetails.floristId,
        10
      );
      updateHairStylistSubscriptionCredits(
        floraDetails?.floristId,
        10
      );
      setIsLoading(false);
      setTimeout(() => {
        setIsSubmittingAppointment(false);
      }, 3000);
      await sendNotification(
        floraDetails.fcmtoken,
        "testing within app",
        "you're welcome"
      ).then((data) => {
        // alert(data)
      });
    });
  }

  function handleSelectedPatron(data: any) {
    setSelectedPatron(data);
  }

  function renderOutOfCredits(): React.ReactNode {
    return (
      <View style={styles.outOfCreditsContainer}>
      {/* Centered Header */}
      <Text style={styles.headerText}>Choose your plan</Text>
      
      {/* Displaying message */}
      <Text style={styles.outOfCreditsText}>
      Your credits have been used up. By purchasing additional credits, 
  you help us ensure that your flower orders are processed accurately, 
  our systems run smoothly, and we continue delivering the best service possible.
  Thank you for choosing us.
      </Text>

      {/* Radio list */}
      <View style={styles.planList}>
        {plans.map((plan:any, index) => (
          <TouchableOpacity
            key={index}
            style={styles.planOption}
            onPress={() => setSelectedPlan(plan.credits)}
          >
            {/* Radio button */}
            <View style={styles.radio}>
              {selectedPlan === plan.credits && <View style={styles.selected} />}
            </View>

            {/* Plan details */}
            <Text style={styles.planText}>
              {plan.credits} credits - {plan.price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    )
  }

  function acceptCreditPurchase() {
    setIsOutOfCredits(false);
    const price = plans.find((x)=> x.credits === selectedPlan)
    // alert(JSON.stringify(price))
    const paymentData = {
      merchant_id: "15553273",
      merchant_key: "y20wnrvfcrbsk",
      return_url: "https://google.com",
      cancel_url: "https://google.com",
      notify_url: "https://google.com",
      email_address: "brad@motech.dev",
      name_first: "bradley",
      name_last: "mamanyoha",
      amount: price.priceInValue.toString(),
      m_payment_id: "000001", 
      item_name: price.priceInValue.toString(),
    };
  setPaymentData(paymentData); 
  setPaymentModalVisible(true)
  }

  return !isLoading ? (
    <ScrollView contentContainerStyle={globalStyles.scroll}>
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      > 
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView
      style={[globalStyles.safeArea, { marginTop: tokens.spacing.xs * 0 }]}
    >
      <ScrollView contentContainerStyle={globalStyles.scroll}>
        <View style={globalStyles.separatorNoColor}></View>
        <View style={globalStyles.imageView}>
          {/* Image Gallery */}
          <ImageGalleryItem uris={floraDetails.images}></ImageGalleryItem>

          {/* Separator */}
          <View style={globalStyles.separatorNoColor}></View>

          {/* Details Section */}
          <Text
            style={[
              globalStyles.title,
              { textAlign: "left", width: "100%", paddingLeft: 16 },
            ]}
          >
            {"Details"}
          </Text>
          <View style={globalStyles.separatorNoColor}></View>
          {/* Detail Items with Icons */}
          <View style={[styles.flexStart, { width: "100%" }]}>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>
                <Text style={[globalStyles.title, globalStyles.value]}>
                  {floraDetails.name}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={15} style={styles.icon} />
              <Text style={styles.detailText}>
                <Text style={[styles.price, globalStyles.planPrice]}>
                  {formatToRands(floraDetails.price)}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="book-outline" size={15} style={styles.icon} />
              <Text
                style={styles.detailText}
              >{`Description: ${floraDetails.description}`}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="flower-outline" size={15} style={styles.icon} />
              <Text style={styles.detailText}>
                {`Flora type:`}{" "}
                <Text style={globalStyles.value}>
                  {floraDetails.serviceType}
                </Text>
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash" size={15} style={styles.icon} />
              <Text style={styles.detailText}>
                {`Payment Method:`}{" "}
                <Text style={globalStyles.value}>
                  {flowerProvidersDetails?.merchant.paymentType}
                </Text>
              </Text>
            </View>
          </View>
          <View style={globalStyles.separatorNoColor}></View>
          {/* <View style={{ width: "100%", paddingLeft: 16, marginBottom: 10 }}>
            <Text style={globalStyles.title}>Select Preferred Stylist</Text>
          </View>
          <View style={[styles.flexStart, { width: "100%" }]}>
            <PatronsListScreen
              uid={floraDetails.floristId}
              onSelectPatron={(data) => {
                handleSelectedPatron(data);
              }}
            />
          </View> */}
          <View style={globalStyles.separatorNoColor}></View>
          <Text
            style={[
              globalStyles.title,
              {
                textAlign: "left",
                alignItems: "flex-start",
                width: "100%",
                paddingLeft: 16,
              },
            ]}
          >
            Delivery Address
          </Text>
          <View style={{ marginBottom: 16,width:'100%' }}>
          <LocationInput label={undefined} placeholder={'Please enter Delivery location'} onSearchPress={undefined} onLocationSelect={handleLocationSelect} selectedLocation={deliverylocationDetails?.placeName}/>
            </View>

            <Text
            style={[
              globalStyles.title,
              {
                textAlign: "left",
                alignItems: "flex-start",
                width: "100%",
                paddingLeft: 16,
              },
            ]}
          >
            Whatsapp Number
          </Text>
          <View style={{ marginBottom: 16,width:'100%' }}>
          <InputComponent placeholder="+27 71 935..." value={phoneEntered} iconName={'phone-portrait-outline'} keyboardType={'phone-pad'} onChangeText={(text: string)=>{
              setPhoneEntered(text)
            } } />
            </View>

          <Text
            style={[
              globalStyles.title,
              {
                textAlign: "left",
                alignItems: "flex-start",
                width: "100%",
                paddingLeft: 16,
                marginBottom:16
              },
            ]}
          >
            Write Special Card Message
          </Text>
          <View style={{ marginBottom: 16,width:'100%' }}>
            <TextAreaComponent
              onTextChange={(textDescr) => setSpecialMessage(textDescr)}
              textValue={undefined}
            />
          </View>
          <Text
            style={[
              globalStyles.title,
              {
                textAlign: "left",
                alignItems: "flex-start",
                width: "100%",
                paddingLeft: 16,
              },
            ]}
          >
            Select Delivery Date
          </Text>
          <CalendarComponent
            onEventClick={() => { } }
            onTimeClick={(time) => {
              setSelectedBookingTimeSlot(time);
            } }
            events={formattedEvents.events}
            agendaItems={formattedEvents.agendaItems}
            onBookEvent={function (date: string): void {
              if(userData?.subscription.totalCredits === 0){
                setIsOutOfCredits(true)
              }else{
                setSelectedDate(date);
                setModalVisible(true);
              }
            } }
            allowBooking={true}
            maskPhone={true} maskTextValue={true}          />
        </View>
      </ScrollView>

      {modalVisible && (
        <CustomModal
          visible={modalVisible}
          isSubmititng={isSubmittingAppointment}
          onClose={function (): void {
            setModalVisible(false);
            setSelectedDate(null);
          }}
          children={renderModalChildren("")}
          onConfirm={() => {
            confirmSettingBooking();
          }}
        ></CustomModal>
      )}

      {receiptData && (
        <ReceiptModal
          visible={recieptModalVisible}
          onClose={() => setRecieptModalVisible(false)}
          receipt={receiptData}
        />
      )}

      {<PayFastModal
        isVisible={paymentModalVisible}
        onClose={closeModal}
        paymentData={paymentData}
      />}

      {<CustomModal visible={isOutOfCredits} onClose={()=> setIsOutOfCredits(false)} onConfirm={()=> acceptCreditPurchase()} children={renderOutOfCredits()}/>}
    </SafeAreaView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </ScrollView>
    
  ) : (
    <LoadingScreen />
  );
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
    color: tokens.colors.floraOnTapMainColor, // Customize the icon color if needed
  },
  detailText: {
    fontSize: 14,
    color: "#333", // Customize text color
    maxWidth: Dimensions.get("screen").width - 60,
    paddingRight: 12,
  },
  flexStart: {
    textAlign: "center",
    backgroundColor: tokens.colors.fadedBackgroundGey,
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  price: {
    fontWeight: "700",
    paddingLeft: 6,
    paddingRight: 6,
  },
  outOfCreditsContainer: {
    padding: 20,
    alignItems: "center", // Center the header and content
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  outOfCreditsText: {
    fontSize: 14,
    color: "#666",
    textAlign:'justify',
    marginBottom: 20,
  },
  planList: {
    width: "100%", // Adjusts to take the full width
  },
  planOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00796b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  selected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#00796b",
  },
  planText: {
    fontSize: 16,
  },
});

export default PlaceOrder;
