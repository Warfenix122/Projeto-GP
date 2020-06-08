import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailSenderService {

  constructor(private http: HttpClient) { }

  sendEmail(to, subject, content) {
    return this.http.post('/api/sendEmail', { 'to': to, 'subject': subject, 'content': content });
  }

  sendConfirmationEmail(to: string, name: string) {
    return this.http.post('/api/sendConfirmationEmail', { 'to': to, 'name': name });
  }

  sendRecoverPasswordEmail(to, password) {
    return this.http.post('/api/sendRecoverPasswordEmail', { 'to': to, 'password': password });
  }
  sendConfirmProjectEmail(to) {
    return this.http.post('/api/sendConfirmProjectEmail', { 'to': to });
  }
  sendChangesInProjectEmail(to) {
    return this.http.post('/api/sendChangesInProjectEmail', { 'to': to });
  }
  sendProjectGuidelinesEmail(to) {
    return this.http.post('/api/sendProjectGuidelinesEmail', { 'to': to });
  }
  sendQRCodeEmail(to, attachment) {
    return this.http.post('/api/sendQRCodeEmail', { 'to': to, 'attachment': attachment });
  }
}
