import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../models/utilizadores';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  profile(token) {

    return this.http.post('/api/profile', { authorization: token }, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  register(formData) {
    return this.http.post('/api/register', formData, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(formData) {
    return this.http.post('/api/login', formData, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  alterPassword(formData) {
    return this.http.post('/api/alter_password', formData, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getDisaprovedUsers(): Observable<User[]> {
    return this.http.get<User[]>("/api/userAprove")
  }

  aproveUser(user, avaliacao) {
    user.aprovado = avaliacao;
    return this.http.post<User>("/api/avaliarUser", user);
  }

  editUser(formData) {
    return this.http.post('/api/edit_user', formData, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getCurrentUserId(token){
    return this.http.post('/api/currentUser',token);
  }

  getVoluntariosExternos():Observable<User[]>{
    return this.http.get<User[]>('/api/externos');
  }

}
