import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(private routerExtensions : RouterExtensions) { }

  ngOnInit(): void {
  }


  onDrawerButtonTap(){
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  
  onMainButtonClick(navItemRoute: string): void {
    this.routerExtensions.navigate(['warehouse',navItemRoute], {
      transition: {
        name: 'fade',
      },
    })

  }
}
