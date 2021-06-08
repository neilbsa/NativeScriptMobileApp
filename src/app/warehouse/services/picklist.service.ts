import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {BarcodeProcessService} from './../../shared/services/barcode-process.service';
import {environment} from './../../../environments/environment.dev';
import { InventoryTransactionResponseModel } from '../Models/inventory-transaction-response-model';
import { BarcodeModel } from '../../shared/model/barcode-model';
import { PickParam } from '../Models/pick-param';
import { WarehouseStatusCode } from '../Models/warehouse-status-code';
@Injectable({
  providedIn: 'root'
})
export class PicklistService {

  env = new environment;


  constructor(private barcodeProcess: BarcodeProcessService,
              private httpClient :HttpClient) { }

   ControllerName: {[key: string]: string} = 
   {
          "order": "OrdTransactionApi",
          "transfer": "TFTransactionApi",
          "invoice": "NewInvoiceApi",
          "deliveryreceipt" : "NewDeliveryReceiptApi",
          "partstransfer" : "NewPartsTransferApi",
          "serviceinvoice" : "NewServiceInvoiceApi",
          "materialtransfer" : "MaterialTransferApi"
    }


    IaStatusAction : {[key:string]: string} = 
    {
      "picked" : "ChangeToPickedConfirmed",
      "released" : "ChangeToReleasedConfirmed",
    }

    WHStatusAction : {[key : string ] : string}=
    {
      "preparing":"ChangeToPreparing",
      "packed" : "ChangeToPackedConfirmed",
      "released" : "ChangeToRelease",
      "transactioncode" : "GetTransactionCodes"
    }
    private getUrl (transactionType: string, companyId : string) : string{
      const getNexStatusUrl = `${this.env.getCompanyUrl(companyId)}/api/${this.ControllerName[transactionType.toLowerCase()]}/GetNextStatus`;
      console.log(transactionType);
      console.log(companyId)
      //const getNexStatusUrl = `http://localhost:9000/CivicSystemWeb/api/${this.ControllerName[transactionType.toLowerCase()]}/GetNextStatus`;
     return getNexStatusUrl;
    }

    handleconfirmationCodes (model : InventoryTransactionResponseModel):InventoryTransactionResponseModel{
      let singleconfirmationCodes :string[] = ["order","transfer"]
   
      if(singleconfirmationCodes.includes(model.transactionType.toLocaleLowerCase())){
       let currentStatusCode : WarehouseStatusCode = new WarehouseStatusCode();
       let currentStatusCodeList : WarehouseStatusCode[] = [];
       
       currentStatusCode.ConfirmationId = +model.ConfirmationId;
      // currentStatusCode.transId = +this.currentStatusProcess.ConfirmationId;
       currentStatusCode.Reference = model.Reference
       currentStatusCodeList.push(currentStatusCode);
       model.WarehouseConfirmationCode=currentStatusCodeList;
      }else{
        //multiple
      }

      return model;
    }
    
   GetNextStatus(barCode : string): Promise<InventoryTransactionResponseModel>
   {
        return new Promise((resolve,reject)=>{
          var barcodeModel = this.barcodeProcess.parseIaBarcodeData(barCode);
          let httpBody : PickParam = new PickParam();
          console.log(barcodeModel);
          let url = this.getUrl(barcodeModel.type,barcodeModel.companyid);
          const getNexStatusUrl = `${this.env.getCompanyUrl(barcodeModel.companyid)}/api/${this.ControllerName[barcodeModel.type.toLowerCase()]}/GetNextStatus`;
     
         
          httpBody.id=barcodeModel.id;
          
          this.httpClient.post<InventoryTransactionResponseModel>(url,httpBody).subscribe(res=>{
            res.transactionType = barcodeModel.type;
            res.transactionId = barcodeModel.id;
            res.companyId = barcodeModel.companyid;
          let resolveTransaction = this.handleconfirmationCodes(res);
            resolve(resolveTransaction)
          },error=>{
            reject(error);
          })
        })
    }

    ChangeToPickedPickList(transaction :InventoryTransactionResponseModel, pickParam : PickParam): Promise<InventoryTransactionResponseModel>
    {
     
     return new Promise((resolve,reject)=>{
         const changeToPickedConfirmUrl = `${this.env.getCompanyUrl(transaction.companyId)}/api/${this.ControllerName[transaction.transactionType.toLowerCase()]}/ChangeToPickedConfirmed`;
     
          this.httpClient.post<InventoryTransactionResponseModel>(changeToPickedConfirmUrl,pickParam).
          subscribe(changeToPickresult=>{
              if(changeToPickresult.Status === "Success"){
                resolve(changeToPickresult);
              }else{
                reject(`Error: not success ${changeToPickresult.StatusMessage}`);
              }
          },error=>{
            console.log(error);
              reject(`Error: ${ error }`);
          });

     })
     
     
     
    }



}
