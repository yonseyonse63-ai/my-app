import { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'sale' | 'withdrawal' | 'reward' | 'refund' | 'expense';
  status: 'completed' | 'pending';
  detail?: string;
  user?: string;
  icon?: LucideIcon;
  color?: string;
  bgColor?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  detail: string;
  type: 'paypal' | 'bank';
  icon: string;
  selected?: boolean;
}

export interface RevenueData {
  month: string;
  amount: number;
}
