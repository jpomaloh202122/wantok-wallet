import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';

interface SecurityInfo {
  biometricEnabled: boolean;
  deviceId: string;
  registrationDate: string;
}

interface SecuritySetupScreenProps {
  onNext: (securityInfo: SecurityInfo) => void;
  onBack: () => void;
}

const SecuritySetupScreen: React.FC<SecuritySetupScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await authService.isBiometricAvailable();
    const types = await authService.getSupportedBiometrics();
    
    setBiometricAvailable(available);
    setBiometricTypes(types);
    setBiometricEnabled(available); // Default to enabled if available
  };

  const getBiometricTypeText = (): string => {
    if (biometricTypes.includes(2)) {
      return 'Face ID';
    } else if (biometricTypes.includes(1)) {
      return 'Fingerprint';
    }
    return 'Biometric';
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (!enabled) {
      setBiometricEnabled(false);
      return;
    }

    if (!biometricAvailable) {
      Alert.alert(
        'Biometric Authentication Unavailable',
        'Please set up biometric authentication in your device settings first.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsLoading(true);
      const result = await authService.authenticateWithBiometrics(
        'Verify your identity to enable biometric authentication for Sevis Wallet'
      );

      if (result.success) {
        setBiometricEnabled(true);
        Alert.alert(
          'Success',
          `${getBiometricTypeText()} authentication has been enabled for your Sevis Wallet.`
        );
      } else {
        Alert.alert(
          'Authentication Failed',
          result.error || 'Please try again'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enable biometric authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeviceId = (): string => {
    // In a real app, you'd use a proper device ID
    return `sevis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleContinue = () => {
    const securityInfo: SecurityInfo = {
      biometricEnabled,
      deviceId: generateDeviceId(),
      registrationDate: new Date().toISOString(),
    };

    onNext(securityInfo);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#F4C430" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Security Setup</Text>
          <Text style={styles.subtitle}>
            Configure security settings to protect your digital identity and credentials
          </Text>
        </View>

        <View style={styles.securityOptions}>
          {/* Biometric Authentication */}
          <View style={styles.securityOption}>
            <View style={styles.optionHeader}>
              <View style={styles.optionIconContainer}>
                <Ionicons 
                  name={biometricTypes.includes(2) ? 'scan' : 'finger-print'} 
                  size={24} 
                  color="#F4C430" 
                />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  {getBiometricTypeText()} Authentication
                </Text>
                <Text style={styles.optionDescription}>
                  {biometricAvailable 
                    ? `Use ${getBiometricTypeText().toLowerCase()} to secure your wallet`
                    : 'Not available on this device'
                  }
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: '#E5D5B7', true: '#F4C430' }}
                thumbColor="#FFFFFF"
                disabled={!biometricAvailable || isLoading}
              />
            </View>
          </View>

          {/* Device Binding */}
          <View style={styles.securityOption}>
            <View style={styles.optionHeader}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="phone-portrait" size={24} color="#F4C430" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Device Binding</Text>
                <Text style={styles.optionDescription}>
                  Bind your identity to this device for additional security
                </Text>
              </View>
              <View style={styles.enabledBadge}>
                <Ionicons name="checkmark" size={16} color="#34C759" />
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            </View>
          </View>

          {/* Local Encryption */}
          <View style={styles.securityOption}>
            <View style={styles.optionHeader}>
              <View style={styles.optionIconContainer}>
                <Ionicons name="lock-closed" size={24} color="#F4C430" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Local Encryption</Text>
                <Text style={styles.optionDescription}>
                  All credentials are encrypted and stored locally on your device
                </Text>
              </View>
              <View style={styles.enabledBadge}>
                <Ionicons name="checkmark" size={16} color="#34C759" />
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Security Features</Text>
          
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
            <Text style={styles.featureText}>W3C-compliant cryptographic proofs</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="key" size={20} color="#34C759" />
            <Text style={styles.featureText}>Self-sovereign identity (SSI)</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="eye-off" size={20} color="#34C759" />
            <Text style={styles.featureText}>Zero-knowledge proofs support</Text>
          </View>
          
          <View style={styles.feature}>
            <Ionicons name="cloud-offline" size={20} color="#34C759" />
            <Text style={styles.featureText}>Offline verification capability</Text>
          </View>
        </View>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color="#FF9500" />
          <Text style={styles.warningText}>
            Important: Your private keys and credentials will be stored securely on this device. 
            Make sure to backup your recovery information once registration is complete.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleContinue}>
          <Text style={styles.nextButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5D5B7',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F6F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5D5B7',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F4C430',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    lineHeight: 22,
  },
  securityOptions: {
    marginBottom: 32,
  },
  securityOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F4C430',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 196, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  optionDescription: {
    fontSize: 14,
    color: '#8B7355',
    marginTop: 2,
  },
  enabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  enabledText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginLeft: 4,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 12,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5D5B7',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4C430',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default SecuritySetupScreen;