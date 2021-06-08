import { Injectable } from '@angular/core';
import { CredentialModel } from '../model/credential-model';
import { SecurityToken } from '../model/security-token';
import { JwtTokenModel } from '../model/jwt-token-model';
import { Dialogs, Observable } from '@nativescript/core'
import { environment } from './../../../environments/environment.dev';
import jwt_decode from "jwt-decode";
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError ,tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  env : environment = new environment();
  modeledJwt: JwtTokenModel;
  loggedToken : SecurityToken;
  currentUser : BehaviorSubject<JwtTokenModel> = new BehaviorSubject<JwtTokenModel>(null);


  constructor(private httpClient : HttpClient) { }
  
autologout(persist : number){
 setTimeout(()=>this.logOut(),persist);
}

  
 private StoreCredentials(tokenModel : SecurityToken){
    this.convertTokenToModel(tokenModel.access_token).then(model=>{
        this.currentUser.next(model);
      });
 }

 private convertTokenToModel(mod:string): Promise<JwtTokenModel>{

   return new Promise((resolve,reject)=>{
    var DecodedJwt = jwt_decode<JwtTokenModel>(mod);
     if(DecodedJwt !== null){
       this.modeledJwt = new JwtTokenModel();
       this.modeledJwt.Username = DecodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
       this.modeledJwt.issuer = DecodedJwt["iss"];
       this.modeledJwt.tokenExpire = DecodedJwt["exp"]
       this.modeledJwt.access_token = mod;
       this.modeledJwt.isValid = false;  
       resolve(this.modeledJwt);
     }else{
      reject(null)
     }
   });
 }



 logOut()
 {
    console.log('logout called');
    this.currentUser.next(null);
 }
  login(user : CredentialModel) 
  {

    
      var data = new FormData;  

          for ( var key in user ) {
            data.append(key, user[key]);
          
          }   
          data.append('grant_type','password');
      
          var opt = {
            url: this.env.securityUrl,
            method: "POST",         
            content: data,
          }

          return this.httpClient.post<SecurityToken>(opt.url,opt.content).pipe(
              catchError(this.handleAuthenticationError),
              tap((res)=>this.StoreCredentials(res))
            );
  
          



  }

  handleAuthenticationError(errorResponse : HttpErrorResponse){

   

      return throwError(errorResponse.error.error_description);
  }




}
