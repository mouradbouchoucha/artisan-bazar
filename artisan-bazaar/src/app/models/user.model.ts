export interface User {
  id: number;
  email: string;
  name: string;
  role: 'super_admin' | 'seller' | 'customer';
  password?: string;
  avatar?: string;
  createdAt: Date;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  profile_image?: string;
  email_verified?: boolean;
}

export interface Seller extends User {
  storeName: string;
  totalProducts: number;
  totalSales: number;
  balance: number;
  storeStatus: 'active' | 'inactive' | 'suspended';
}

export interface Customer extends User {
  phone?: string;
  address?: string;
  totalOrders: number;
  wishlist: number[];
}

export interface SuperAdmin extends User {
  permissions: string[];
}