import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import tokens from '../styles/tokens';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmititng?:boolean;
  children: React.ReactNode; // Accept children from the parent
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, children,onConfirm,isSubmititng }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Render children passed from parent */}
          {children}

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            {!isSubmititng ? <TouchableOpacity onPress={onConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Proceed booking</Text>
            </TouchableOpacity> : <ActivityIndicator size={'small'} color={tokens.colors.hairduMainColor}/>}
            <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.blackColor, // Transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent:'space-between',
    width:'100%'
  },
  button: {
    backgroundColor: tokens.colors.hairduMainColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
