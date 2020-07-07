import { Injectable, Output, EventEmitter } from '@angular/core';
import * as moment from "moment";
import { Router, NavigationEnd } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs'



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  mySubscription: any;
  @Output() eventIsLoggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() eventRole: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router, private http: HttpClient) { }

  setLocalStorage(responseObj) {
    const expires = moment().add(responseObj.expiresIn);
    const userRole = responseObj.user.tipoMembro;
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
    this.eventIsLoggedIn.emit(true);
    this.eventRole.emit(userRole);
  }

  isLoggedIn() {
    if(localStorage.getItem("token"))
      return true
    else 
      return false
    // return moment().isBefore(this.getExpiration());
  }

  isLoggedout() {
    return !this.isLoggedIn();
  }

  getRole(): Observable<String> {
    let token = { token: localStorage.getItem('token').split(' ')[1] };
    return this.http.post<String>("/api/currentUserRole",token);
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    localStorage.removeItem('role');
    this.eventIsLoggedIn.emit(false);
    this.router.navigate(['/']);
    this.eventIsLoggedIn.emit(false);
    this.eventRole.emit('');

  }

}
