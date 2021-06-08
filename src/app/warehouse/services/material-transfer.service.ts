import { Injectable } from '@angular/core';
import { MaterialTransferHeader } from './../Models/material-transfer-header';
import {environment} from './../../../environments/environment.dev';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DatabaseUtilService } from './../../shared/services/database-util.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MaterialTransferDetails } from '../Models/material-transfer-details';
import { rowHeightProperty } from '@nativescript/core/ui/list-view';
@Injectable({
  providedIn: 'root'
})
export class MaterialTransferService {
  env = new environment;
  private controllerAddress  = `/api/MaterialTransfer`;

  private insertTransferDetail = `
  insert into MaterialTransferDetail
  (
    Id,
    MaterialsTransferHeaderId,
    PartNumber, 
    PartCategory,
    PartDescription,
    Quantity,
    UnitOfMeasure,
    Remarks,
    ReceivedQuantity
  )
VALUES(?,?,?,?,?,?,?,?,?)`;


  private inserMaterialtransferQuery = `
  insert into MaterialTransferHeader
  (
    CompanyId,
    Id,
    Reference,
    MTFDate,
    WHFrom,
    WHTo,
    PartsTransferRequestId,
    CISReference,
    BranchId,
    Status,
    TransferMode,
    ReceiptNumber,
    Instructions,
    PreparedBy,
    ApprovedBy,
    CreateDate,
    LastModifiedDate,
    CreateUser,
    LastModifiedUser 
)
VALUES
(?,?,?,?,?,?,?,?,?,?,
 ?,?,?,?,?,?,?,?,?)`;






  constructor(private httpClient : HttpClient,
             private dbUtilities : DatabaseUtilService, 
      ) { }


