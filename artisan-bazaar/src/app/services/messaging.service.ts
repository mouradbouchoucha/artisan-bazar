import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Message, Conversation } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private conversations: Conversation[] = [
    {
      id: 1,
      productId: 101,
      productName: 'Vase en céramique artisanal',
      productImage: 'assets/products/vase-ceramique.jpg',
      buyerId: 201,
      buyerName: 'Marie Dupont',
      sellerId: 301,
      sellerName: 'Atelier Terre & Feu',
      lastMessage: 'Bonjour, est-ce que ce vase est disponible en bleu ?',
      lastMessageTimestamp: new Date('2023-11-15T14:30:00'),
      unreadCount: 1,
      status: 'active'
    },
    {
      id: 2,
      productId: 102,
      productName: 'Bracelet en perles tissées',
      productImage: 'assets/products/bracelet-perles.jpg',
      buyerId: 202,
      buyerName: 'Thomas Martin',
      sellerId: 302,
      sellerName: 'Bijoux Créatifs',
      lastMessage: 'Merci pour votre commande ! Votre colis a été expédié.',
      lastMessageTimestamp: new Date('2023-11-10T09:15:00'),
      unreadCount: 0,
      status: 'active'
    }
  ];

  private messages: Message[] = [
    {
      id: 1,
      conversationId: 1,
      senderId: 201,
      senderName: 'Marie Dupont',
      senderType: 'buyer',
      content: 'Bonjour, est-ce que ce vase est disponible en bleu ?',
      timestamp: new Date('2023-11-15T14:30:00'),
      read: false
    },
    {
      id: 2,
      conversationId: 2,
      senderId: 302,
      senderName: 'Bijoux Créatifs',
      senderType: 'seller',
      content: 'Merci pour votre commande ! Votre colis a été expédié.',
      timestamp: new Date('2023-11-10T09:15:00'),
      read: true
    },
    {
      id: 3,
      conversationId: 2,
      senderId: 202,
      senderName: 'Thomas Martin',
      senderType: 'buyer',
      content: 'Super, merci ! Quand est-ce que je peux espérer le recevoir ?',
      timestamp: new Date('2023-11-10T10:22:00'),
      read: true
    },
    {
      id: 4,
      conversationId: 2,
      senderId: 302,
      senderName: 'Bijoux Créatifs',
      senderType: 'seller',
      content: 'Normalement sous 3 jours ouvrés. Je vous envoie le numéro de suivi dès que je l\'ai.',
      timestamp: new Date('2023-11-10T11:05:00'),
      read: true
    }
  ];

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const totalUnread = this.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    this.unreadCountSubject.next(totalUnread);
  }

  getConversations(userId: string | number, userType: 'buyer' | 'seller'): Observable<Conversation[]> {
    // Filtrer les conversations en fonction du type d'utilisateur
    let filteredConversations: Conversation[];
    
    if (userType === 'buyer') {
      filteredConversations = this.conversations.filter(conv => conv.buyerId === userId);
    } else {
      filteredConversations = this.conversations.filter(conv => conv.sellerId === userId);
    }
    
    return of(filteredConversations);
  }

  getMessages(conversationId: string | number): Observable<Message[]> {
    return of(this.messages.filter(msg => msg.conversationId === conversationId));
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Observable<Message> {
    const newMessage: Message = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date(),
      read: false
    };
    
    this.messages.push(newMessage);
    
    // Mettre à jour la dernière conversation
    const conversationIndex = this.conversations.findIndex(conv => conv.id === message.conversationId);
    if (conversationIndex !== -1) {
      this.conversations[conversationIndex].lastMessage = message.content;
      this.conversations[conversationIndex].lastMessageTimestamp = new Date();
      
      // Si le message est envoyé par l'acheteur, incrémenter le compteur non lu pour le vendeur
      if (message.senderType === 'buyer') {
        this.conversations[conversationIndex].unreadCount += 1;
      }
      
      this.updateUnreadCount();
    }
    
    return of(newMessage);
  }

  markConversationAsRead(conversationId: string | number, userId: string | number): Observable<boolean> {
    const conversationIndex = this.conversations.findIndex(conv => conv.id === conversationId);
    if (conversationIndex !== -1) {
      this.conversations[conversationIndex].unreadCount = 0;
      
      // Marquer tous les messages comme lus
      this.messages
        .filter(msg => msg.conversationId === conversationId && !msg.read)
        .forEach(msg => {
          msg.read = true;
        });
      
      this.updateUnreadCount();
      return of(true);
    }
    
    return of(false);
  }

  createConversation(conversation: Omit<Conversation, 'id' | 'lastMessageTimestamp' | 'unreadCount' | 'status'>, 
                    initialMessage: string): Observable<Conversation> {
    const newConversation: Conversation = {
      ...conversation,
      id: this.generateConversationId(),
      lastMessage: initialMessage,
      lastMessageTimestamp: new Date(),
      unreadCount: 1,
      status: 'active'
    };
    
    this.conversations.push(newConversation);
    
    // Créer le premier message
    const message: Message = {
      id: this.generateMessageId(),
      conversationId: newConversation.id,
      senderId: conversation.buyerId,
      senderName: conversation.buyerName,
      senderType: 'buyer',
      content: initialMessage,
      timestamp: new Date(),
      read: false
    };
    
    this.messages.push(message);
    this.updateUnreadCount();
    
    return of(newConversation);
  }

  private generateMessageId(): number {
    return Math.max(...this.messages.map(m => Number(m.id)), 0) + 1;
  }

  private generateConversationId(): number {
    return Math.max(...this.conversations.map(c => Number(c.id)), 0) + 1;
  }
}