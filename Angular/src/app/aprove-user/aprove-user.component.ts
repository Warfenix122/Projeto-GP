import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'
import { User } from '../../../models/utilizadores'
import { Router, RouterModule } from '@angular/router'
import { from } from 'rxjs';
import { AlertService } from '../services/alert.service';


@Component({
  selector: 'app-aprove-user',
  templateUrl: './aprove-user.component.html',
  styleUrls: ['./aprove-user.component.css']
})
export class AproveUserComponent implements OnInit {
  utilizadores: Array<User>;
  emptyReturnMessage: string;
  constructor(private service: UserService, private router: Router, private _alertService: AlertService) { }

  ngOnInit(): void {
    if (localStorage.getItem('role') !== "Gestor") {
      this.router.navigate(['unauthorized']);
    }
    this.service.getDisaprovedUsers().subscribe(users => {
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
    this.service.aproveUser(utilizador, avaliacao).subscribe(user => {
      this.removeUser(user);
      this._alertService.success("Utilizador Aprovado!");

    });
  }

}
