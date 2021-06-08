import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { RouterExtensions } from '@nativescript/angular'
import {
  DrawerTransitionBase,
  RadSideDrawer,
  SlideInOnTopTransition,
} from 'nativescript-ui-sidedrawer'
import { filter } from 'rxjs/operators'
import { Application } from '@nativescript/core'
import { DatabaseUtilService } from './shared/services/database-util.service'
import { SecurityService } from './shared/services/security.service'
import { Subscriber, Subscription } from 'rxjs'
import { JwtTokenModel } from './shared/model/jwt-token-model'
@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit,OnDestroy {
  private _activatedUrl: string
  private _sideDrawerTransition: DrawerTransitionBase
  private currentUserSubcriber : Subscription
 jwtTokenUser : JwtTokenModel = new JwtTokenModel();
  constructor(
    private router: Router, 
    private routerExtensions: RouterExtensions, 
    private database : DatabaseUtilService,
    private security : SecurityService
    ) {
    // Use the component constructor to inject services.
  }

ngOnDestroy():void{
  this.currentUserSubcriber.unsubscribe();
}

  ngAfterViewInit(){
    setTimeout(() => {
      this.database.databaseInit();

      this.currentUserSubcriber=  this.security.currentUser.subscribe((user)=>{
        console.log(user);
       
        if(user === null){
          console.log('null yung value ng user naten');
  
          const sideDrawer = <RadSideDrawer>Application.getRootView()
          sideDrawer.closeDrawer()
          this.routerExtensions.navigate(['/login'],{
            transition: {
              name: 'fade',
            },
          });
         
         }else{
          this.jwtTokenUser=user
         }
      });


     }, 100);
  }
  ngOnInit(): void {
    this._activatedUrl = '/home'
    this._sideDrawerTransition = new SlideInOnTopTransition()
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => (this._activatedUrl = event.urlAfterRedirects))


  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition
  }


  logout(){
    console.log('logout called');
    this.security.logOut();
  }

  isComponentSelected(url: string): boolean {
    return this._activatedUrl === url
  }

  onNavItemTap(navItemRoute: string): void {
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade',
      },
    })
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.closeDrawer()
  }
}
