import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { Card } from '../../types/wallet';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const CardsScreen: React.FC = () => {
  const { items, deleteItem } = useWallet();
  const cards = items.filter(item => item.type === 'card');

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return 'card';
      case 'debit':
        return 'card-outline';
      case 'membership':
        return 'person-circle';
      case 'loyalty':
        return 'star';
      case 'gift':
        return 'gift';
      default:
        return 'card';
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'credit':
        return '#F4C430';
      case 'debit':
        return '#34C759';
      case 'membership':
        return '#FF9500';
      case 'loyalty':
        return '#AF52DE';
      case 'gift':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const handleDeleteCard = (id: string, name: string) => {
    Alert.alert(
      'Delete Card',
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

  const renderCard = (cardItem: any) => {
    const cardData = cardItem.data as Card;
    const cardColor = getCardColor(cardData.type);
    const isExpired = cardData.expiryDate && new Date(cardData.expiryDate) < new Date();

    return (
      <View key={cardItem.id} style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardName}>{cardData.name}</Text>
              <Text style={styles.cardType}>{cardData.type.toUpperCase()}</Text>
            </View>
            <Ionicons name={getCardTypeIcon(cardData.type)} size={32} color="rgba(255,255,255,0.8)" />
          </View>

          <View style={styles.cardNumber}>
            <Text style={styles.cardNumberText}>
              •••• •••• •••• {cardData.number.slice(-4)}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardIssuer}>{cardData.issuer}</Text>
              {cardData.expiryDate && (
                <Text style={[styles.cardExpiry, isExpired && styles.expiredText]}>
                  {isExpired ? 'EXPIRED' : 'VALID THRU'} {cardData.expiryDate}
                </Text>
              )}
            </View>
            {isExpired && (
              <View style={styles.expiredBadge}>
                <Ionicons name="warning" size={16} color="#FF3B30" />
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye" size={20} color="#F4C430" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create" size={20} color="#F4C430" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteCard(cardItem.id, cardData.name)}
          >
            <Ionicons name="trash" size={20} color="#FF3B30" />
            <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const cardTypes = ['credit', 'debit', 'membership', 'loyalty', 'gift'];
  const categorizedCards = cardTypes.reduce((acc, type) => {
    acc[type] = cards.filter(card => card.data.type === type);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cards</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#F4C430" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cards.length > 0 ? (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                You have {cards.length} card{cards.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {Object.entries(categorizedCards).map(([type, typeCards]) => {
              if (typeCards.length === 0) return null;

              return (
                <View key={type} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Cards ({typeCards.length})
                  </Text>
                  {typeCards.map(renderCard)}
                </View>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No Cards</Text>
            <Text style={styles.emptyStateText}>
              Add your first card to get started. You can add credit cards, debit cards, membership cards, and more.
            </Text>
            <TouchableOpacity style={styles.addFirstButton}>
              <Text style={styles.addFirstButtonText}>Add Card</Text>
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
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  cardNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardNumberText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardIssuer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cardExpiry: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  expiredText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  expiredBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: -16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 12,
    color: '#F4C430',
    marginTop: 4,
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

export default CardsScreen;