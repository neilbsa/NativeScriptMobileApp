import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from '@nativescript/angular';
import { Dialogs } from '@nativescript/core';
import { InventoryTransactionResponseModel } from '../../Models/inventory-transaction-response-model';
import { PickParam } from '../../Models/pick-param';
import { WarehouseStatusCode } from '../../Models/warehouse-status-code';
import{PicklistService} from '../../services/picklist.service';
@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.css']
})
export class PicklistComponent implements OnInit,AfterViewInit {

  @ViewChild("codeInput",{static:false}) codeInput : ElementRef
  currentStatusProcess : InventoryTransactionResponseModel;
   code : string = "";
   isOngoing : boolean;
   NextStatusText : string="";
   switchStatus :string = "";
   transactionId : number;
   isLoading : boolean = false;
 
    constructor(
      private pickListProcessing : PicklistService,
      private route : RouterExtensions
    ) { }
  
    ngOnInit(): void {
   
    }
  
    ngAfterViewInit():void{
      setTimeout(()=>{
       this.resetForm();
      },100)
    }
  
  
    resetForm(){
      this.codeInput.nativeElement.text="";
    
      setTimeout(()=>{
        this.codeInput.nativeElement.focus();
       
      },300)
    }



   
    onTextChange(event){
      const scannerText = this.codeInput.nativeElement.text;
     //const scannerText = "TRANS:CIVIC~Order~503174|";
     if(scannerText.indexOf("|") > -1){
       
     this.isLoading = true;
        this.pickListProcessing.GetNextStatus(scannerText).then(getNextStatusResponse =>{
            console.log(getNextStatusResponse);
            this.NextStatusText = getNextStatusResponse.NextStatus;
            this.transactionId = getNextStatusResponse.transactionId;
            this.switchStatus = this.NextStatusText.toLowerCase();
            console.log(this.switchStatus)
            this.isOngoing = getNextStatusResponse.NextStatus.startsWith("Ongoing");
            this.currentStatusProcess = getNextStatusResponse;
            this.isLoading = false;
            
        },error=>{
          this.isLoading = false;
      
          this.showToast(`Error getting next status: ${error}`);
        })
        this.resetForm();  
     }
    }
  
  
  
    onDoneProcessing($event){
      this.switchStatus = "";
      setTimeout(()=>{
        this.codeInput.nativeElement.focus();
       
      },100)
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
  
    
    navigateBack(){
      this.route.backToPreviousPage();
    }

}
