export interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  unit: string;
  description?: string;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  tin?: string; // Tax Identification Number for e-Invoice
  brn?: string; // Business Registration Number
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
}
