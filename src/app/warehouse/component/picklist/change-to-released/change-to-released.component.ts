import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InventoryTransactionResponseModel } from '~/app/warehouse/Models/inventory-transaction-response-model';

@Component({
  selector: 'app-change-to-released',
  templateUrl: './change-to-released.component.html',
  styleUrls: ['./change-to-released.component.css']
})
export class ChangeToReleasedComponent implements OnInit {

  constructor() { }
  @Input("trans") transaction : InventoryTransactionResponseModel;
  @Output("doneProcess") resultEmit : EventEmitter<InventoryTransactionResponseModel> = new EventEmitter<InventoryTransactionResponseModel>();
 
  releaseParamForm : FormGroup;
  isLoading : boolean = false;



  ngOnInit(): void {
    this.releaseParamForm = new FormGroup({
        "id": new FormControl(this.transaction.transactionId),
        "ReleaseTo" : new FormControl("",[Validators.required]),
        "ReleaseReference": new FormControl("",[Validators.required]),
        "ReleaseDocType" : new FormControl("",[Validators.required])
    });
  }


  submitReleaseParam(){
    
  }

  

}
