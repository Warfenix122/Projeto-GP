import { Component, OnInit,Input } from '@angular/core';
import { Comment } from '../../../models/comment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  nome: String;

  constructor(private _userService:UserService) { }

  ngOnInit(): void {
    this._userService.getUserNome(this.comment.utilizadorId).subscribe(res=> {
      this.nome = res["nome"];
    });
  }

}
