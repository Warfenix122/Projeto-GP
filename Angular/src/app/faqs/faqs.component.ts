import { Component, OnInit } from '@angular/core';
import { Faq } from 'models/faq';
import { FaqService } from '../services/faq.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  faqs: Array<Faq> = [];

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe(faqs => {
      this.faqs = faqs;
    })
  }

}
