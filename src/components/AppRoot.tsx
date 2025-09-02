import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useRegistration } from '../contexts/RegistrationContext';
import RegistrationFlow from '../screens/registration/RegistrationFlow';
import RegistrationSuccessScreen from '../screens/registration/RegistrationSuccessScreen';

interface AppRootProps {
  children: React.ReactNode;
}

const AppRoot: React.FC<AppRootProps> = ({ children }) => {
  const { isRegistered, isLoading } = useRegistration();
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Show loading spinner while checking registration status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4C430" />
      </View>
    );
  }

  // Show success screen briefly after registration
  if (showSuccessScreen) {
    return (
      <RegistrationSuccessScreen
        onContinue={() => setShowSuccessScreen(false)}
      />
    );
  }

  // Show registration flow if user is not registered
  if (!isRegistered) {
    return <RegistrationFlow />;
  }

  // Show main app if user is registered
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6F0',
  },
});

export default AppRoot;