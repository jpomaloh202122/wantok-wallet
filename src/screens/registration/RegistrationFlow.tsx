import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRegistration } from '../../contexts/RegistrationContext';
import WelcomeScreen from './WelcomeScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import SecuritySetupScreen from './SecuritySetupScreen';
import RegistrationCompleteScreen from './RegistrationCompleteScreen';

const RegistrationFlow: React.FC = () => {
  const { registerUser } = useRegistration();
  const [currentStep, setCurrentStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [securityInfo, setSecurityInfo] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentStep(1);
  };

  const handlePersonalInfoNext = (info: any) => {
    setPersonalInfo(info);
    setCurrentStep(2);
  };

  const handleSecurityNext = (info: any) => {
    setSecurityInfo(info);
    setCurrentStep(3);
  };

  const handleRegistrationComplete = async (registrationData: any) => {
    try {
      await registerUser(registrationData);
      // Registration context will automatically update and redirect to main app
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      
      case 1:
        return (
          <PersonalInfoScreen
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
            initialData={personalInfo}
          />
        );
      
      case 2:
        return (
          <SecuritySetupScreen
            onNext={handleSecurityNext}
            onBack={handleBack}
          />
        );
      
      case 3:
        return (
          <RegistrationCompleteScreen
            personalInfo={personalInfo}
            securityInfo={securityInfo}
            onComplete={handleRegistrationComplete}
            onBack={handleBack}
          />
        );
      
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return <View style={styles.container}>{renderCurrentStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RegistrationFlow;