import 'react-native-get-random-values';
import { createAgent, ICredentialPlugin, IDataStore, IDataStoreORM, IKeyManager, TAgent } from '@veramo/core';
import { KeyManager } from '@veramo/key-manager';
import { DIDManager } from '@veramo/did-manager';
import { KeyDIDProvider } from '@veramo/did-provider-key';
import { KeyManagementSystem } from '@veramo/kms-local';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { createJWT, verifyJWT } from 'did-jwt';
import { createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

export interface UserDID {
  did: string;
  keyId: string;
  publicKey: string;
  created: string;
}

export interface RegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    phoneNumber?: string;
  };
  securityInfo: {
    biometricEnabled: boolean;
    deviceId: string;
    registrationDate: string;
  };
}

export interface SevisWalletCredential {
  '@context': string[];
  type: string[];
  credentialSubject: {
    id: string; // User's DID
    firstName: string;
    lastName: string;
    email: string;
    walletId: string;
    registrationDate: string;
    verificationLevel: 'basic' | 'verified' | 'premium';
  };
  issuer: string; // Sevis Wallet DID
  issuanceDate: string;
  expirationDate?: string;
  proof?: any;
}

class DIDService {
  private agent: TAgent<IKeyManager & ICredentialPlugin> | null = null;
  private readonly DID_STORAGE_KEY = 'user_did';
  private readonly REGISTRATION_STORAGE_KEY = 'user_registration';
  private readonly SEVIS_ISSUER_DID = 'did:key:sevis-wallet-issuer';

  async initializeAgent(): Promise<void> {
    if (this.agent) return;

    try {
      this.agent = createAgent<IKeyManager & ICredentialPlugin>({
        plugins: [
          new KeyManager({
            store: {
              // Simple in-memory store for demo - in production use encrypted storage
              async get(alias: string) {
                const stored = await SecureStore.getItemAsync(`key_${alias}`);
                return stored ? JSON.parse(stored) : null;
              },
              async set(alias: string, data: any) {
                await SecureStore.setItemAsync(`key_${alias}`, JSON.stringify(data));
              },
              async delete(alias: string) {
                await SecureStore.deleteItemAsync(`key_${alias}`);
              },
              async list() {
                // Simple implementation - in production, maintain a proper index
                return [];
              }
            },
            kms: {
              local: new KeyManagementSystem(),
            },
          }),
          new DIDManager({
            store: {
              async get(did: string) {
                const stored = await SecureStore.getItemAsync(`did_${did}`);
                return stored ? JSON.parse(stored) : null;
              },
              async set(did: string, data: any) {
                await SecureStore.setItemAsync(`did_${did}`, JSON.stringify(data));
              },
              async delete(did: string) {
                await SecureStore.deleteItemAsync(`did_${did}`);
              },
              async list() {
                return [];
              }
            },
            defaultProvider: 'did:key',
            providers: {
              'did:key': new KeyDIDProvider({
                defaultKms: 'local',
              }),
            },
          }),
          new CredentialPlugin(),
        ],
      });
    } catch (error) {
      console.error('Failed to initialize DID agent:', error);
      throw new Error('Failed to initialize identity system');
    }
  }

  async createUserDID(): Promise<UserDID> {
    await this.initializeAgent();
    if (!this.agent) throw new Error('Agent not initialized');

    try {
      // Create a new key
      const key = await this.agent.keyManagerCreate({
        kms: 'local',
        type: 'Secp256k1',
      });

      // Create DID document
      const identifier = await this.agent.didManagerCreate({
        provider: 'did:key',
        options: {
          keyType: 'Secp256k1',
        },
      });

      const userDID: UserDID = {
        did: identifier.did,
        keyId: key.kid,
        publicKey: key.publicKeyHex,
        created: new Date().toISOString(),
      };

      // Store securely
      await SecureStore.setItemAsync(this.DID_STORAGE_KEY, JSON.stringify(userDID));

      return userDID;
    } catch (error) {
      console.error('Failed to create user DID:', error);
      throw new Error('Failed to create user identity');
    }
  }

