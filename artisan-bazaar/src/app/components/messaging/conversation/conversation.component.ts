import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, Conversation } from '../../../models/message';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styles: [`
    .conversation-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .conversation-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
    }
    .conversation-title {
      font-weight: 600;
      margin: 0;
    }
    .conversation-status {
      margin-left: auto;
      font-size: 0.875rem;
      color: #64748b;
    }
    .messages-container {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .message {
      max-width: 70%;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      position: relative;
    }
    .message-sent {
      align-self: flex-end;
      background-color: #3b82f6;
      color: white;
      border-bottom-right-radius: 0;
    }
    .message-received {
      align-self: flex-start;
      background-color: #f1f5f9;
      color: #1e293b;
      border-bottom-left-radius: 0;
    }
    .message-time {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      opacity: 0.8;
    }
    .message-form {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
    }
    .message-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      resize: none;
    }
    .send-button {
      margin-left: 0.5rem;
      padding: 0.75rem 1.5rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
    }
    .send-button:hover {
      background-color: #2563eb;
    }
    .send-button:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
    }
    .attachment-button {
      margin-left: 0.5rem;
      padding: 0.75rem;
      background-color: #f1f5f9;
      color: #64748b;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
    }
    .attachment-button:hover {
      background-color: #e2e8f0;
    }
    .date-separator {
      text-align: center;
      margin: 1rem 0;
      position: relative;
    }
    .date-separator::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background-color: #e2e8f0;
      z-index: 1;
    }
    .date-text {
      background-color: white;
      padding: 0 0.5rem;
      position: relative;
      z-index: 2;
      color: #64748b;
      font-size: 0.875rem;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #64748b;
      text-align: center;
      padding: 2rem;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #cbd5e1;
    }
  `]
})
export class ConversationComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() conversationId: string | number | null = null;
  @ViewChild('messagesContainer') messagesContainer: ElementRef;
  
  conversation: Conversation | null = null;
  messages: Message[] = [];
  messageForm: FormGroup;
  isSubmitting = false;
  
  // Dans une application réelle, ces valeurs viendraient de l'authentification
  currentUserId = 201; // ID de l'utilisateur connecté
  currentUserType: 'buyer' | 'seller' = 'buyer'; // Type d'utilisateur connecté
  currentUserName = 'Marie Dupont'; // Nom de l'utilisateur connecté

  constructor(
    private messagingService: MessagingService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId'] && changes['conversationId'].currentValue) {
      this.loadMessages();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  initForm(): void {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  loadMessages(): void {
    if (!this.conversationId) return;
    
    this.messagingService.getMessages(this.conversationId)
      .subscribe(messages => {
        this.messages = messages;
        
        // Trouver la conversation correspondante
        this.messagingService.getConversations(this.currentUserId, this.currentUserType)
          .subscribe(conversations => {
            this.conversation = conversations.find(c => c.id === this.conversationId) || null;
          });
        
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      });
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.conversationId) return;
    
    this.isSubmitting = true;
    
    const messageData = {
      conversationId: this.conversationId,
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      senderType: this.currentUserType,
      content: this.messageForm.value.content
    };
    
    this.messagingService.sendMessage(messageData)
      .subscribe({
        next: (newMessage) => {
          this.messages.push(newMessage);
          this.messageForm.reset();
          this.isSubmitting = false;
          
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi du message', err);
          this.isSubmitting = false;
        }
      });
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatTimestamp(timestamp: Date): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDateSeparator(timestamp: Date): string {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString();
    }
  }

  shouldShowDateSeparator(currentMessage: Message, index: number): boolean {
    if (index === 0) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(this.messages[index - 1].timestamp).toDateString();
    
    return currentDate !== previousDate;
  }

  isCurrentUser(senderId: string | number): boolean {
    return senderId === this.currentUserId;
  }

  getOtherPartyName(): string {
    if (!this.conversation) return '';
    return this.currentUserType === 'buyer' ? this.conversation.sellerName : this.conversation.buyerName;
  }
}