import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Conversation } from '../../../models/message';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styles: [`
    .conversation-list {
      border-right: 1px solid #e2e8f0;
      height: 100%;
      overflow-y: auto;
    }
    .conversation-item {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .conversation-item:hover {
      background-color: #f8fafc;
    }
    .conversation-item.active {
      background-color: #e6f2ff;
    }
    .conversation-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .conversation-name {
      font-weight: 600;
    }
    .conversation-time {
      font-size: 0.75rem;
      color: #64748b;
    }
    .conversation-product {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .product-image {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: cover;
      border-radius: 0.25rem;
      margin-right: 0.5rem;
    }
    .product-name {
      font-size: 0.875rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .conversation-preview {
      font-size: 0.875rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .unread-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      background-color: #3b82f6;
      color: white;
      font-size: 0.75rem;
      border-radius: 9999px;
      margin-left: 0.5rem;
    }
    .search-box {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }
    .search-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
    }
    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #64748b;
    }
  `]
})
export class ConversationListComponent implements OnInit {
  @Input() conversations: Conversation[] = [];
  @Input() selectedConversationId: string | number | null = null;
  filteredConversations: Conversation[] = [];
  searchQuery = '';
  
  @Output() conversationSelected = new EventEmitter<string | number>();

  // Dans une application réelle, ces valeurs viendraient de l'authentification
  currentUserId = 201; // ID de l'utilisateur connecté
  currentUserType: 'buyer' | 'seller' = 'buyer'; // Type d'utilisateur connecté

  constructor(private messagingService: MessagingService) { }

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    this.messagingService.getConversations(this.currentUserId, this.currentUserType)
      .subscribe(conversations => {
        this.conversations = conversations;
        this.filteredConversations = [...conversations];
        
        // Sélectionner la première conversation par défaut s'il y en a
        if (this.conversations.length > 0 && !this.selectedConversationId) {
          this.selectConversation(this.conversations[0].id);
        }
      });
  }

  selectConversation(conversationId: string | number): void {
    this.selectedConversationId = conversationId;
    this.conversationSelected.emit(conversationId);
    
    // Marquer la conversation comme lue
    this.messagingService.markConversationAsRead(conversationId, this.currentUserId)
      .subscribe(() => {
        // Mettre à jour le compteur non lu dans l'interface
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      });
  }

  searchConversations(): void {
    if (!this.searchQuery.trim()) {
      this.filteredConversations = [...this.conversations];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredConversations = this.conversations.filter(conv => 
      conv.buyerName.toLowerCase().includes(query) || 
      conv.sellerName.toLowerCase().includes(query) ||
      (conv.productName && conv.productName.toLowerCase().includes(query)) ||
      (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query))
    );
  }

  formatTimestamp(timestamp: Date): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Aujourd'hui, afficher l'heure
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Hier
      return 'Hier';
    } else if (diffDays < 7) {
      // Cette semaine, afficher le jour
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return days[date.getDay()];
    } else {
      // Plus ancien, afficher la date
      return date.toLocaleDateString();
    }
  }

  getOtherPartyName(conversation: Conversation): string {
    return this.currentUserType === 'buyer' ? conversation.sellerName : conversation.buyerName;
  }
}