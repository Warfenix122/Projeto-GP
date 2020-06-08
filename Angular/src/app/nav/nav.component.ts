import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements AfterViewInit {
  @ViewChild('logout') logout: ElementRef;
  @ViewChild('logged') logged: ElementRef;
  @ViewChild('aprove') aprove: ElementRef;
  roleType: any;
  constructor(private service: AuthService) {
    service.eventIsLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.displayLoggedInNav();
      }
      else {
        this.displayLoggedOutNav();
      }
    });
    service.eventRole.subscribe(event => {
      if (event === 'Gestor') {
        this.displayAprove();
      }
      else {
        this.hideAprove();
      }
    });
  }

  displayAprove() {
    this.aprove.nativeElement.style.display = 'block';
  }
  hideAprove() {
    this.aprove.nativeElement.style.display = 'none';
  }
  displayLoggedInNav(): void {
    this.logged.nativeElement.style.display = 'block';
    this.logout.nativeElement.style.display = 'none';
  }

  displayLoggedOutNav(): void {
    this.logout.nativeElement.style.display = 'block';
    this.logged.nativeElement.style.display = 'none';
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('token')) {
        this.displayLoggedInNav();
    }
    else {
      this.displayLoggedOutNav();
    }
    this.service.eventRole.subscribe(event => {
      if (event === 'Gestor') {
        this.displayAprove();
      }
      else {
        this.hideAprove();
      }
    });
  }

  logOut() {
    this.service.logout();
  }
}
