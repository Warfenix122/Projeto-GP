import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements AfterViewInit {
  @ViewChild('logout') logout: ElementRef;
  @ViewChild('logged') logged: ElementRef;
  isGestor: boolean = false;
  constructor(private service: AuthService, private userService: UserService) {
    service.eventIsLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.displayLoggedInNav();
      }
      else {
        this.displayLoggedOutNav();
      }
    });

  }

  ngOnInit(): void {
    this.userService.getCurrentUserId().subscribe(res => {
      this.userService.getUser(res["UserID"]).subscribe(user => {
        if (user.tipoMembro === 'Gestor') { this.isGestor = true; }
      })
    })
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
  }

  logOut() {
    this.service.logout();
  }
}
