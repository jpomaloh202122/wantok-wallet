import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageItem {
  id: string;
  type: 'vc' | 'card' | 'id';
  data: any;
  createdAt: string;
  updatedAt: string;
}

class SecureStorageService {
  private readonly STORAGE_KEY = 'wallet_items';

  async saveItem(item: StorageItem): Promise<void> {
    try {
      const existingItems = await this.getAllItems();
      const updatedItems = existingItems.filter(existing => existing.id !== item.id);
      updatedItems.push({
        ...item,
        updatedAt: new Date().toISOString(),
      });
      
      await SecureStore.setItemAsync(this.STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving item to secure storage:', error);
      throw new Error('Failed to save item');
    }
  }

  async getAllItems(): Promise<StorageItem[]> {
    try {
      const itemsJson = await SecureStore.getItemAsync(this.STORAGE_KEY);
      return itemsJson ? JSON.parse(itemsJson) : [];
    } catch (error) {
      console.error('Error retrieving items from secure storage:', error);
      return [];
    }
  }

  async getItemsByType(type: StorageItem['type']): Promise<StorageItem[]> {
    const allItems = await this.getAllItems();
    return allItems.filter(item => item.type === type);
  }

  async getItemById(id: string): Promise<StorageItem | null> {
    const allItems = await this.getAllItems();
    return allItems.find(item => item.id === id) || null;
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const existingItems = await this.getAllItems();
      const updatedItems = existingItems.filter(item => item.id !== id);
      await SecureStore.setItemAsync(this.STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting item from secure storage:', error);
      throw new Error('Failed to delete item');
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw new Error('Failed to clear storage');
    }
  }
}

export const secureStorage = new SecureStorageService();