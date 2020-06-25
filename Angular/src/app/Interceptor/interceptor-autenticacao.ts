import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorAutenticacao implements HttpInterceptor{
  intercept(req: HttpRequest<any>,
            next: HttpHandler):any {
              const token = localStorage.getItem('token');
              if(token){
                const cloned = req.clone({
                  headers: req.headers.set("Authorization",token)
                });
                return next.handle(cloned);
              }else{
                return next.handle(req);
              }
  }

}
