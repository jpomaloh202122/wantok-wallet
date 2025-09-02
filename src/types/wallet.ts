export interface VerifiableCredential {
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, any>;
  proof?: any;
  expirationDate?: string;
  title: string;
  description?: string;
}

export interface Card {
  id: string;
  type: 'credit' | 'debit' | 'membership' | 'loyalty' | 'gift';
  name: string;
  number: string;
  expiryDate?: string;
  issuer: string;
  color?: string;
  logo?: string;
}

export interface IDDocument {
  id: string;
  type: 'passport' | 'license' | 'national_id' | 'other';
  name: string;
  documentNumber: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  personalInfo: {
    fullName: string;
    dateOfBirth?: string;
    address?: string;
    photo?: string;
  };
}

export interface WalletItem {
  id: string;
  type: 'vc' | 'card' | 'id';
  data: VerifiableCredential | Card | IDDocument;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  tags?: string[];
}

export interface WalletContextType {
  items: WalletItem[];
  loading: boolean;
  addItem: (item: Omit<WalletItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<WalletItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemsByType: (type: WalletItem['type']) => WalletItem[];
  refreshItems: () => Promise<void>;
}