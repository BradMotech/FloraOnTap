import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet, Dimensions } from "react-native";
import ButtonComponent from "./buttonComponent";
import tokens from "../styles/tokens";
import { FontAwesome } from '@expo/vector-icons'; // For the blue dot and pin

interface AppointmentModalProps {
  visible: boolean;
  title:string;
  leftButtonTitle:string;
  rightButtonTitle:string;
  onConfirm: () => void;
  onClose: () => void;
  event: any; // Event object
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ visible, onClose, event,title,leftButtonTitle,rightButtonTitle,onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalBody}>{event.name}</Text>
          <Text style={styles.modalBody}>{"Special Message : "}<Text style={{color:tokens.colors.skyBlueColor}}>{event.appointmentDetails.events[0].specialMessage}</Text> { '\n'+'\n' } <Text style={{color:tokens.colors.gray}}>Copy Message </Text><FontAwesome name="copy" size={17} color={tokens.colors.gray} /></Text>
          <Text style={styles.modalBody}>{"Location : "}<Text style={{color:tokens.colors.skyBlueColor}}>{event.appointmentDetails.events[0].end.placeName}</Text></Text>
          {/* Footer with buttons */}
          <View style={styles.modalFooter}>
            <View style={{width:Dimensions.get("screen").width/3.4}}>
            <ButtonComponent
              text={leftButtonTitle}
              buttonColor={tokens.colors.skyBlueColor}
              onPress={() => {
                console.log("Declined");
                onConfirm(); // Close the modal after decline
              }}
            />
            </View>
            <View style={{width:Dimensions.get("screen").width/3.4}}>
            <ButtonComponent
              text={rightButtonTitle}
              buttonColor={tokens.colors.blackColor}
              onPress={() => {
                console.log("Confirmed");
                onClose(); // Close the modal after confirm
              }}
            />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: tokens.colors.blackColor, // Dark transparent background
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "flex-start",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign:'left',
      alignItems:'flex-start'
    },
    modalBody: {
      fontSize: 16,
      marginBottom: 20,
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
  });

export default AppointmentModal;