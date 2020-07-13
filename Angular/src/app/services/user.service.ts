import { Injectable, Output, EventEmitter } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../models/utilizadores';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() profileLoaded: EventEmitter<boolean> = new EventEmitter();
  @Output() photoUploaded: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient, private _authService: AuthService) { }

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
  getGestores() {
    return this.http.get<User[]>("api/gestores");
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
    if(this._authService.isLoggedIn()){
      let token = { token: localStorage.getItem('token').split(' ')[1] };
    return this.http.post<String>('/api/currentUser', token);
    }
    return null
  }

  getUsers(ids) {
    if (ids == undefined)
      ids = "";
    return this.http.get<User[]>('/api/user', {
      params: new HttpParams({ fromObject: { ids: ids } })
    });
  }

  getCurrentUserRole(token){
    return this.http.get('/api/currentUserRole/'+token);
  }

  getUser(id) {
    return this.http.get<User>('/api/user/' + id);
  }

  getVoluntariosExternos(): Observable<User[]> {
    return this.http.get<User[]>('/api/externos');
  }

  removeProfilePhoto(userId){
    return this.http.put<User>('/api/user/'+userId, {fotoPerfilId: null});
  }

  updateUserFavProject(isAdd, userId, projectId) {
    let purpose = isAdd ? 'pushFavProject' : 'removeFavProject';
    return this.http.put<User>('/api/user/' + userId, { projectId: projectId }, { params: new HttpParams().set('purpose', purpose) });
  }

  getUsersArray(users){
    return this.http.post<User[]>('/api/getUsers',users);
  };

  getUserNome(utilizadorId){
    return this.http.get('/api/getUserNome/'+utilizadorId);
  }
}
