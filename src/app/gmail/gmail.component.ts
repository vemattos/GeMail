import { Component, OnInit } from '@angular/core';
import { GmailService } from '../gmail.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss']
})
export class GmailComponent implements OnInit {
  user: SocialUser | null = null;
  emails: any[] = [];
  newEmail = {
    to: '',
    subject: '',
    message: ''
  };

  constructor(private gmailService: GmailService, private authService: SocialAuthService) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (this.user) {
        console.log('Access Token:', this.user.authToken);
      }
    });
  }

  loadEmails(): void {
    this.gmailService.getMessages(30).subscribe({
      next: (data) => {
        const messageIds = data.messages.map((message: any) => message.id);
        this.loadMessages(messageIds);
      },
      error: (err) => {
        console.error('Failed to fetch emails', err);
      }
    });
  }

  loadMessages(messageIds: string[]): void {
    messageIds.forEach(id => {
      this.gmailService.getMessage(id).subscribe({
        next: (message) => {
          this.emails.push(message);
        },
        error: (err) => {
          console.error('Failed to fetch message', err);
        }
      });
    });
  }

  sendEmail(): void {
    const email = {
      raw: btoa(
        `To: ${this.newEmail.to}\r\n` +
        `Subject: ${this.newEmail.subject}\r\n\r\n` +
        `${this.newEmail.message}`
      )
    };

    this.gmailService.sendEmail(email).subscribe({
      next: (response) => {
        console.log('Email sent successfully', response);
        this.newEmail = { to: '', subject: '', message: '' };
      },
      error: (err) => {
        console.error('Failed to send email', err);
      }
    });
  }

  getHeader(headers: any[], name: string): string {
    const header = headers.find(h => h.name === name);
    return header ? header.value : 'N/A';
  }
}
