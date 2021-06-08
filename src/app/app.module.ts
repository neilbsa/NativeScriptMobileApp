import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule, NativeScriptModule } from '@nativescript/angular'

import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { LoginComponent } from './shared/component/login/login.component'
import { AuthinterceptorService } from './shared/interceptors/authinterceptor.service'

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule, 
    NativeScriptModule, 

    NativeScriptUISideDrawerModule,
    ReactiveFormsModule,
    NativeScriptFormsModule ,
    HttpClientModule
    ],
  declarations: [AppComponent, LoginComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthinterceptorService,multi:true }],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
