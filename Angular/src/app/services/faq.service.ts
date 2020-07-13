import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Faq } from '../../../models/faq';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http: HttpClient) { }

  getFaqs() {
    return this.http.get<Faq[]>('/api/faq');
  }

  addFaq(obj){
    return this.http.put<Faq>('/api/faq/addFaq', obj);
  }

  editFaq(id, obj){
    return this.http.put<Faq>('/api/faq/edit/'+id, obj);
  }

  deleteFaq(id){
    return this.http.delete<Faq>('/api/faq/delete/'+id);
  }

}
