export enum PaymentMethod {
  CREDIT = 'Crédito',
  DEBIT = 'Débito',
  CASH = 'Dinheiro',
  PIX = 'Pix'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  orderNumber: string; // New field for the customer order number (Senha)
  timestamp: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'completed' | 'cancelled';
}

export interface DailySummary {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  methodBreakdown: Record<string, number>;
}