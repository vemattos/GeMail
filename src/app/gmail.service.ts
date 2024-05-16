import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class GmailService {
  constructor(private http: HttpClient, private authService: SocialAuthService) {}

  private getAccessToken(): Observable<string> {
    return from(this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID));
  }

  getMessages(maxResults: number = 30): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap(accessToken => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
        return this.http.get(`https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`, { headers });
      })
    );
  }

  getMessage(messageId: string): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap(accessToken => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
        return this.http.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, { headers });
      })
    );
  }

  sendEmail(email: any): Observable<any> {
    return this.getAccessToken().pipe(
      switchMap(accessToken => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        });
        return this.http.post('https://www.googleapis.com/gmail/v1/users/me/messages/send', email, { headers });
      })
    );
  }

  // deleteEmail(messageId: string): Observable<any> {
  //   return this.getAccessToken().pipe(
  //     switchMap(accessToken => {
  //       const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  //       return this.http.delete(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, { headers });
  //     })
  //   );
  // }
}
