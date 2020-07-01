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
  @ViewChild('isGestor') gestor: ElementRef;
  isGestor: boolean = false;
  constructor(private service: AuthService) {
    service.eventIsLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.service.getRole().subscribe((res) => {
          if (res['Role'] === 'Gestor') {
            console.log('res :>> ', res);
            this.displayGestorInNav();
          }
        });
        this.hideGestorNav();
        this.displayLoggedInNav();

      }
      else {
        this.displayLoggedOutNav();
        this.hideGestorNav();

      }
    });

  }

  ngOnInit(): void {


  }

  displayLoggedInNav(): void {
    this.logged.nativeElement.style.display = 'block';
    this.logout.nativeElement.style.display = 'none';
  }

  displayLoggedOutNav(): void {
    this.logout.nativeElement.style.display = 'block';
    this.logged.nativeElement.style.display = 'none';
  }

  displayGestorInNav(): void {
    this.gestor.nativeElement.style.display = 'block';
  }

  hideGestorNav(): void {
    this.gestor.nativeElement.style.display = 'none';
  }



  ngAfterViewInit(): void {
    this.service.eventIsLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.service.getRole().subscribe((res) => {
          if (res['Role'] === 'Gestor') {
            this.displayGestorInNav();
          }
        });
        this.hideGestorNav();
        this.displayLoggedInNav();

      }
      else {
        this.displayLoggedOutNav();
        this.hideGestorNav();

      }
    });

  }

  logOut() {
    this.service.logout();
  }
}
