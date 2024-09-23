import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
} from "react-native";
import ButtonComponent from "./buttonComponent";
import tokens from "../styles/tokens";

interface ForgotPasswordModalProps {
  visible: boolean;
  onConfirm: (email: string) => void;
  onCancel: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    onConfirm(email); // Pass the email back to the parent
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Forgot Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor={tokens.colors.blackColor}
          />

          <View style={styles.buttonContainer}>
            <View style={{ width: Dimensions.get("screen").width / 3.5 }}>
              <ButtonComponent onPress={handleConfirm} text={"Confirm"} />
            </View>
            <View style={{ width: Dimensions.get("screen").width / 3.5 }}>
              <ButtonComponent
                buttonColor="red"
                onPress={onCancel}
                text={"Cancel"}
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
    backgroundColor: tokens.colors.blackColor,
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    fontFamily:'GorditaMedium',
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily:'GorditaRegular',
    color:tokens.colors.blackColor
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ForgotPasswordModal;
