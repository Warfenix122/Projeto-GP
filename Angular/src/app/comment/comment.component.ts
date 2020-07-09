import { Component, OnInit,Input,Output } from '@angular/core';
import { Comment } from '../../../models/comment';
import { UserService } from '../services/user.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() currentUserId: String;
  @Input() isModerator: boolean;
  //@Input() index: number;
  @Output("removeComment") removeComment : EventEmitter<any> = new EventEmitter();
  nome: String;
  canRemove: Boolean =false;

  constructor(private _userService:UserService) { }

  ngOnInit(): void {
    this._userService.getUserNome(this.comment.utilizadorId).subscribe(res=> {
      this.nome = res["nome"];
      if(this.comment.utilizadorId === this.currentUserId)
        this.canRemove =true;
    });
  }

}
