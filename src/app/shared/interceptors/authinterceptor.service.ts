import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SecurityService} from './../../shared/services/security.service'
import { exhaustMap, take} from 'rxjs/operators'
@Injectable()
export class AuthinterceptorService implements HttpInterceptor {

  constructor(private authService : SecurityService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return this.authService.currentUser.pipe(take(1),exhaustMap(user =>{

      if(!user){
        console.log('interceptor called and user is null');
       return next.handle(req);
      }
      console.log('interceptor called and user is not null');
      const injectedHeaderRequest =  req.clone(
        {
           headers: new HttpHeaders()
           .set("Authorization", `bearer ${ user.access_token }`) 
        }
      )
      return next.handle(injectedHeaderRequest);

    }))
  }


}
