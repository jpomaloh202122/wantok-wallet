import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRegistration } from '../../contexts/RegistrationContext';

interface RegistrationSuccessScreenProps {
  onContinue: () => void;
}

const RegistrationSuccessScreen: React.FC<RegistrationSuccessScreenProps> = ({
  onContinue,
}) => {
  const { userDID, registrationData, walletCredential } = useRegistration();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#34C759" />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to Sevis Wallet!</Text>
          <Text style={styles.subtitle}>
            Your W3C-compliant digital identity has been created successfully
          </Text>
        </View>

        <View style={styles.credentialCard}>
          <View style={styles.cardHeader}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.cardLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.cardTitle}>Sevis Wallet Membership</Text>
              <Text style={styles.cardSubtitle}>Verifiable Credential</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Holder:</Text>
              <Text style={styles.credentialValue}>
                {registrationData?.personalInfo.firstName} {registrationData?.personalInfo.lastName}
              </Text>
            </View>

            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>DID:</Text>
              <Text style={styles.credentialValue} numberOfLines={1} ellipsizeMode="middle">
                {userDID?.did}
              </Text>
            </View>

            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Issued:</Text>
              <Text style={styles.credentialValue}>
                {walletCredential?.issuanceDate ? 
                  new Date(walletCredential.issuanceDate).toLocaleDateString() : 
                  'Today'
                }
              </Text>
            </View>

            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Status:</Text>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.statusText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={32} color="#F4C430" />
            <Text style={styles.featureTitle}>Secure</Text>
            <Text style={styles.featureDescription}>
              Protected by industry-standard encryption
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="globe" size={32} color="#F4C430" />
            <Text style={styles.featureTitle}>Universal</Text>
            <Text style={styles.featureDescription}>
              Works with any W3C-compliant service
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="key" size={32} color="#F4C430" />
            <Text style={styles.featureTitle}>Owned by You</Text>
            <Text style={styles.featureDescription}>
              You control your identity and credentials
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="eye-off" size={32} color="#F4C430" />
            <Text style={styles.featureTitle}>Private</Text>
            <Text style={styles.featureDescription}>
              Share only what you choose to share
            </Text>
          </View>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          
          <View style={styles.nextStep}>
            <Ionicons name="add-circle" size={20} color="#F4C430" />
            <Text style={styles.nextStepText}>
              Add more credentials from trusted issuers
            </Text>
          </View>
          
          <View style={styles.nextStep}>
            <Ionicons name="card" size={20} color="#F4C430" />
            <Text style={styles.nextStepText}>
              Store your payment and membership cards
            </Text>
          </View>
          
          <View style={styles.nextStep}>
            <Ionicons name="id-card" size={20} color="#F4C430" />
            <Text style={styles.nextStepText}>
              Digitize your important ID documents
            </Text>
          </View>
          
          <View style={styles.nextStep}>
            <Ionicons name="share" size={20} color="#F4C430" />
            <Text style={styles.nextStepText}>
              Present your credentials when needed
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Start Using Sevis Wallet</Text>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  successIcon: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
  iconContainer: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 50,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
  },
  credentialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5D5B7',
  },
  cardLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8B7355',
  },
  cardContent: {},
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  credentialLabel: {
    fontSize: 14,
    color: '#8B7355',
    flex: 1,
  },
  credentialValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginLeft: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 16,
  },
  nextSteps: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  continueButton: {
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
  continueButtonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default RegistrationSuccessScreen;