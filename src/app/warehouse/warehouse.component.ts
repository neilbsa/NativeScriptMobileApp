import { Component, OnInit } from '@angular/core';
import { Application } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehousemain.component.css']
})
export class WarehouseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  onDrawerButtonTap(){
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }
}
