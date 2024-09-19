import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

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

          {/* Footer with buttons */}
          <View style={styles.modalFooter}>
            <Button
              title={leftButtonTitle}
              onPress={() => {
                console.log("Declined");
                onConfirm(); // Close the modal after decline
              }}
              color="red"
            />
            <Button
              title={rightButtonTitle}
              onPress={() => {
                console.log("Confirmed");
                onClose(); // Close the modal after confirm
              }}
              color="green"
            />
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
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
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