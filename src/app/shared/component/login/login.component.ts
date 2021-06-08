import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CredentialModel} from './../../model/credential-model';
import { environment } from './../../../../environments/environment.dev';
import{ SecurityService } from './../../services/security.service';
import { Dialogs, Observable } from '@nativescript/core';
import { Subject } from 'rxjs';
import { RouterExtensions } from '@nativescript/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  processing : boolean = false;
  emitProcessing = new Subject<boolean>();;
  credentialModel : CredentialModel = new CredentialModel();
  env : environment = new environment();
  appName : string = '';
  loginForm: FormGroup ;
  constructor(
    private secserve: SecurityService,
    private router : RouterExtensions
    ) { }
  ngOnInit(): void {
    this.appName = this.env.appName;

    this.emitProcessing.subscribe(x=>{
      this.processing = x;
    });



    this.loginForm = new FormGroup(
      {
        "username" : new FormControl(null),
        "password" : new FormControl(null)
      }
    );
  }


  private showToast(message: string): void{

    const alertOptions = {
      title: 'Error',
      message: message,
      okButtonText: 'Okay',
      cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
    }
  
    Dialogs.alert(alertOptions).then(test =>{
   
    });
  
  
  }

  loginIn(){
    var formValue = this.loginForm.value;
    this.emitProcessing.next(true);
    this.secserve.login({...formValue}).subscribe(res=>{
      this.emitProcessing.next(false);
      if(res){
               this.router.navigate(['/home']);
      }
    },error =>{
      this.showToast(error);
      this.emitProcessing.next(false);
    })
    
  }


}
