import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import tokens from '../styles/tokens';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmititng?:boolean;
  children: React.ReactNode; // Accept children from the parent
}

const StoriesModal: React.FC<CustomModalProps> = ({ visible, onClose, children,onConfirm,isSubmititng }) => {
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
            <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StoriesModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000', // Transparent background
  },
  modalContent: {
    width: Dimensions.get('screen').width,
    height:Dimensions.get('screen').height,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 2,
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent:'space-between',
    width:'100%'
  },
  button: {
    backgroundColor: tokens.colors.floraOnTapMainColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    position:'absolute',
    bottom:0,
    marginBottom:40,
    marginRight:12,
    right:0
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
