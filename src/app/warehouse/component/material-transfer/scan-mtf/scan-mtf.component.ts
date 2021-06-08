import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Dialogs } from '@nativescript/core';
import { BarcodeProcessService } from '~/app/shared/services/barcode-process.service';
import {MaterialTransferHeader} from '~/app/warehouse/Models/material-transfer-header'
import {MaterialTransferService} from './../../../services/material-transfer.service';
@Component({
  selector: 'app-scan-mtf',
  templateUrl: './scan-mtf.component.html',
  styleUrls: ['./scan-mtf.component.css']
})
export class ScanMTFComponent implements OnInit,AfterViewInit {
  @ViewChild("codeInput",{static:false}) codeInput : ElementRef
  code : string = "";
  currentSelectedMaterialTransfer : MaterialTransferHeader;

  constructor( private route : RouterExtensions,
    private barcodeProcess : BarcodeProcessService,
    private mtfService : MaterialTransferService) { }

  ngOnInit(): void {
    
  }
  
  onTextChange(event:any){
    const scannerText = this.codeInput.nativeElement.text;
    this.getMTFdetails(scannerText);
    console.log(scannerText.text);
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

  getMTFdetails (scannerText){
    if(scannerText.indexOf("|") > -1){

   
    let dataModel = this.barcodeProcess.parseBarcodeData(scannerText);
    console.log(dataModel);
    this.mtfService.DownloadMaterialTransfer(dataModel.id,dataModel.companyid)
    .then(res=>{
      console.log(res);
          if(res){
          
            this.currentSelectedMaterialTransfer = res;

            this.showToast("MTF successfully downloaded");
          }else{
              this.showToast("Cannot find Id.");
          }
    },error =>{
      this.showToast(`Error downloading MTF error: ${error}`);
    })
    this.resetForm();
  }
  }

  navigateBack(){
    this.route.backToPreviousPage();
  }


}
