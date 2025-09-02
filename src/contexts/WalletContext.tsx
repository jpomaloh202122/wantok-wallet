import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureStorage, StorageItem } from '../services/secureStorage';
import { WalletItem, WalletContextType } from '../types/wallet';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshItems = async () => {
    try {
      setLoading(true);
      const storageItems = await secureStorage.getAllItems();
      const walletItems: WalletItem[] = storageItems.map(item => ({
        id: item.id,
        type: item.type,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isFavorite: item.data.isFavorite || false,
        tags: item.data.tags || [],
      }));
      setItems(walletItems);
    } catch (error) {
      console.error('Error refreshing wallet items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<WalletItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem: StorageItem = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: item.type,
        data: item.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await secureStorage.saveItem(newItem);
      await refreshItems();
    } catch (error) {
      console.error('Error adding wallet item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<WalletItem>) => {
    try {
      const existingItem = await secureStorage.getItemById(id);
      if (!existingItem) {
        throw new Error('Item not found');
      }

      const updatedItem: StorageItem = {
        ...existingItem,
        data: { ...existingItem.data, ...updates.data },
        updatedAt: new Date().toISOString(),
      };

      await secureStorage.saveItem(updatedItem);
      await refreshItems();
    } catch (error) {
      console.error('Error updating wallet item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await secureStorage.deleteItem(id);
      await refreshItems();
    } catch (error) {
      console.error('Error deleting wallet item:', error);
      throw error;
    }
  };

  const getItemsByType = (type: WalletItem['type']): WalletItem[] => {
    return items.filter(item => item.type === type);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const value: WalletContextType = {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemsByType,
    refreshItems,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};