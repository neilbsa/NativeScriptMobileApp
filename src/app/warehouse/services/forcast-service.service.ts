import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DatabaseUtilService } from './../../shared/services/database-util.service'
import {PurchaseOrderModel} from './../Models/purchase-order-model';
import {environment} from './../../../environments/environment.dev'
import { BarcodeProcessService } from '../../shared/services/barcode-process.service';
import { catchError } from 'rxjs/operators';
import { PurchaseOrderDetailModel } from '../Models/purchase-order-detail-model';
import { POapiResult } from './../Models/poapi-result' 

@Injectable({
  providedIn: 'root'
})
export class ForcastServiceService {
env = new environment;
private controllerAddress  = `/api/ApiForcastPO`;


private insertPurchaseOrderQuery = `
INSERT INTO PurchaseOrder(
      Id,
      MaterialsBatchId,
      CompanyId,
      Reference,
      ExternalReference,
      PurchaseType,
      Date,
      ProductSupplierId,
      Principal,
      CurrencyId,
      OrderClass ,
      BranchId,
      WareHouseId,
      Instructions,
      Attention,
      Remarks,
      ExpectedArrivalDate,
      Terms,
      Address,
      Amount,
      Status,
      UserDefined1,
      UserDefined2,
      CreateDate,
      LastModifiedDate,
      CreateUser,
      LastModifiedUser,
      ServiceProductLineId 
)VALUES(
?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
)
`;
private insertPurchaseOrderDetailQuery = `
INSERT INTO PurchaseOrderDetails(
  LocalPOheadId,
  Id,
  MaterialsPurchaseOrderId,
  ProductMasterId,
  PartNumber,
  PartCategory,
  PartDescription,
  Quantity,
  ReceivedQuantity,
  InTransitQuantity,
  AllocatedQuantity,
  UnitOfMeasure,
  SellingPrice,
  Remarks,
  CaseNo,
  ProdNumber
)VALUES(
?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
)
`;



constructor(
  private dbUtilities : DatabaseUtilService, 
  private httpClient : HttpClient,
  private barcodeProcess : BarcodeProcessService
  ) { }


public GetForcast(id: number,  companyId ) : Observable<PurchaseOrderModel>{
   console.log(id);
    let url = `${this.env.getCompanyUrl(companyId)}${this.controllerAddress}/GetForcastPO`
    return this.httpClient.get<PurchaseOrderModel>(
      url,{ params : new HttpParams().set("Id",id.toString())}
      
      ).pipe(catchError(this.HandleGetError))
}
  HandleGetError(HandleGetError: HttpErrorResponse) {
    let errorMessage = HandleGetError.error.error_description;
    console.log(HandleGetError);
   return throwError(errorMessage);
  }
private checkRecordifExistLocal(id: number): Promise<boolean>{

return new Promise((res,rej)=>{
      this.dbUtilities.getdbConnection().then(db=>{
          db.each('select * from PurchaseOrder where Id = ?',[id],function(err,row){
              if(err){
                rej(err)
              }
          },function(err,count){

        
            if(err === null){
           
              if(count>0){
               
                res(true);
              }else{
            
                res(false);
              }
            }else{
              throwError(err);
              console.log('error');
            }
           
          })

      })

})

}
  DownloadForcast(pomodel : PurchaseOrderModel) : Promise<boolean>{
  
    return new Promise((res,rej)=>{

   
         
        this.checkRecordifExistLocal(pomodel.Id).then(
          IsExist =>{
            if(!IsExist){
              this.dbUtilities.getdbConnection().then(db=>{
                let poparam = [
                  pomodel.Id,pomodel.MaterialsBatchId,pomodel.CompanyId,
                  pomodel.Reference,pomodel.ExternalReference,pomodel.PurchaseType,
                  pomodel.Date,pomodel.ProductSupplierId,pomodel.Principal,
                  pomodel.CurrencyId,pomodel.OrderClass,pomodel.BranchId,
                  pomodel.WareHouseId,pomodel.Instructions,pomodel.Attention,
                  pomodel.Remarks,pomodel.ExpectedArrivalDate,pomodel.Terms,
                  pomodel.Address,pomodel.Amount,pomodel.Status,pomodel.UserDefined1,
                  pomodel.UserDefined2,pomodel.CreateDate,pomodel.LastModifiedDate,
                  pomodel.CreateUser,pomodel.LastModifiedUser,pomodel.ServiceProductLineId
                ]
    
             
            
    
                db.execSQL(this.insertPurchaseOrderQuery,poparam).then(poid=>{
                  console.log(poid)
                  pomodel.Details.forEach((indx)=>{
                      let currentPoDetails = [
                          poid, indx.Id,indx.MaterialsPurchaseOrderId,indx.ProductMasterId,
                          indx.PartNumber,indx.PartCategory,indx.PartDescription,
                          indx.Quantity,indx.ReceivedQuantity,indx.InTransitQuantity,
                          indx.AllocatedQuantity,indx.UnitOfMeasure,indx.SellingPrice,
                          indx.Remarks,indx.CaseNo,indx.ProdNumber
                      ];
                      db.execSQL(this.insertPurchaseOrderDetailQuery,currentPoDetails).then(id=>{
                        console.log(id)
                      },error=>{ 
                        rej(error);
                        throwError(`Po detail ${ indx.PartNumber } is not included: ${error}`);
                      })
                  });
                  res(true);
    
                },error=>{
                  rej(error);
                  throwError(`Po ${ pomodel.Reference } is not included: ${error}`);
                })
              })
            
            }else{
              rej("existing PO Forcast error")
              throwError("cannot Download existing PO forcast");
            }
          },error=>{
            rej("error in validating PO forcast local")
            throwError("error in validating PO forcast local: " + error);
          }
        )

         

    });
  }

