import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import tokens from "../styles/tokens";
import globalStyles from "../styles/globalStyles";
import WeekdaySelector from "./WeekDaySelector";

const UpdateOperatingHoursModal = ({ isVisible, onClose,onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    setTimeout(() => {
    setLoading(false)  
    }, 2000);
  }, []);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={globalStyles.GorditaRegular}>Close</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={tokens.colors.floraOnTapMainColor}
            />
          ) : (
            <>
            <WeekdaySelector
              selectedDaysData={selectedDays}
              setSelectedDaysData={setSelectedDays}
            />
             <TouchableOpacity style={styles.cancelButton} onPress={()=> {console.warn(selectedDays),onUpdate(selectedDays)}}>
                <Text style={styles.buttonText}>Update Operating hours</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: tokens.colors.blackColor,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    height: "80%",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: tokens.colors.barkInspiredTextColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default UpdateOperatingHoursModal;
