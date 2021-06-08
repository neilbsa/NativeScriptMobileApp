import { AfterViewInit, Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dialogs } from '@nativescript/core';
import { InventoryTransactionResponseModel } from '~/app/warehouse/Models/inventory-transaction-response-model';
import { PickParam } from '~/app/warehouse/Models/pick-param';
import { PicklistService } from '~/app/warehouse/services/picklist.service';
@Component({
  selector: 'app-change-to-pick',
  templateUrl: './change-to-pick.component.html',
  styleUrls: ['./change-to-pick.component.css']
})
export class ChangeToPickComponent implements OnInit {

  @Input("trans") transaction : InventoryTransactionResponseModel;
  @Output("doneProcess") resultEmit : EventEmitter<InventoryTransactionResponseModel> = new EventEmitter<InventoryTransactionResponseModel>();
  pickParamForm : FormGroup;
  isLoading : boolean = false;
  constructor(
    private pickListProcessing : PicklistService,
  ) { }
 

  ngOnInit(): void {
    console.log(`this is from transaction ${this.transaction.transactionId }`)
    this.pickParamForm = new FormGroup({
      "id" : new FormControl(this.transaction.transactionId),
      "picklocation": new FormControl("",[Validators.required]),
      "statusremarks" : new FormControl("")
    })
  }

  submitPickParam(){
   
   this.isLoading = true;
    let param = new PickParam();
    param.id = this.pickParamForm.value.id;
    param.PickLocation = this.pickParamForm.value.picklocation;
    param.StatusRemarks = this.pickParamForm.value.statusremarks;
    console.log(param);

    this.pickListProcessing.ChangeToPickedPickList(this.transaction,param).then(res=>{
        console.log(res);
      this.showToast(`Update success id : ${res.ConfirmationId}`)
      this.resultEmit.emit(res);
    },error=>{
        this.showToast(`error: ${ error }`);
    }); 



  }

  
  private showToast(message: string): void{

    const alertOptions = {
      title: 'Notification',
      message: message,
      okButtonText: 'Okay',
      cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
    }
  
    Dialogs.alert(alertOptions).then(test =>{
   
    });
  
  
  }

}
