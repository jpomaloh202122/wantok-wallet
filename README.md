# Sevis Wallet - Digital Identity Wallet

A premium cross-platform mobile wallet application built with React Native and Expo for storing Verifiable Credentials (VCs), payment cards, and ID documents securely on your device. Sevis Wallet features an elegant golden design inspired by freedom and security.

## Features

### 🔐 Security First
- **Biometric Authentication**: Face ID, Touch ID, and fingerprint authentication
- **Local Encryption**: All data encrypted and stored locally on device
- **No Data Transmission**: Your sensitive information never leaves your device
- **Secure Storage**: Uses Expo SecureStore and Keychain for maximum security

### 📱 Wallet Management
- **Verifiable Credentials**: Store and manage digital certificates and credentials
- **Payment Cards**: Securely store credit cards, debit cards, membership cards
- **ID Documents**: Digital storage of passports, driver's licenses, national IDs
- **Organized Categories**: Intuitive categorization and search functionality

### 🎨 User Experience
- **Responsive Design**: Optimized for phones and tablets
- **Cross-Platform**: Native iOS and Android experience
- **Intuitive Interface**: Clean, modern design following platform conventions
- **Accessibility**: Built with accessibility in mind

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab-based navigation
- **Storage**: Expo SecureStore for encrypted local storage
- **Authentication**: Expo Local Authentication (biometrics)
- **Icons**: Expo Vector Icons (Ionicons)
- **Language**: TypeScript for type safety

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator

### Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on platforms**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Project Structure

```
WalletApp/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Wallet home screen
│   │   ├── credentials.tsx      # Verifiable credentials
│   │   ├── cards.tsx           # Payment cards
│   │   ├── ids.tsx             # ID documents
│   │   └── settings.tsx        # App settings
│   └── _layout.tsx             # Root layout
├── src/                        # Source code
│   ├── contexts/              # React contexts
│   │   └── WalletContext.tsx  # Global wallet state
│   ├── screens/               # Screen components
│   ├── services/             # Business logic
│   │   ├── secureStorage.ts # Encrypted storage service
│   │   └── authService.ts   # Authentication service
│   ├── types/               # TypeScript type definitions
│   └── utils/              # Utility functions
│       ├── responsive.ts   # Responsive design helpers
│       └── theme.ts       # Design system & theme
```

## Security Architecture

### Data Storage
- **Encryption**: All sensitive data is encrypted before storage
- **Local Storage**: Data never leaves the device
- **Secure Store**: Uses platform's secure storage (iOS Keychain, Android Keystore)
- **Biometric Protection**: Optional biometric authentication for app access

### Authentication Flow
1. User enables biometric authentication in settings
2. App checks for biometric availability (Face ID, Touch ID, Fingerprint)
3. User must authenticate to access wallet data
4. Authentication expires after 5 minutes of inactivity

## Platform-Specific Features

### iOS
- Face ID integration
- iOS design language
- Haptic feedback
- iOS-specific permissions and privacy settings

### Android
- Fingerprint authentication
- Material Design principles
- Android-specific permissions
- Edge-to-edge display support

## Privacy & Security

- **No Data Collection**: The app doesn't collect any personal information
- **Local Processing**: All operations happen locally on the device
- **No Analytics**: No tracking or analytics SDKs included
- **Encrypted Storage**: All sensitive data is encrypted using platform security
