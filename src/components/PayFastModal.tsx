import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import tokens from "../styles/tokens";
import globalStyles from "../styles/globalStyles";
import ButtonComponent from "./buttonComponent";
import { formatToRands } from "../utils/currencyUtil";

const PayFastModal = ({ isVisible, onClose, paymentData }) => {
  const [loading, setLoading] = useState(true);
  const [paymentFormHtml, setPaymentFormHtml] = useState(""); // Store HTML form
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the payment form HTML from Firebase Function
  const fetchPaymentForm = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        "https://generatepaymentidentifier-mquhheknbq-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
          mode: "cors",
        }
      );

      const result = await response.json();
      console.log("Response from Firebase Function:", result);
      if (response.ok && result.htmlForm) {
        // Inject CSS to style the Pay Now button and add an explanation
        const customCSS = `
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            input[type="submit"] {
              background-color: #4CAF50; /* Green background */
              color: white; /* White text */
              font-size: 40px; /* Larger text size */
              class=${globalStyles.GorditaRegular};
              padding: 20px; /* Padding */
              border: none; /* No border */
              border-radius: 5px; /* Rounded corners */
              cursor: pointer; /* Pointer cursor on hover */
              width: ${
                Dimensions.get("screen").width * 2 + "px"
              }; /* Full width */
              height: 100px; /* Fixed height */
              box-sizing: border-box; /* Include padding in width */
              margin-top:44px
            }
            input[type="submit"]:hover {
              background-color: #45a049; /* Darker green on hover */
            }
            img {
              max-width: 80%; /* Responsive image */
              margin-bottom: 20px;
            }
          </style>
        `;

        // Prepend the custom CSS to the existing HTML form
        setPaymentFormHtml(
          customCSS +
            `
         <div style="display:flex;flex-direction:column;align-items:center">
         <h1 class=${
           globalStyles.GorditaBold
         } style="font-size:100px;padding-left:82px">Continue making payment</h1>
         <h1 class=${
           globalStyles.GorditaRegular
         } style="font-size:60px;font-weight:300;color:${
              tokens.colors.text
            };padding:86px">Please click the "Pay Now" button to proceed paying an amount of ${formatToRands(
              paymentData.amount
            )}.</h1>
         ${result.htmlForm}
        </div>`
        );
      } else {
        setErrorMessage(result.error || "Failed to get payment form.");
      }
    } catch (error) {
      setErrorMessage("Error getting payment form: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchPaymentForm();
    }
  }, [isVisible]);

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    if (url.includes("success")) {
      Alert.alert("Payment Successful");
      onClose();
    } else if (url.includes("cancel")) {
      Alert.alert("Payment Cancelled");
      onClose();
    }
  };

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
          ) : errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <>
              {/* Render HTML form directly in WebView */}
              <WebView
                originWhitelist={["*"]}
                source={{ html: paymentFormHtml }}
                onNavigationStateChange={handleWebViewNavigationStateChange}
                startInLoadingState={true}
                javaScriptEnabled={true}
                hideKeyboardAccessoryView={true}
                scalesPageToFit={true}
                renderLoading={() => (
                  <ActivityIndicator
                    size="large"
                    color={tokens.colors.floraOnTapMainColor}
                  />
                )}
              />

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel Payment</Text>
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

export default PayFastModal;