  GetAllLocalForcastPO(): Promise<PurchaseOrderModel[]>
  { 

    return new Promise((res,rej)=>{
      let model : PurchaseOrderModel[] = []
          this.dbUtilities.getdbConnection().then(db=>{
              
            
            
            db.all('select * from PurchaseOrder').then(rows=>{

                rows.forEach(row => {
                  
                
                    let  mod :PurchaseOrderModel=new PurchaseOrderModel(); 
                    
                    mod.Id =row[1];
                    mod.MaterialsBatchId=row[2];
                    mod.CompanyId=row[3];
                    mod.Reference=row[4];
                    mod.ExternalReference=row[5];
                    mod.PurchaseType=row[6];
                    mod.Date=row[8]; 
                    mod.ProductSupplierId =row[9];
                    mod.Principal =row[10];
                    mod.CurrencyId=row[11];
                    mod.OrderClass =row[12];
                    mod.BranchId=row[13];
                    mod.WareHouseId=row[14];
                    mod.Instructions=row[15];
                    mod.Attention=row[16];
                    mod.Remarks=row[17];
                    mod.ExpectedArrivalDate=row[18];
                    mod.Terms=row[19];
                    mod.Address=row[20];
                    mod.Amount=row[21];
                    mod.Status=row[22];
                    mod.UserDefined1=row[23];
                    mod.UserDefined2=row[24];
                    mod.CreateDate=row[25];
                    mod.LastModifiedDate=row[26];
                    mod.CreateUser=row[27];
                    mod.LastModifiedUser =row[28];
                    mod.ServiceProductLineId=row[29];
                    model.push(mod);
                });

              res(model);

            })
         
          },error=>{
            rej(null);
            throwError(error)
          })

    })




     

  }

 GetLocalForcastHeader(forcastId : number) : Promise<PurchaseOrderModel>{
    return new Promise((res,rej)=>{

          this.dbUtilities.getdbConnection().then(db =>{
              db.get(`select * from PurchaseOrder
                       where Id = ?
                       `,[forcastId]).then(row =>{
                  if(row.length > 0){
                
                    let  mod :PurchaseOrderModel=new PurchaseOrderModel(); 
                    
                    mod.Id =row[1];
                    mod.MaterialsBatchId=row[2];
                    mod.CompanyId=row[3];
                    mod.Reference=row[4];
                    mod.ExternalReference=row[5];
                    mod.PurchaseType=row[6];
                    mod.Date=row[7]; 
                    mod.ProductSupplierId =row[8];
                    mod.Principal =row[9];
                    mod.CurrencyId=row[10];
                    mod.OrderClass =row[11];
                    mod.BranchId=row[12];
                    mod.WareHouseId=row[13];
                    mod.Instructions=row[14];
                    mod.Attention=row[15];
                    mod.Remarks=row[16];
                    mod.ExpectedArrivalDate=row[17];
                    mod.Terms=row[18];
                    mod.Address=row[19];
                    mod.Amount=row[20];
                    mod.Status=row[21];
                    mod.UserDefined1=row[22];
                    mod.UserDefined2=row[23];
                    mod.CreateDate=row[24];
                    mod.LastModifiedDate=row[25];
                    mod.CreateUser=row[26];
                    mod.LastModifiedUser =row[27];
                    mod.ServiceProductLineId=row[28];
                  
                    return mod;
                  
                  }else{
                    rej("No Record found");
                  }
              },error =>{
                rej("error in getting Forcast header");
              }).then(formatedPO =>{

                let formatedDetails : PurchaseOrderDetailModel[] = [];
                this.dbUtilities.getdbConnection().then(db=>{
                    db.each(`SELECT * FROM PurchaseOrderDetails where MaterialsPurchaseOrderId = ? `, [formatedPO.Id],
                    function(err,row){
                        let poDetail = new PurchaseOrderDetailModel();
                      
                          poDetail.Id = row[2];
                          poDetail.MaterialsPurchaseOrderId = row[3];
                          poDetail.ProductMasterId = row[4];
                          poDetail.PartNumber = row[5];
                          poDetail.PartCategory = row[6];
                          poDetail.PartDescription = row[7];
                          poDetail.Quantity = row[8];
                          poDetail.ReceivedQuantity = row[9];
                          poDetail.InTransitQuantity = row[10];
                          poDetail.AllocatedQuantity = row[11];
                          poDetail.UnitOfMeasure = row[12];
                          poDetail.SellingPrice = row[13];
                          poDetail.Remarks = row[14];
                          poDetail.CaseNo = row[15];
                          poDetail.ProdNumber = row[16];
                          
                      
                          formatedPO.Details.push(poDetail)

                    })

                  return formatedPO;
                }).then(finalPO => {
                 
                    res(finalPO);
                })
              
          

              })
          });


    });
  }

