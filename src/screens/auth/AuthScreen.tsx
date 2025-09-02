import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onSkip,
  title = 'Secure Access',
  subtitle = 'Please authenticate to access your wallet',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [supportedBiometrics, setSupportedBiometrics] = useState<any[]>([]);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await authService.isBiometricAvailable();
    const supported = await authService.getSupportedBiometrics();
    setBiometricAvailable(available);
    setSupportedBiometrics(supported);
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      const result = await authService.authenticateWithBiometrics(subtitle);
      if (result.success) {
        onAuthSuccess();
      } else {
        Alert.alert(
          'Authentication Failed',
          result.error || 'Please try again',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricIcon = () => {
    if (supportedBiometrics.includes(2)) { // FACIAL_RECOGNITION
      return 'scan';
    } else if (supportedBiometrics.includes(1)) { // FINGERPRINT
      return 'finger-print';
    }
    return 'shield-checkmark';
  };

  const getBiometricLabel = () => {
    if (supportedBiometrics.includes(2)) {
      return 'Use Face ID';
    } else if (supportedBiometrics.includes(1)) {
      return 'Use Fingerprint';
    }
    return 'Use Biometrics';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={64} color="#F4C430" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.authOptions}>
          {biometricAvailable ? (
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleBiometricAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name={getBiometricIcon()} size={24} color="#FFFFFF" />
                  <Text style={styles.authButtonText}>{getBiometricLabel()}</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.unavailableContainer}>
              <Ionicons name="warning" size={48} color="#FF9500" />
              <Text style={styles.unavailableTitle}>Biometric Authentication Unavailable</Text>
              <Text style={styles.unavailableText}>
                Please set up Face ID, Touch ID, or fingerprint authentication in your device settings
              </Text>
            </View>
          )}

          {onSkip && (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.securityInfo}>
          <View style={styles.securityItem}>
            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
            <Text style={styles.securityText}>Data encrypted on device</Text>
          </View>
          <View style={styles.securityItem}>
            <Ionicons name="lock-closed" size={20} color="#34C759" />
            <Text style={styles.securityText}>Secure local storage</Text>
          </View>
          <View style={styles.securityItem}>
            <Ionicons name="eye-off" size={20} color="#34C759" />
            <Text style={styles.securityText}>No data transmitted</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  authOptions: {
    alignItems: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4C430',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  authButtonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  unavailableContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  unavailableTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  unavailableText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  skipButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#F4C430',
    textAlign: 'center',
  },
  securityInfo: {
    paddingBottom: 40,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#34C759',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default AuthScreen;