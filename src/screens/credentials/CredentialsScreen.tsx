import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { VerifiableCredential } from '../../types/wallet';

const CredentialsScreen: React.FC = () => {
  const { items, deleteItem } = useWallet();
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);

  const credentials = items.filter(item => item.type === 'vc');

  const handleDeleteCredential = (id: string, title: string) => {
    Alert.alert(
      'Delete Credential',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteItem(id),
        },
      ]
    );
  };

  const renderCredentialCard = (credential: any) => {
    const vcData = credential.data as VerifiableCredential;
    const isExpired = vcData.expirationDate && new Date(vcData.expirationDate) < new Date();
    
    return (
      <TouchableOpacity
        key={credential.id}
        style={[styles.credentialCard, isExpired && styles.expiredCard]}
        onPress={() => setSelectedCredential(credential.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.credentialIcon}>
            <Ionicons name="document-text" size={20} color="#F4C430" />
          </View>
          <View style={styles.credentialInfo}>
            <Text style={styles.credentialTitle}>{vcData.title}</Text>
            <Text style={styles.credentialIssuer}>Issued by {vcData.issuer}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteCredential(credential.id, vcData.title)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={styles.credentialDetails}>
          <Text style={styles.credentialType}>
            Type: {vcData.type.filter(t => t !== 'VerifiableCredential').join(', ')}
          </Text>
          <Text style={styles.credentialDate}>
            Issued: {new Date(vcData.issuanceDate).toLocaleDateString()}
          </Text>
          {vcData.expirationDate && (
            <Text style={[styles.credentialDate, isExpired && styles.expiredText]}>
              {isExpired ? 'Expired' : 'Expires'}: {new Date(vcData.expirationDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        {vcData.description && (
          <Text style={styles.credentialDescription}>{vcData.description}</Text>
        )}

        {isExpired && (
          <View style={styles.expiredBadge}>
            <Ionicons name="warning" size={14} color="#FF3B30" />
            <Text style={styles.expiredBadgeText}>Expired</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verifiable Credentials</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#F4C430" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {credentials.length > 0 ? (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                You have {credentials.length} credential{credentials.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {credentials.map(renderCredentialCard)}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No Credentials</Text>
            <Text style={styles.emptyStateText}>
              Add your first verifiable credential to get started
            </Text>
            <TouchableOpacity style={styles.addFirstButton}>
              <Text style={styles.addFirstButtonText}>Add Credential</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summary: {
    paddingVertical: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  credentialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  credentialIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  credentialInfo: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  credentialIssuer: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  credentialDetails: {
    marginBottom: 8,
  },
  credentialType: {
    fontSize: 14,
    color: '#F4C430',
    marginBottom: 4,
  },
  credentialDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  expiredText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  credentialDescription: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginTop: 8,
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  expiredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addFirstButton: {
    backgroundColor: '#F4C430',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CredentialsScreen;