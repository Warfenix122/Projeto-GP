import { Injectable } from '@angular/core';
import {AlertsComponent} from '../alerts/alerts.component';
import { Router, NavigationStart } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    this.router.events.subscribe(()=>{
      if(event instanceof NavigationStart){
        if(this.keepAfterRouteChange){
          this.keepAfterRouteChange=false;
        }else{
          this.clear()
        }
      }
    });
  }

  getAlert():Observable<any>{
    return this.subject.asObservable();
  }

  success(message: string,keepAfterRouteChange = false){
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({type:'success', text: message});
  }

  error(message: string, keepAfterRouteChange = false){
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'error', text: message });
  }

  clear(){
    this.subject.next();
  }

}
