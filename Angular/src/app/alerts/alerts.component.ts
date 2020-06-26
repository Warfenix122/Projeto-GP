import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})

export class AlertsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {

    this.subscription = this.alertService.getAlert()
      .subscribe(message => {
        switch (message && message.type) {
          case 'success':
            message.alertType = 'success';
            break;
          case 'error':
            message.alertType = 'danger';
            break;
        }
        this.message = message;
      });
    this.alertService.getAlert().pipe(
      debounceTime(2500)
    ).subscribe(() => this.message = undefined);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
