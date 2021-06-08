import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';
import { PoforcastComponent } from './component/poforcast/poforcast.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { MainMenuComponent } from './component/main-menu/main-menu.component';
import { ScanComponent } from './component/poforcast/scan/scan.component';
import { ListComponent } from './component/poforcast/list/list.component';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { ListDetailsComponent } from './component/poforcast/list/list-details/list-details.component';
import { MaterialTransferComponent } from './component/material-transfer/material-transfer.component';
import { ListMTFComponent } from './component/material-transfer/list-mtf/list-mtf.component';
import { ScanMTFComponent } from './component/material-transfer/scan-mtf/scan-mtf.component';
import { MtfdetaillistComponent } from './component/material-transfer/list-mtf/mtfdetaillist/mtfdetaillist.component';
import { PicklistComponent } from './component/picklist/picklist.component';
import { ChangeToPickComponent } from './component/picklist/change-to-pick/change-to-pick.component';
import { ChangeToReleasedComponent } from './component/picklist/change-to-released/change-to-released.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    PoforcastComponent,
    WarehouseComponent,
    MainMenuComponent,
    ScanComponent,
    ListComponent,
    ListDetailsComponent,
    MaterialTransferComponent,
    ListMTFComponent,
    ScanMTFComponent,
    MtfdetaillistComponent,
    PicklistComponent,
    ChangeToPickComponent,
    ChangeToReleasedComponent,

  ],
  imports: [
    ReactiveFormsModule,
    NativeScriptFormsModule ,
    NativeScriptUIListViewModule ,
    NativeScriptCommonModule,
    WarehouseRoutingModule
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class WarehouseModule { }
