import { Route } from '@angular/compiler/src/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { ListMTFComponent } from './component/material-transfer/list-mtf/list-mtf.component';
import { MtfdetaillistComponent } from './component/material-transfer/list-mtf/mtfdetaillist/mtfdetaillist.component';
import { MaterialTransferComponent } from './component/material-transfer/material-transfer.component';
import { ScanMTFComponent } from './component/material-transfer/scan-mtf/scan-mtf.component';
import { PicklistComponent } from './component/picklist/picklist.component';
import { ListDetailsComponent } from './component/poforcast/list/list-details/list-details.component';
import { ListComponent } from './component/poforcast/list/list.component';
import { PoforcastComponent } from './component/poforcast/poforcast.component';
import { ScanComponent } from './component/poforcast/scan/scan.component';



let routes : Routes = [
  
   
    { path: '', component: MainMenuComponent},  
    {path:'forcast' , component: PoforcastComponent},
    {path:'download' , component: ScanComponent},
    {path:'savedForcast' , component: ListComponent},
    {path:'forcastdetail/:id' , component: ListDetailsComponent},
    {path:'materialtransfer' , component: MaterialTransferComponent},
    {path:'mtfscan' , component: ScanMTFComponent},
    {path:'mtflist' , component: ListMTFComponent},
    {path:'mtfdetails/:id' , component: MtfdetaillistComponent},
    {path:'picklist' , component: PicklistComponent},
  
];

@NgModule({
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule.forChild(routes)
  ],
  exports:[NativeScriptRouterModule],
})
export class WarehouseRoutingModule { }
