import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component
import * as Animatable from 'react-native-animatable';
import { printAsync } from 'expo-print'; // Import expo-print
import tokens from '../styles/tokens';

const ReceiptModal = ({ visible, onClose, receipt }) => {
  const [isAnimationActive, setAnimationActive] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const qrCodeRef = useRef();

  // Trigger animation when the modal becomes visible
  useEffect(() => {
    if (visible) {
      setAnimationActive(true);

      // Generate the QR code as base64 when the modal becomes visible
      if (qrCodeRef.current) {
        qrCodeRef.current.toDataURL((dataURL) => {
          setQrCodeBase64(dataURL); // Save the base64 QR code string
        });
      }
    } else {
      setAnimationActive(false); // Reset the animation when modal closes
    }
  }, [visible]);

  const handlePrint = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; padding: 15px; }
            .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 10px; }
            .label { font-weight: bold; margin-top: 10px; }
            .separator { height: 1px; background-color: #ccc; margin: 10px 0; }
            .footer { font-style: italic; text-align: center; margin-top: 10px; }
            .qrCode { text-align: center; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1 class="title">Receipt</h1>
          <div class="qrCode">
            ${qrCodeBase64 ? `<img src="${qrCodeBase64}" alt="QR Code" width="80" height="80" />` : ''}
          </div>
          <p class="label">Booking ID: ${receipt.bookingId}</p>
          <p>${receipt.hairstyle}</p>
          <p class="label">Price: ${receipt.price}</p>
          <p>${receipt.appointmentDate}</p>
          <p class="label">Customer Name: ${receipt.name}</p>
          <p>${receipt.notes}</p>
          <p class="label">Date of order: ${receipt.createdAt}</p>
          <p class="footer">Thank you for placing your order!</p>
        </body>
      </html>
    `;

    try {
      await printAsync({
        html: htmlContent,
      });
    } catch (error) {
      console.error('Failed to print receipt:', error);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        {visible && (
          <Animatable.View
            animation={isAnimationActive ? "slideInUp" : undefined}
            duration={500}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.title}>Receipt</Text>
              <View style={styles.separator} />

              {/* QR Code for Booking ID */}
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={receipt.bookingId}
                  size={80}
                  color="black"
                  backgroundColor="white"
                  getRef={qrCodeRef} // Set the ref to access the QR code
                />
              </View>

              <Text style={styles.label}>Booking ID:</Text>
              <Text style={styles.value}>{receipt.bookingId}</Text>

              <Text style={styles.label}>Flora Item:</Text>
              <Text style={styles.value}>{receipt.hairstyle}</Text>

              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>{receipt.price}</Text>

              <Text style={styles.label}>Appointment Date:</Text>
              <Text style={styles.value}>{receipt.appointmentDate}</Text>

              <Text style={styles.label}>Customer Name:</Text>
              <Text style={styles.value}>{receipt.name}</Text>

              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{receipt.notes}</Text>

              <Text style={styles.label}>Date of order:</Text>
              <Text style={styles.value}>{receipt.createdAt}</Text>

              <View style={styles.separator} />
              <Text style={styles.footer}>Thank you for placing your order!</Text>
            </ScrollView>

            <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
              <Text style={styles.closeButtonText}>Print Receipt</Text>
            </TouchableOpacity>

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
    backgroundColor: tokens.colors.barkInspiredTextColor,
  },
  modalContainer: {
    width: '60%',
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
    fontFamily: 'Courier New',
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
  printButton: {
    backgroundColor: tokens.colors.floraOnTapMainColor,
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
