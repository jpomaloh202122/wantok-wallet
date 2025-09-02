import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { didService, RegistrationData, UserDID, SevisWalletCredential } from '../services/didService';

export interface RegistrationContextType {
  isRegistered: boolean;
  isLoading: boolean;
  userDID: UserDID | null;
  registrationData: RegistrationData | null;
  walletCredential: SevisWalletCredential | null;
  
  // Registration flow
  registerUser: (data: RegistrationData) => Promise<void>;
  checkRegistrationStatus: () => Promise<void>;
  deleteRegistration: () => Promise<void>;
  
  // Registration steps
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: number[];
  markStepCompleted: (step: number) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};

interface RegistrationProviderProps {
  children: ReactNode;
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDID, setUserDID] = useState<UserDID | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [walletCredential, setWalletCredential] = useState<SevisWalletCredential | null>(null);
  
  // Registration flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const checkRegistrationStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is registered
      const registered = await didService.isUserRegistered();
      setIsRegistered(registered);
      
      if (registered) {
        // Load user data
        const did = await didService.getUserDID();
        const regData = await didService.getRegistrationData();
        
        setUserDID(did);
        setRegistrationData(regData);
        
        // Create wallet credential representation if registered
        if (did && regData) {
          const credential: SevisWalletCredential = {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://seviswallet.app/credentials/v1'
            ],
            type: ['VerifiableCredential', 'SevisWalletMembershipCredential'],
            credentialSubject: {
              id: did.did,
              firstName: regData.personalInfo.firstName,
              lastName: regData.personalInfo.lastName,
              email: regData.personalInfo.email,
              walletId: did.keyId,
              registrationDate: regData.securityInfo.registrationDate,
              verificationLevel: 'basic',
            },
            issuer: 'did:key:sevis-wallet-issuer',
            issuanceDate: did.created,
          };
          setWalletCredential(credential);
        }
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
      setIsRegistered(false);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (data: RegistrationData) => {
    try {
      setIsLoading(true);
      
      // Register user and create W3C compliant credential
      const credential = await didService.registerUser(data);
      const did = await didService.getUserDID();
      
      setWalletCredential(credential);
      setUserDID(did);
      setRegistrationData(data);
      setIsRegistered(true);
      
      // Reset registration flow
      setCurrentStep(1);
      setCompletedSteps([]);
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRegistration = async () => {
    try {
      setIsLoading(true);
      
      await didService.deleteUserData();
      
      setIsRegistered(false);
      setUserDID(null);
      setRegistrationData(null);
      setWalletCredential(null);
      setCurrentStep(1);
      setCompletedSteps([]);
      
    } catch (error) {
      console.error('Failed to delete registration:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const markStepCompleted = (step: number) => {
    setCompletedSteps(prev => {
      if (!prev.includes(step)) {
        return [...prev, step].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const value: RegistrationContextType = {
    isRegistered,
    isLoading,
    userDID,
    registrationData,
    walletCredential,
    registerUser,
    checkRegistrationStatus,
    deleteRegistration,
    currentStep,
    setCurrentStep,
    completedSteps,
    markStepCompleted,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};