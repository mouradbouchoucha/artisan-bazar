import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { Conversation } from '../../models/message';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styles: [`
    .messaging-container {
      display: flex;
      height: 80vh;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .sidebar {
      width: 30%;
      border-right: 1px solid #e2e8f0;
      overflow-y: auto;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .messaging-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    .messaging-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: #1e293b;
    }
    @media (max-width: 768px) {
      .messaging-container {
        flex-direction: column;
        height: 90vh;
      }
      .sidebar {
        width: 100%;
        height: 40%;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
      }
    }
  `]
})
export class MessagingComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversationId: string | number | null = null;
  
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
        
        // Sélectionner la première conversation non lue ou la première conversation
        const unreadConversation = conversations.find(c => c.unreadCount > 0);
        if (unreadConversation) {
          this.selectedConversationId = unreadConversation.id;
        } else if (conversations.length > 0) {
          this.selectedConversationId = conversations[0].id;
        }
      });
  }

  onConversationSelected(conversationId: string | number): void {
    this.selectedConversationId = conversationId;
    
    // Marquer la conversation comme lue
    this.messagingService.markConversationAsRead(conversationId, this.currentUserId)
      .subscribe(() => {
        // Mettre à jour le compteur de messages non lus dans la liste des conversations
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      });
  }
}