  updateRecvQuantityLineItem(POdetailId: number, Quantity : number) : Promise<boolean>
  {
    return new Promise((res,rej) =>{

        this.dbUtilities.getdbConnection().then(db=>{
            db.execSQL(`Update PurchaseOrderDetails 
            set ReceivedQuantity =? where id = ?`,[Quantity,POdetailId]).then(id=>{

                res(true);


            },error =>{
                
              
              throwError(error);
              rej("Updating line item failed")

            })

        })

    });


  }



  onDeleteForcastPOOrder(forcastid : number): Promise<boolean>{
      return new Promise((res,rej)=>{
        this.dbUtilities.getdbConnection().then(db=>{
          db.execSQL('delete from PurchaseOrderDetails where MaterialsPurchaseOrderId = ?',[forcastid]).then(id =>{
            db.execSQL(`delete from  PurchaseOrder where id = ? `,[forcastid]).then(fordelete=>{
              res(true);
            },error =>{
          
                rej(`delete forcast locally has problem ${ error }`);
            })
          },error=>{
            rej(`delete forcast locally has problem ${ error }`);
           
          })
      });
      })
  }


  uploadUpdate(forcastid : number): Promise<boolean>{
    return new Promise((resolve,reject)=>{
      this.GetLocalForcastHeader(forcastid).then(res=>{
        let url = `${this.env.getCompanyUrl(res.CompanyId)}${this.controllerAddress}/UpdateForcast`  
        let httpData = res;
        const httpOptions = {
          headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        this.httpClient.post<POapiResult>(url,httpData).subscribe(sub =>{
          if(sub.IsSuccess)
          {
            this.onDeleteForcastPOOrder(forcastid).then(res=>{
                if(res){
                  resolve(true);
                }
            },error =>{
              console.log(error);
              reject(error);
          
            });
          }
        },error=>{
          console.log(error);
          reject(`${error}`);
        });
  
      })
    })
  }

  cancelUpdate(forcastid:number) : Promise<boolean>{

    return new Promise((resolve,reject)=>{
      this.GetLocalForcastHeader(forcastid).then(res=>{
            let url = `${this.env.getCompanyUrl(res.CompanyId)}${this.controllerAddress}/CancelUpdateForcast`  
            let httpData = JSON.stringify({Id : +res.Id});
            console.log(url);
            console.log(httpData);
            const httpOptions = {
             params: new HttpParams().set("Id",`${res.Id}`)
            }
            this.httpClient.post<POapiResult>(url,httpData,httpOptions).subscribe(res=>{
              console.log(res.IsSuccess);
              if(res.IsSuccess){
                  
                    this.onDeleteForcastPOOrder(forcastid).then(deleteId=>{
                      resolve(true);
                    },error =>{
                      reject(`delete locally failed ${ error}`);
                      
                    })
                }else{
                  console.log(res.IsSuccess);
                  reject("cancer Update has not success");
                }

            },error=>{
              console.log(`error httpclient ${error.statusText}`);
         
              
              reject(`error httpclient ${error.statusText}`);
             
            })
      },error=>{
        console.log(`error getting PO local ${error}`);
        reject("getting connection in database error");
    
      });
    });


    





  }



}


