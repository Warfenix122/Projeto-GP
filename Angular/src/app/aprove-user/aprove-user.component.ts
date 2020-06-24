import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import { User } from '../../../models/utilizadores'
import { Router } from '@angular/router'
import { AlertService } from '../services/alert.service';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-aprove-user',
  templateUrl: './aprove-user.component.html',
  styleUrls: ['./aprove-user.component.css']
})
export class AproveUserComponent implements OnInit {
  utilizadores: Array<User>;
  emptyReturnMessage: string;
  constructor(private _userService: UserService, private router: Router, private _alertService: AlertService, private _authService: AuthService) { }

  ngOnInit(): void {
    this._authService.getRole().subscribe(res =>{
      if(res["Role"] !== "Gestor")
        this.router.navigate(['unauthorized']);
    });

    this._userService.getDisaprovedUsers().subscribe(users => {
      this.updateUsers(users);
    });
  }

  updateUsers(users) {
    this.utilizadores = users;
    if (this.utilizadores.length === 0) {
      this.emptyReturnMessage = "Não existem utilizadores para avaliar";
    }
  }

  removeUser(user) {
    let removeI = 0;
    this.utilizadores.forEach((elem, index) => {
      if (elem.email == user.email) {
        removeI = index;
        return;
      }
    });
    this.utilizadores.splice(removeI, 1);
  }

  avaliarUtilizador(utilizador, avaliacao) {
    this._userService.aproveUser(utilizador, avaliacao).subscribe(user => {
      this.removeUser(user);
      this._alertService.success("Utilizador Aprovado!");

    });
  }

}
