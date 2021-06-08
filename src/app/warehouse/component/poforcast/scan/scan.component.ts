
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Application, Dialogs, TextField } from '@nativescript/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import {PurchaseOrderModel} from './../../../Models/purchase-order-model';
import { BarcodeProcessService } from './../../../../shared/services/barcode-process.service';
import { ForcastServiceService } from './../../../services/forcast-service.service';
import { Subscription } from 'rxjs';
import { RouterExtensions } from '@nativescript/angular';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  code : string = "";
  currentSelectedPurchaseOrder : PurchaseOrderModel;
  getforcastSubscription : Subscription;
  transactionType : string = "Forcast-PO";
  constructor(
    private route : RouterExtensions,
    private barcodeProcess : BarcodeProcessService,
    private poforcastService : ForcastServiceService
  ) { }
  @ViewChild("codeInput",{static:false}) codeInput : ElementRef



  ngOnInit(): void {
    
  }

  ngAfterViewInit():void{
    setTimeout(()=>{
      this.codeInput.nativeElement.focus();
     
    },100)
  }

  resetForm(){
    this.codeInput.nativeElement.text="";
    setTimeout(()=>{
      this.codeInput.nativeElement.focus();
    },100)
  }
  navigateBack(){
    this.route.backToPreviousPage();
  }
  

  onDrawerButtonTap(){
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  onTextChange(event:any){
    const scannerText = this.codeInput.nativeElement.text;
    if(scannerText.indexOf("|") > -1){
      this.getForcast(scannerText)
    }
   
    console.log(scannerText.text);
  }

DownloadForcast(){
 
  this.poforcastService.DownloadForcast(this.currentSelectedPurchaseOrder).then(res =>{
        if(res){
          this.showToast("download succeded");
        }else{
          this.showToast("download failed");
        }
  },error=>{
    this.showToast(`download failed: ${ error }`);
  })
}

  getForcast(scannerText){
    let barcodeData = this.barcodeProcess.parseBarcodeData(scannerText);
   
   if(this.transactionType.toUpperCase() !== barcodeData.type.toUpperCase()){
     this.showToast(`Transaction Mismatch: Transaction is a ${barcodeData.type}`);
   }else{
    this.getforcastSubscription=  this.poforcastService.GetForcast(barcodeData.id,barcodeData.companyid).subscribe(res=>{
    
      console.log("getting forcast succes");
        
      
      this.poforcastService.DownloadForcast(res).then(forDownload =>{
          this.currentSelectedPurchaseOrder =res;
          this.showToast(`downloading Sucess`);

        },error=>{

          this.showToast(`error downloading Forcast: ${error}`);
        })




    },error=>{
      this.showToast(error);
    })
   }
  
    this.resetForm();
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



  ngOnDestroy():void{
   
  }


}
