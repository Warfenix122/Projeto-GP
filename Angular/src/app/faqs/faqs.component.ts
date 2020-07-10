import { Component, OnInit } from '@angular/core';
import { Faq } from 'models/faq';
import { FaqService } from '../services/faq.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { AlertService } from '../services/alert.service';
import { User } from 'models/utilizadores';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  faqs: Array<Faq> = [];
  panelOpenState = false;
  faqId: string;
  user: User;
  currentUserId: string;
  index: number;
  newPergunta: string;
  newResposta: string;


  constructor(private faqService: FaqService, private alertService: AlertService, private _userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe((faqs) => {
      this.faqs = faqs;
    })

    this._userService.getCurrentUserId().subscribe(res => {
      this.currentUserId = res["UserID"];
      this._userService.getUser(this.currentUserId).subscribe((user: User) => {
        this.user = user;
      })
    })



  }

  getFaqId(i){
    this.index = i;
    this.faqId = this.faqs[i]._id;
  }

  deleteFaq() {
    this.faqService.deleteFaq(this.faqId).subscribe((deletedFaq) => {
      this.router.navigate(['/faqs']);
      this.alertService.success("Faq eliminada com sucesso");
    })
  }

  /*editFaq(){
    this.faqService.editFaq()
  }*/

  addFaq(){
    let obj = {
      pergunta: this.newPergunta,
      resposta: this.newResposta
    }
    this.faqService.addFaq(obj).subscribe(() => {
      this.router.navigate(['/faqs']);
      this.alertService.success("Faq criada com sucesso");
    });
  }

}