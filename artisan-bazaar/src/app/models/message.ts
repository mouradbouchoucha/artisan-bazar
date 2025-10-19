export interface Message {
  id: string | number;
  conversationId: string | number;
  senderId: string | number;
  senderName: string;
  senderType: 'buyer' | 'seller';
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string | number;
  productId?: string | number;
  productName?: string;
  productImage?: string;
  buyerId: string | number;
  buyerName: string;
  sellerId: string | number;
  sellerName: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  unreadCount: number;
  status: 'active' | 'archived' | 'closed';
}