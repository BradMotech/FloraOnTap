import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Animatable from 'react-native-animatable';

const ReceiptModal = ({ visible, onClose, receipt }) => {
  const [isAnimationActive, setAnimationActive] = useState(false);

  // Trigger animation when the modal becomes visible
  useEffect(() => {
    if (visible) {
      setAnimationActive(true);
    } else {
      setAnimationActive(false); // Reset the animation when modal closes
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      animationType="fade" // Fade effect for modal opening
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        {visible && (
          <Animatable.View
            animation={isAnimationActive ? "slideInUp" : undefined}
            duration={500} // Duration of the animation
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.title}>Receipt</Text>
              <View style={styles.separator} />

              {/* QR Code for Booking ID */}
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={receipt.bookingId}
                  size={80} // Adjust size as needed for a smaller footprint
                  color="black"
                  backgroundColor="white"
                />
              </View>

              <Text style={styles.label}>Booking ID:</Text>
              <Text style={styles.value}>{receipt.bookingId}</Text>

              <Text style={styles.label}>Hairstyle:</Text>
              <Text style={styles.value}>{receipt.hairstyle}</Text>

              <Text style={styles.label}>Stylist:</Text>
              <Text style={styles.value}>{receipt.stylist}</Text>

              <Text style={styles.label}>Appointment Date:</Text>
              <Text style={styles.value}>{receipt.appointmentDate}</Text>

              <Text style={styles.label}>Customer Name:</Text>
              <Text style={styles.value}>{receipt.name}</Text>

              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{receipt.notes}</Text>

              <Text style={styles.label}>Date Created:</Text>
              <Text style={styles.value}>{receipt.createdAt}</Text>

              <View style={styles.separator} />
              <Text style={styles.footer}>Thank you for your booking!</Text>
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background
  },
  modalContainer: {
    width: '60%', // Narrower width for a receipt-like appearance
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Courier New', // Monospace font for a receipt look
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },
  value: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Courier New',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    fontFamily: 'Courier New',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReceiptModal;
