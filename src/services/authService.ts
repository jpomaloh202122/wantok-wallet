import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: LocalAuthentication.AuthenticationType[];
}

class AuthService {
  private readonly AUTH_ENABLED_KEY = 'biometric_auth_enabled';
  private readonly LAST_AUTH_KEY = 'last_authentication';

  async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  async getSupportedBiometrics(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported biometrics:', error);
      return [];
    }
  }

  async authenticateWithBiometrics(reason?: string): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || 'Authenticate to access Wantok Wallet',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
        requireConfirmation: false,
      });

      if (result.success) {
        await this.updateLastAuthTime();
        const biometricTypes = await this.getSupportedBiometrics();
        return {
          success: true,
          biometricType: biometricTypes,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed',
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Authentication error occurred',
      };
    }
  }

  async isBiometricAuthEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(this.AUTH_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric auth setting:', error);
      return false;
    }
  }

  async enableBiometricAuth(): Promise<boolean> {
    try {
      const authResult = await this.authenticateWithBiometrics(
        'Enable biometric authentication for Wantok Wallet'
      );
      
      if (authResult.success) {
        await SecureStore.setItemAsync(this.AUTH_ENABLED_KEY, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enabling biometric auth:', error);
      return false;
    }
  }

  async disableBiometricAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.AUTH_ENABLED_KEY);
      await SecureStore.deleteItemAsync(this.LAST_AUTH_KEY);
    } catch (error) {
      console.error('Error disabling biometric auth:', error);
    }
  }

  private async updateLastAuthTime(): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        this.LAST_AUTH_KEY,
        new Date().toISOString()
      );
    } catch (error) {
      console.error('Error updating last auth time:', error);
    }
  }

  async getLastAuthTime(): Promise<Date | null> {
    try {
      const lastAuth = await SecureStore.getItemAsync(this.LAST_AUTH_KEY);
      return lastAuth ? new Date(lastAuth) : null;
    } catch (error) {
      console.error('Error getting last auth time:', error);
      return null;
    }
  }

  async isAuthRequired(): Promise<boolean> {
    try {
      const isEnabled = await this.isBiometricAuthEnabled();
      if (!isEnabled) return false;

      const lastAuth = await this.getLastAuthTime();
      if (!lastAuth) return true;

      // Require re-authentication after 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return lastAuth < fiveMinutesAgo;
    } catch (error) {
      console.error('Error checking auth requirement:', error);
      return true;
    }
  }

  getBiometricTypeDisplayName(type: LocalAuthentication.AuthenticationType): string {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'Fingerprint';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'Face ID';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'Iris';
      default:
        return 'Biometric';
    }
  }
}

export const authService = new AuthService();