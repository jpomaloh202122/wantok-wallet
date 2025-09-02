import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';

const SettingsScreen: React.FC = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [supportedBiometrics, setSupportedBiometrics] = useState<any[]>([]);

  useEffect(() => {
    checkBiometricSettings();
  }, []);

  const checkBiometricSettings = async () => {
    const available = await authService.isBiometricAvailable();
    const enabled = await authService.isBiometricAuthEnabled();
    const supported = await authService.getSupportedBiometrics();
    
    setBiometricAvailable(available);
    setBiometricEnabled(enabled);
    setSupportedBiometrics(supported);
  };

  const toggleBiometric = async (value: boolean) => {
    if (value) {
      const success = await authService.enableBiometricAuth();
      if (success) {
        setBiometricEnabled(true);
        Alert.alert('Success', 'Biometric authentication has been enabled');
      } else {
        Alert.alert('Error', 'Failed to enable biometric authentication');
      }
    } else {
      Alert.alert(
        'Disable Biometric Authentication',
        'Are you sure you want to disable biometric authentication?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await authService.disableBiometricAuth();
              setBiometricEnabled(false);
            },
          },
        ]
      );
    }
  };

  const getBiometricTypeText = () => {
    if (supportedBiometrics.includes(2)) {
      return 'Face ID';
    } else if (supportedBiometrics.includes(1)) {
      return 'Fingerprint';
    }
    return 'Biometric';
  };

  const settingsOptions = [
    {
      title: 'Security',
      options: [
        {
          title: `${getBiometricTypeText()} Authentication`,
          subtitle: biometricAvailable 
            ? `Use ${getBiometricTypeText().toLowerCase()} to secure Wantok Wallet`
            : 'Not available on this device',
          icon: 'finger-print',
          component: biometricAvailable ? (
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometric}
              trackColor={{ false: '#E5E5EA', true: '#F4C430' }}
              thumbColor="#FFFFFF"
            />
          ) : null,
          disabled: !biometricAvailable,
        },
      ],
    },
    {
      title: 'Data Management',
      options: [
        {
          title: 'Export Data',
          subtitle: 'Export your Wantok Wallet data',
          icon: 'download',
          onPress: () => Alert.alert('Coming Soon', 'Export feature will be available soon'),
        },
        {
          title: 'Import Data',
          subtitle: 'Import Wantok Wallet data from file',
          icon: 'cloud-upload',
          onPress: () => Alert.alert('Coming Soon', 'Import feature will be available soon'),
        },
        {
          title: 'Clear All Data',
          subtitle: 'Remove all stored credentials and cards',
          icon: 'trash',
          destructive: true,
          onPress: () => {
            Alert.alert(
              'Clear All Data',
              'This will permanently delete all your stored credentials, cards, and IDs. This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear All',
                  style: 'destructive',
                  onPress: () => Alert.alert('Coming Soon', 'Clear all data feature will be available soon'),
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'About',
      options: [
        {
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          icon: 'shield-checkmark',
          onPress: () => Alert.alert('Privacy', 'Your data is stored securely on your device and never transmitted to external servers.'),
        },
        {
          title: 'Version',
          subtitle: '1.0.0',
          icon: 'information-circle',
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.settingItem, item.disabled && styles.disabledItem]}
      onPress={item.onPress}
      disabled={item.disabled}
    >
      <View style={styles.settingIcon}>
        <Ionicons 
          name={item.icon} 
          size={20} 
          color={item.destructive ? '#FF3B30' : '#F4C430'} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          item.destructive && styles.destructiveText,
          item.disabled && styles.disabledText
        ]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.settingSubtitle, item.disabled && styles.disabledText]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      {item.component || (
        <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {settingsOptions.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.options.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your data is stored securely on your device using industry-standard encryption.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  disabledItem: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  destructiveText: {
    color: '#FF3B30',
  },
  disabledText: {
    color: '#8E8E93',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;