  async getUserDID(): Promise<UserDID | null> {
    try {
      const stored = await SecureStore.getItemAsync(this.DID_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to retrieve user DID:', error);
      return null;
    }
  }

  async isUserRegistered(): Promise<boolean> {
    const userDID = await this.getUserDID();
    const registration = await this.getRegistrationData();
    return !!(userDID && registration);
  }

  async registerUser(registrationData: RegistrationData): Promise<SevisWalletCredential> {
    await this.initializeAgent();
    if (!this.agent) throw new Error('Agent not initialized');

    try {
      // Create or get user DID
      let userDID = await this.getUserDID();
      if (!userDID) {
        userDID = await this.createUserDID();
      }

      // Store registration data
      await SecureStore.setItemAsync(this.REGISTRATION_STORAGE_KEY, JSON.stringify(registrationData));

      // Create Sevis Wallet membership credential
      const walletCredential: SevisWalletCredential = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://seviswallet.app/credentials/v1'
        ],
        type: ['VerifiableCredential', 'SevisWalletMembershipCredential'],
        credentialSubject: {
          id: userDID.did,
          firstName: registrationData.personalInfo.firstName,
          lastName: registrationData.personalInfo.lastName,
          email: registrationData.personalInfo.email,
          walletId: uuidv4(),
          registrationDate: registrationData.securityInfo.registrationDate,
          verificationLevel: 'basic',
        },
        issuer: this.SEVIS_ISSUER_DID,
        issuanceDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      };

      // In a full implementation, this would be signed by Sevis Wallet's private key
      // For now, we'll store it as a self-signed credential
      const vcJwt = await this.agent.createVerifiableCredential({
        credential: walletCredential,
        proofFormat: 'jwt',
      });

      // Store the credential
      await this.storeCredential(walletCredential);

      return walletCredential;
    } catch (error) {
      console.error('Failed to register user:', error);
      throw new Error('Registration failed');
    }
  }

  async getRegistrationData(): Promise<RegistrationData | null> {
    try {
      const stored = await SecureStore.getItemAsync(this.REGISTRATION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to retrieve registration data:', error);
      return null;
    }
  }

  async storeCredential(credential: any): Promise<void> {
    try {
      const credentialId = credential.id || uuidv4();
      await SecureStore.setItemAsync(`credential_${credentialId}`, JSON.stringify(credential));
    } catch (error) {
      console.error('Failed to store credential:', error);
      throw new Error('Failed to store credential');
    }
  }

  async verifyUserCredential(): Promise<boolean> {
    try {
      const userDID = await this.getUserDID();
      const registration = await this.getRegistrationData();
      
      return !!(userDID && registration);
    } catch (error) {
      console.error('Failed to verify user credential:', error);
      return false;
    }
  }

  async deleteUserData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.DID_STORAGE_KEY);
      await SecureStore.deleteItemAsync(this.REGISTRATION_STORAGE_KEY);
      
      // Delete all stored credentials
      // In production, maintain an index of credentials
      const keys = await SecureStore.getAllKeysAsync?.() || [];
      for (const key of keys) {
        if (key.startsWith('credential_') || key.startsWith('key_') || key.startsWith('did_')) {
          await SecureStore.deleteItemAsync(key);
        }
      }
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  // W3C-compliant credential verification
  async verifyCredential(credentialJwt: string): Promise<boolean> {
    try {
      const verificationResult = await verifyCredential(credentialJwt, {
        // In production, provide proper DID resolver
        resolver: {
          resolve: async (did: string) => {
            // Mock resolver - in production use proper DID resolution
            return {
              didDocument: {
                '@context': 'https://www.w3.org/ns/did/v1',
                id: did,
                publicKey: [],
                authentication: [],
                service: []
              },
              didResolutionMetadata: {},
              didDocumentMetadata: {}
            };
          }
        }
      });

      return verificationResult.verified;
    } catch (error) {
      console.error('Failed to verify credential:', error);
      return false;
    }
  }
}

export const didService = new DIDService();