import { Component, signal, effect, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements OnInit, OnDestroy {
  private storageKey = 'foodie_chat_history';
  private webhookUrl = 'https://qwerty0900.app.n8n.cloud/webhook/633afda6-7f9f-4bdd-b8c8-351e9120ae97/chat';
  private alertService = inject(AlertService);

  messages = signal<any[]>([]);
  userInput = signal('');
  isLoading = signal(false);
  isChatOpen = signal(false);
  hasUnsavedChanges = signal(false);

  constructor() {
    // Load messages from localStorage on init
    effect(() => {
      this.initializeMessages();
    });
  }

  ngOnInit() {
    this.initializeMessages();
    // Add beforeunload listener for custom refresh alert
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  private handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private initializeMessages() {
    const storedMessages = localStorage.getItem(this.storageKey);
    if (storedMessages && storedMessages !== '[]') {
      this.messages.set(JSON.parse(storedMessages));
    } else {
      // Set initial welcome message
      this.messages.set([
        {
          role: 'assistant',
          content: 'Hi! 👋 Welcome to Foodie! I\'m your food assistant. How can I help you today?'
        }
      ]);
      this.saveMessages();
    }
  }

  saveMessages() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.messages()));
    this.hasUnsavedChanges.set(false);
  }

  toggleChat() {
    this.isChatOpen.update(val => !val);
  }

  async sendMessage() {
    const message = this.userInput().trim();
    if (!message) return;

    // Add user message
    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: message }
    ]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.hasUnsavedChanges.set(true);

    try {
      // Send to n8n webhook
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          message: message,
          sessionId: this.getSessionId(),
          chatInput: message
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Try different response field names that n8n might use
        let botMessage = data.output || data.message || data.response || data.text || 'I\'m here to help with anything food or Foodie-related! Is there something on our menu I can help you with?';

        // Check if response contains an image URL
        const imageUrl = data.image || data.imageUrl || data.image_url || null;

        // Add bot response
        this.messages.update(msgs => [
          ...msgs,
          { 
            role: 'assistant', 
            content: botMessage,
            imageUrl: imageUrl,
            type: imageUrl ? 'text-image' : 'text'
          }
        ]);
      } else {
        console.error('Webhook error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        
        this.messages.update(msgs => [
          ...msgs,
          { role: 'assistant', content: 'Sorry, I\'m having trouble connecting to the server. Please check your n8n webhook configuration.' }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.messages.update(msgs => [
        ...msgs,
        { role: 'assistant', content: 'Connection error. Please make sure your n8n webhook is running and accessible.' }
      ]);
    } finally {
      this.isLoading.set(false);
      this.saveMessages();
    }
  }

  clearHistory() {
    this.alertService.confirm(
      'Clear Chat History',
      'Are you sure you want to clear all chat history? This cannot be undone.',
      'Clear',
      'Cancel'
    ).then(confirmed => {
      if (confirmed) {
        this.messages.set([
          {
            role: 'assistant',
            content: 'Hi! 👋 Welcome to Foodie! I\'m your food assistant. How can I help you today?'
          }
        ]);
        this.saveMessages();
        this.alertService.success('Chat history cleared!');
      }
    });
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('foodie_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('foodie_session_id', sessionId);
    }
    return sessionId;
  }
}
