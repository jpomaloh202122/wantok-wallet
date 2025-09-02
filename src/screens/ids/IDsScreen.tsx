import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { IDDocument } from '../../types/wallet';

const IDsScreen: React.FC = () => {
  const { items, deleteItem } = useWallet();
  const ids = items.filter(item => item.type === 'id');

  const getIDTypeIcon = (type: string) => {
    switch (type) {
      case 'passport':
        return 'airplane';
      case 'license':
        return 'car';
      case 'national_id':
        return 'id-card';
      default:
        return 'document';
    }
  };

  const getIDTypeColor = (type: string) => {
    switch (type) {
      case 'passport':
        return '#007AFF';
      case 'license':
        return '#34C759';
      case 'national_id':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const handleDeleteID = (id: string, name: string) => {
    Alert.alert(
      'Delete ID Document',
      `Are you sure you want to delete "${name}"?`,
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

  const renderIDCard = (idItem: any) => {
    const idData = idItem.data as IDDocument;
    const typeColor = getIDTypeColor(idData.type);
    const isExpired = idData.expiryDate && new Date(idData.expiryDate) < new Date();

    return (
      <TouchableOpacity
        key={idItem.id}
        style={[styles.idCard, isExpired && styles.expiredCard]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.typeIcon, { backgroundColor: `${typeColor}20` }]}>
            <Ionicons name={getIDTypeIcon(idData.type)} size={24} color={typeColor} />
          </View>
          <View style={styles.idInfo}>
            <Text style={styles.idName}>{idData.name}</Text>
            <Text style={styles.idType}>
              {idData.type.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.idNumber}>#{idData.documentNumber}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteID(idItem.id, idData.name)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={styles.personalInfo}>
          <Text style={styles.fullName}>{idData.personalInfo.fullName}</Text>
          {idData.personalInfo.dateOfBirth && (
            <Text style={styles.personalDetail}>
              Born: {new Date(idData.personalInfo.dateOfBirth).toLocaleDateString()}
            </Text>
          )}
          {idData.personalInfo.address && (
            <Text style={styles.personalDetail} numberOfLines={2}>
              Address: {idData.personalInfo.address}
            </Text>
          )}
        </View>

        <View style={styles.documentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Issued by:</Text>
            <Text style={styles.detailValue}>{idData.issuedBy}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Issued:</Text>
            <Text style={styles.detailValue}>
              {new Date(idData.issuedDate).toLocaleDateString()}
            </Text>
          </View>
          {idData.expiryDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {isExpired ? 'Expired:' : 'Expires:'}
              </Text>
              <Text style={[styles.detailValue, isExpired && styles.expiredText]}>
                {new Date(idData.expiryDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {isExpired && (
          <View style={styles.expiredBanner}>
            <Ionicons name="warning" size={16} color="#FFFFFF" />
            <Text style={styles.expiredBannerText}>Document Expired</Text>
          </View>
        )}

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye" size={18} color="#F4C430" />
            <Text style={styles.actionText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="qr-code" size={18} color="#F4C430" />
            <Text style={styles.actionText}>QR Code</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const idTypes = ['passport', 'license', 'national_id', 'other'];
  const categorizedIds = idTypes.reduce((acc, type) => {
    acc[type] = ids.filter(id => id.data.type === type);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ID Documents</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#F4C430" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {ids.length > 0 ? (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                You have {ids.length} ID document{ids.length !== 1 ? 's' : ''}
              </Text>
              <View style={styles.securityNotice}>
                <Ionicons name="shield-checkmark" size={16} color="#34C759" />
                <Text style={styles.securityText}>Stored securely on device</Text>
              </View>
            </View>

            {Object.entries(categorizedIds).map(([type, typeIds]) => {
              if (typeIds.length === 0) return null;

              const typeName = type === 'national_id' ? 'National ID' : 
                             type.charAt(0).toUpperCase() + type.slice(1);

              return (
                <View key={type} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>
                    {typeName}s ({typeIds.length})
                  </Text>
                  {typeIds.map(renderIDCard)}
                </View>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="id-card-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No ID Documents</Text>
            <Text style={styles.emptyStateText}>
              Add your ID documents like passport, driver's license, or national ID for secure storage.
            </Text>
            <TouchableOpacity style={styles.addFirstButton}>
              <Text style={styles.addFirstButtonText}>Add ID Document</Text>
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
    marginBottom: 8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 14,
    color: '#34C759',
    marginLeft: 4,
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  expiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  idInfo: {
    flex: 1,
  },
  idName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  idType: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  idNumber: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: 4,
  },
  personalInfo: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  personalDetail: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 4,
  },
  documentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  expiredText: {
    color: '#FF3B30',
  },
  expiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  expiredBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#F4C430',
    marginLeft: 6,
    fontWeight: '500',
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

export default IDsScreen;