  private checkLocalDatabaseIfExist(id: number): Promise<boolean>{
        
          return new Promise((res,rej)=>{
            this.dbUtilities.getdbConnection().then(db=>{
                db.each('select * from MaterialTransferHeader where Id = ?',[id],function(err,row){
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

  private DownloadMTFtoServer(id : number,companyId : string) : Observable<MaterialTransferHeader>
  {
    let url = `${this.env.getCompanyUrl(companyId)}${this.controllerAddress}/DownloadMaterialsTransferDetails`
       
    return this.httpClient.get<MaterialTransferHeader>(url,
      { 
        params: new HttpParams().set("Id", id.toString())
      }).pipe(catchError(this.handleGetError))
  }

 private handleGetError(handleGetError: HttpErrorResponse) {
        let errorMessage = handleGetError.error.error_description;
        console.log(handleGetError);
      return throwError(errorMessage);
  }

  deleteMaterialtransfer(id: number) : Promise<boolean> {
    
    return new Promise((resolve,reject)=>{
          this.dbUtilities.getdbConnection().then(db=>{
            db.execSQL("delete from MaterialTransferDetail where MaterialsTransferHeaderId = ?", [id])
            .then(row =>{
                db.execSQL("delete from MaterialTransferHeader where id = ?",[id]).then(row=>{
                  resolve(true);
                },error=>{
                    reject(`deleting line item error: ${ error }`)
                })

            },error=>{
              reject(`deleting item error: ${ error }`)
            })
          })
    })
  
  }


  private SaveMaterialTransferLocal(entity: MaterialTransferHeader) : Promise<boolean>{
    return new Promise((resolve,reject)=>{
        this.dbUtilities.getdbConnection().then(db=>{
          let headerParams = [entity.CompanyId,entity.Id,entity.Reference,entity.Date
          ,entity.From, entity.To,entity.PartsTransferRequestId,entity.CISReference,entity.BranchId,
          entity.Status,entity.TransferMode,entity.ReceiptNumber,entity.Instructions,entity.PreparedBy,
          entity.ApprovedBy,entity.CreateDate,entity.LastModifiedDate,entity.CreateUser,entity.LastModifiedUser];

          db.execSQL(this.inserMaterialtransferQuery,headerParams).then(localId =>{
          
                entity.MaterialsTransferDetails.forEach((row)=>{
                  
                        let currentDetailParam = [row.Id,row.MaterialsTransferHeaderId,row.PartNumber,
                          row.PartCategory,row.PartDescription,row.Quantity,row.UnitOfMeasure,
                          row.Remarks,row.ReceivedQuantity
                        ];
                        
                          db.execSQL(this.insertTransferDetail,currentDetailParam).then(id=>{
                          },error=>{
                            reject(`Error in adding line items : ${error}`);
                          })
                })
              return localId;
          },error =>{
            reject(`error in adding header : ${error}`);
          }).then(ent=>{
              resolve(true);
          })
        },error=>{
          reject(`error in accessing database ${error}`);
        })
    })
  }


  DownloadMaterialTransfer(id : number,companyId : string) : Promise<MaterialTransferHeader>
  {
    return new Promise((resolve,reject)=>{
        this.checkLocalDatabaseIfExist(id).then(IsExist =>{
          console.log(IsExist)
            if(!IsExist)
            {
                  this.DownloadMTFtoServer(id,companyId).subscribe(ServerData =>{
                    this.SaveMaterialTransferLocal(ServerData).then(boolResult =>{
                        if(boolResult){
                          resolve(ServerData)
                        }
                     },error=>{
                       reject(`error in saving: ${error}`);
                     })
                  },error=>{
                    reject(`Error in downloading:  ${ error }`);
                  })
            }else{
               reject("MTF already already exist. please check MTF list"); 
               
            }
        })
    })
  }

  GetLocalTransaction(Id: number) : Promise<MaterialTransferHeader>
{

  return new Promise((resolve,reject)=>{
        this.dbUtilities.getdbConnection().then(db=>{
        
              db.get("select * from MaterialTransferHeader where Id = ?",[Id])
              .then(row=>{
              
                if(row.length > 0){
                 
                  let model : MaterialTransferHeader = new MaterialTransferHeader();
                  model.CompanyId = row[1];
                  model.Id = row[2];
                  model.Reference = row[3];
                  model.Date = row[4];
                  model.From = row[5];
                  model.To = row[6];
                  model.PartsTransferRequestId = row[7]
                  model.CISReference= row[8];
                  model.BranchId = row[9];
                  model.Status = row[10];
                  model.TransferMode = row[11];
                  model.ReceiptNumber = row[12];
                  model.Instructions = row[13];
                  model.PreparedBy = row[14];
                  model.ApprovedBy = row[15];
                  model.CreateDate = row[16];
                  model.LastModifiedDate = row[17];
                  model.CreateUser = row[18];
                  model.LastModifiedUser = row[19]

           
                  return model;
                  
                }
              },error=>{
                  reject("Error in getting Material Transfer from local DB");

              }).then((headerModel : MaterialTransferHeader) =>{
       
                let mtfDetailList : MaterialTransferDetails[]=[];
                  db.each("select * from MaterialTransferDetail where MaterialsTransferHeaderId = ?",[headerModel.Id],function(err,row){
                      let detailModel : MaterialTransferDetails = new MaterialTransferDetails();
                     
                      detailModel.Id = row[1];
                      detailModel.MaterialsTransferHeaderId = row[2];
                      detailModel.PartNumber = row[3];
                      detailModel.PartCategory = row[4];
                      detailModel.PartDescription = row[5];
                      detailModel.Quantity = row[6];
                      detailModel.UnitOfMeasure = row[7];
                      detailModel.Remarks = row[8];
                      detailModel.ReceivedQuantity = row[9]
                      mtfDetailList.push(detailModel);
                   
                  })
                  headerModel.MaterialsTransferDetails=mtfDetailList;
                
                  return headerModel
              }).then(headerModelWithDetails =>{
              
                resolve(headerModelWithDetails);
              });
        })
  })
  }

  uploadMaterialTransferUpdate(id : number) : Promise<boolean>{
    return new Promise((resolve,reject)=>{
      
          this.GetLocalTransaction(id).then(localData =>{
           
          
              if(localData){
              
                  if(!localData.ReceiptNumber.trim()){
                
                      reject("Receipt number is required for closing MTF");
                  }else{
                    console.log(`accessing HTTP  ${id}`)
                          let url = `${this.env.getCompanyUrl(localData.CompanyId)}${this.controllerAddress}/ClosedMaterialTransfer`;
                          this.httpClient.put<MaterialTransferHeader>(url,localData).subscribe(data=>{
                            console.log(`return HTTP  ${id}`)
                            if(data){
                                this.deleteMaterialtransfer(id).then(row=>{
                                  resolve(true);
                                },error =>{
                                  reject(`delete transaction error: ${error}`)
                                })
                              }
                          },error=>{
                            reject(`server error: ${error.error.Message}`);
                          })
                  }
              }
          });
    });
  }


  updateMaterialTransferAndUpload(Id : number,recvNoticeReference : string): Promise<boolean>
  {

    return new Promise((resolve,reject)=>{
       
          this.dbUtilities.getdbConnection().then(db=>{
            
              db.execSQL("update MaterialTransferHeader set ReceiptNumber = ? where Id = ?",[recvNoticeReference,Id])
              .then(id =>{
               
                    this.uploadMaterialTransferUpdate(Id).then(uploadRes =>{
                      
                        resolve(true);
                    },error=>{

                      reject(`error in uploading MTF RN: ${error}`)
                    });
              },error=>{

                reject(`error in updating MTF RN: ${error}`)
              })

          },error =>{
            reject(`error in getting database connection MTF RN: ${error}`)
          })
    })

      



  }






  updateMtfRecieveQuantity(lineItemId : number , quantity: number) : Promise<boolean> {
      return new Promise((resolve,reject)=>{
            this.dbUtilities.getdbConnection().then(db=>{
              db.execSQL("UPDATE MaterialTransferDetail set ReceivedQuantity = ? where id = ?",[quantity,lineItemId]).
              then(row=>{
                console.log("update row success")
                resolve(true)
              },error =>{
                reject(`update line item failed: ${error}`);
              })
            })
      });     
  }





 GetLocalMaterialTransferList() : Promise<MaterialTransferHeader[]>{
    return new Promise((resolve,reject)=>{
       this.dbUtilities.getdbConnection().then(db=>{
              db.all("select Id from MaterialTransferHeader").then(async rows =>{
               
                let modelList :MaterialTransferHeader[] = []; 
              
                if(rows.length > 0){
                



                  for(const dataResult of rows){
                        let CurrentRowIds = dataResult[0];
                   
                        
                        await this.GetLocalTransaction(CurrentRowIds).then(mod =>{
                        
                          modelList.push(mod);
                        },error=>{
                          reject(`error getting mtf Id: ${CurrentRowIds} : ${ error }`)
                        })
                  }
                
               }

               return modelList;
  
              },error =>{
                reject(`Error getting all MTF header: ${error}`);
              }).then(returnModel =>{

                  resolve(returnModel)
              })
        })
    })
  }
}
