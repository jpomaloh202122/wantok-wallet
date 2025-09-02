import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../contexts/WalletContext';
import { WalletItem } from '../../types/wallet';

const { width } = Dimensions.get('window');

const WalletHomeScreen: React.FC = () => {
  const { items, loading, refreshItems } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshItems();
    setRefreshing(false);
  };

  const getItemIcon = (type: WalletItem['type']) => {
    switch (type) {
      case 'vc':
        return 'document-text';
      case 'card':
        return 'card';
      case 'id':
        return 'id-card';
      default:
        return 'document';
    }
  };

  const getItemTitle = (item: WalletItem) => {
    switch (item.type) {
      case 'vc':
        return item.data.title || 'Verifiable Credential';
      case 'card':
        return item.data.name || 'Card';
      case 'id':
        return item.data.name || 'ID Document';
      default:
        return 'Unknown';
    }
  };

  const getItemSubtitle = (item: WalletItem) => {
    switch (item.type) {
      case 'vc':
        return item.data.issuer || 'Unknown Issuer';
      case 'card':
        return `****${item.data.number?.slice(-4) || '****'}`;
      case 'id':
        return item.data.issuedBy || 'Unknown Authority';
      default:
        return '';
    }
  };

  const renderWalletItem = (item: WalletItem) => (
    <TouchableOpacity key={item.id} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemIcon}>
          <Ionicons name={getItemIcon(item.type)} size={24} color="#F4C430" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{getItemTitle(item)}</Text>
          <Text style={styles.itemSubtitle}>{getItemSubtitle(item)}</Text>
        </View>
        {item.isFavorite && (
          <Ionicons name="heart" size={20} color="#FF3B30" />
        )}
      </View>
      <Text style={styles.itemDate}>
        Updated {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const categorizedItems = {
    vc: items.filter(item => item.type === 'vc'),
    card: items.filter(item => item.type === 'card'),
    id: items.filter(item => item.type === 'id'),
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sevis Wallet</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#F4C430" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categorizedItems.vc.length}</Text>
            <Text style={styles.statLabel}>Credentials</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categorizedItems.card.length}</Text>
            <Text style={styles.statLabel}>Cards</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categorizedItems.id.length}</Text>
            <Text style={styles.statLabel}>IDs</Text>
          </View>
        </View>

        {/* Categories */}
        {Object.entries(categorizedItems).map(([type, categoryItems]) => {
          if (categoryItems.length === 0) return null;

          const categoryTitle =
            type === 'vc'
              ? 'Verifiable Credentials'
              : type === 'card'
              ? 'Cards'
              : 'ID Documents';

          return (
            <View key={type} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{categoryTitle}</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {categoryItems.slice(0, 3).map(renderWalletItem)}
            </View>
          );
        })}

        {items.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>Your wallet is empty</Text>
            <Text style={styles.emptyStateText}>
              Add your first credential, card, or ID document to get started
            </Text>
            <TouchableOpacity style={styles.addFirstButton}>
              <Text style={styles.addFirstButtonText}>Add Item</Text>
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
    fontSize: 28,
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
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4C430',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 16,
    color: '#F4C430',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#8E8E93',
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

export default WalletHomeScreen;