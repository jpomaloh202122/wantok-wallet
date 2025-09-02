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

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Sevis Wallet</Text>
          <Text style={styles.subtitle}>Your Digital Identity, Secured</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={32} color="#F4C430" />
            </View>
            <Text style={styles.featureTitle}>W3C Compliant</Text>
            <Text style={styles.featureDescription}>
              Built with industry-standard W3C specifications for decentralized identity and verifiable credentials
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="finger-print" size={32} color="#F4C430" />
            </View>
            <Text style={styles.featureTitle}>Biometric Security</Text>
            <Text style={styles.featureDescription}>
              Your identity is protected by advanced biometric authentication and local encryption
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="key" size={32} color="#F4C430" />
            </View>
            <Text style={styles.featureTitle}>Your Keys, Your Control</Text>
            <Text style={styles.featureDescription}>
              You own and control your digital identity with self-sovereign identity principles
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="globe" size={32} color="#F4C430" />
            </View>
            <Text style={styles.featureTitle}>Universal Compatibility</Text>
            <Text style={styles.featureDescription}>
              Works with any service or organization that supports W3C verifiable credentials
            </Text>
          </View>
        </View>

        <View style={styles.complianceInfo}>
          <Text style={styles.complianceTitle}>Built on Open Standards</Text>
          <Text style={styles.complianceText}>
            Sevis Wallet implements W3C Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) 
            to ensure your digital identity is portable, secure, and privacy-preserving.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          By continuing, you agree to create a W3C-compliant decentralized identity
        </Text>
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
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(244, 196, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 20,
  },
  complianceInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F4C430',
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  complianceText: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4C430',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default WelcomeScreen;