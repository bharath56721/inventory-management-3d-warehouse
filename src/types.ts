export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
  status: 'AVAILABLE' | 'LOW_STOCK';
  createdAt?: string;
  updatedAt?: string;
}

export interface StockHistoryItem {
  id: number;
  productId?: number;
  productName: string;
  changeType: 'ADDED' | 'UPDATED' | 'DELETED';
  oldQuantity: number | null;
  newQuantity: number | null;
  changedBy: string;
  changedAt: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
  token?: string;
}

export type ViewTab = 'aurum' | 'dashboard' | 'products' | 'history';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
