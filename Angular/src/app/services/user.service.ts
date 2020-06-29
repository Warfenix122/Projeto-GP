import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../models/utilizadores';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() profileLoaded: EventEmitter<boolean> = new EventEmitter();
  @Output() photoUploaded: EventEmitter<string> = new EventEmitter();

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

  getCurrentUserId(): Observable<String> {
    let token = { token: localStorage.getItem('token').split(' ')[1] };
    return this.http.post<String>('/api/currentUser', token);
  }

  getUsers(ids) {
    console.log(ids);
    if (ids == undefined)
      ids = "";
    return this.http.get<User[]>('/api/user', {
      params: new HttpParams({ fromObject: { ids: ids } })
    });
  }

  getUser(id) {
    return this.http.get<User>('/api/user/' + id);
  }

  getVoluntariosExternos(): Observable<User[]> {
    return this.http.get<User[]>('/api/externos');
  }

  updateUserFavProject(isAdd, userId, projectId) {
    let purpose = isAdd ? 'pushFavProject' : 'removeFavProject';
    return this.http.put<User>('/api/user/' + userId, { projectId: projectId }, { params: new HttpParams().set('purpose', purpose) });
  }

}
