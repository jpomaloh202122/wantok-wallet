import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RegistrationData } from '../../services/didService';

interface RegistrationCompleteScreenProps {
  personalInfo: any;
  securityInfo: any;
  onComplete: (registrationData: RegistrationData) => Promise<void>;
  onBack: () => void;
}

const RegistrationCompleteScreen: React.FC<RegistrationCompleteScreenProps> = ({
  personalInfo,
  securityInfo,
  onComplete,
  onBack,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleCompleteRegistration = async () => {
    try {
      setIsRegistering(true);

      const registrationData: RegistrationData = {
        personalInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          dateOfBirth: personalInfo.dateOfBirth || undefined,
          phoneNumber: personalInfo.phoneNumber || undefined,
        },
        securityInfo: {
          biometricEnabled: securityInfo.biometricEnabled,
          deviceId: securityInfo.deviceId,
          registrationDate: securityInfo.registrationDate,
        },
      };

      await onComplete(registrationData);
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert(
        'Registration Failed',
        'There was an error creating your digital identity. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRegistering(false);
    }
  };

  if (isRegistering) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4C430" />
          <Text style={styles.loadingTitle}>Creating Your Digital Identity</Text>
          <Text style={styles.loadingText}>
            Generating W3C-compliant DID and verifiable credentials...
          </Text>
          
          <View style={styles.loadingSteps}>
            <View style={styles.loadingStep}>
              <Ionicons name="key" size={20} color="#F4C430" />
              <Text style={styles.loadingStepText}>Generating cryptographic keys</Text>
            </View>
            <View style={styles.loadingStep}>
              <Ionicons name="document-text" size={20} color="#F4C430" />
              <Text style={styles.loadingStepText}>Creating DID document</Text>
            </View>
            <View style={styles.loadingStep}>
              <Ionicons name="shield-checkmark" size={20} color="#F4C430" />
              <Text style={styles.loadingStepText}>Issuing membership credential</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#F4C430" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Step 3 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Review & Confirm</Text>
          <Text style={styles.subtitle}>
            Please review your information before creating your W3C-compliant digital identity
          </Text>
        </View>

        {/* Personal Information Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>
              {personalInfo.firstName} {personalInfo.lastName}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Email:</Text>
            <Text style={styles.summaryValue}>{personalInfo.email}</Text>
          </View>
          
          {personalInfo.dateOfBirth && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date of Birth:</Text>
              <Text style={styles.summaryValue}>{personalInfo.dateOfBirth}</Text>
            </View>
          )}
          
          {personalInfo.phoneNumber && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Phone:</Text>
              <Text style={styles.summaryValue}>{personalInfo.phoneNumber}</Text>
            </View>
          )}
        </View>

        {/* Security Settings Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Biometric Authentication:</Text>
            <View style={styles.statusBadge}>
              <Ionicons 
                name={securityInfo.biometricEnabled ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={securityInfo.biometricEnabled ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[
                styles.statusText, 
                { color: securityInfo.biometricEnabled ? "#34C759" : "#FF3B30" }
              ]}>
                {securityInfo.biometricEnabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Device Binding:</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={[styles.statusText, { color: "#34C759" }]}>Enabled</Text>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Local Encryption:</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={[styles.statusText, { color: "#34C759" }]}>Enabled</Text>
            </View>
          </View>
        </View>

        {/* What Happens Next */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.sectionTitle}>What Happens Next</Text>
          
          <View style={styles.nextStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              A W3C-compliant Decentralized Identifier (DID) will be created for you
            </Text>
          </View>
          
          <View style={styles.nextStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Your Sevis Wallet membership credential will be issued and stored securely
            </Text>
          </View>
          
          <View style={styles.nextStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              You'll be able to receive, store, and present verifiable credentials
            </Text>
          </View>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsSection}>
          <View style={styles.termsItem}>
            <Ionicons name="shield-checkmark" size={20} color="#F4C430" />
            <Text style={styles.termsText}>
              Your data is encrypted and stored locally on your device
            </Text>
          </View>
          
          <View style={styles.termsItem}>
            <Ionicons name="key" size={20} color="#F4C430" />
            <Text style={styles.termsText}>
              You maintain full control of your private keys and credentials
            </Text>
          </View>
          
          <View style={styles.termsItem}>
            <Ionicons name="globe" size={20} color="#F4C430" />
            <Text style={styles.termsText}>
              Your identity is interoperable with any W3C-compliant system
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.completeButton} 
          onPress={handleCompleteRegistration}
          disabled={isRegistering}
        >
          <Text style={styles.completeButtonText}>Create My Digital Identity</Text>
          <Ionicons name="checkmark" size={20} color="#1A1A1A" />
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
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8B7355',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  nextStepsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4C430',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
  termsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  termsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
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
  completeButton: {
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
  completeButtonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  loadingSteps: {
    width: '100%',
  },
  loadingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  loadingStepText: {
    fontSize: 16,
    color: '#3C3C43',
    marginLeft: 12,
  },
});

export default RegistrationCompleteScreen;