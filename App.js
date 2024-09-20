import React,{useEffect} from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import globalStyles from "./src/styles/globalStyles";
import RootNavigator from "./src/navigation/RootNavigator";
import { StatusBar } from "react-native"; // Import StatusBar
import { AuthProvider } from "./src/auth/AuthContext";
import { ToastProvider } from "./src/components/ToastContext";

const App = () => {
  return (
    <SafeAreaProvider style={globalStyles.safeArea}>
      <ToastProvider>
      <StatusBar hidden={true} /> 
      <AuthProvider>
     <RootNavigator/>
      </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
