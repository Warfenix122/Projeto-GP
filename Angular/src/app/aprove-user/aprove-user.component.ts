import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service'
import {User} from '../../../models/utilizadores'
import {Router} from '@angular/router'
  import { from } from 'rxjs';


@Component({
  selector: 'app-aprove-user',
  templateUrl: './aprove-user.component.html',
  styleUrls: ['./aprove-user.component.css']
})
export class AproveUserComponent implements OnInit {
  utilizadores: Array<User>;
  emptyReturnMessage: string;
  constructor(private service: UserService, private router : Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('role') !== "Gestor"){
      this.router.navigate(['unauthorized']);
     }
    this.service.getDisaprovedUsers().subscribe(users=>{
      this.utilizadores = users;
      if(this.utilizadores.length === 0){
        this.emptyReturnMessage = "Não existem utilizadores para avaliar";
      }
    });
  }

  avaliarUtilizador(utilizador,avaliacao){
    this.service.aproveUser(utilizador,avaliacao).subscribe(res=>{
      console.log(res);
    });
  }

}
