import { Injectable, OnInit } from '@angular/core';
import { Dialogs } from '@nativescript/core';
import { environment } from './../../../environments/environment.dev'
//import Sqlite from 'nativescript-sqlite';
let Sqlite = require('nativescript-sqlite');
@Injectable({
  providedIn: 'root'
})
export class DatabaseUtilService {

 constructor() { }
private databaseName : string = 'civiclocal.db';
private env : environment = new  environment();

private dbInitScript : string[] = [
  `
  CREATE TABLE IF NOT EXISTS UserTbl(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT,
    UserToken TEXT,
    TokenExpiration TEXT,
    Issuer TEXT
    ) `,
    `
    
    CREATE TABLE IF NOT EXISTS PurchaseOrder(
      LocalId INTEGER PRIMARY KEY AUTOINCREMENT,
      Id,
      MaterialsBatchId INTEGER NULL,
      CompanyId  TEXT,
      Reference TEXT,
      ExternalReference TEXT,
      PurchaseType TEXT,
      Date DATETIME,
      ProductSupplierId  TEXT,
      Principal  TEXT,
      CurrencyId TEXT,
      OrderClass  TEXT,
      BranchId TEXT,
      WareHouseId TEXT,
      Instructions TEXT,
      Attention TEXT,
      Remarks TEXT,
      ExpectedArrivalDate TEXT,
      Terms TEXT,
      Address TEXT,
      Amount REAL,
      Status TEXT,
      UserDefined1 TEXT,
      UserDefined2 TEXT,
      CreateDate Date NULL,
      LastModifiedDate TEXT,
      CreateUser TEXT,
      LastModifiedUser TEXT,
      ServiceProductLineId INTEGER NULL
    )`,
    `
    CREATE TABLE IF NOT EXISTS PurchaseOrderDetails(
   
    LocalId INTEGER PRIMARY KEY AUTOINCREMENT,
    LocalPOheadId INTEGER,
    Id INTEGER,
    MaterialsPurchaseOrderId INTEGER NOT NULL,
    ProductMasterId INTEGER,
    PartNumber TEXT,
    PartCategory TEXT,
    PartDescription TEXT,
    Quantity INTEGER,
    ReceivedQuantity INTEGER,
    InTransitQuantity INTEGER,
    AllocatedQuantity INTEGER,
    UnitOfMeasure TEXT,
    SellingPrice REAL,
    Remarks TEXT,
    CaseNo TEXT,
    ProdNumber  TEXT
    )`,
    `
    CREATE TABLE IF NOT EXISTS TransactionComment(
   
    LocalId INTEGER PRIMARY KEY AUTOINCREMENT,
    Id INTEGER,
    TransactionId INTEGER NOT NULL,
    Detail1 TEXT,
    Detail2 TEXT,
    Detail3 TEXT,
    Detail4 TEXT,
    NumericDetail INTEGER,
    NumericDetail1 INTEGER,
    NumericDetail2 INTEGER,
    NumericDetail3 INTEGER,
    NumericDetail4 INTEGER,
    UploadFilesDetails INTEGER
    )`,
    `
    CREATE TABLE IF NOT EXISTS FileRepository(
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      ContentType TEXT,
      ContentLenght INTEGER,
      FileName TEXT,
      Base64String TEXT
    )`,
    `
    CREATE TABLE IF NOT EXISTS MaterialTransferHeader(
        LocalId INTEGER PRIMARY KEY AUTOINCREMENT,
        CompanyId  TEXT,
        Id INTEGER,
        Reference TEXT,
        MTFDate Date NULL,
        WHFrom TEXT,
        WHTo TEXT,
        PartsTransferRequestId TEXT,
        CISReference TEXT,
        BranchId TEXT,
        Status TEXT,
        TransferMode TEXT,
        ReceiptNumber TEXT,
        Instructions TEXT,
        PreparedBy TEXT,
        ApprovedBy TEXT,
        CreateDate DATE NULL,
        LastModifiedDate DATE NULL,
        CreateUser TEXT,
        LastModifiedUser TEXT
    )`,
    `
    CREATE TABLE IF NOT EXISTS MaterialTransferDetail(
      LocalId INTEGER PRIMARY KEY AUTOINCREMENT,
      Id INTEGER,
      MaterialsTransferHeaderId INTEGER,
      PartNumber TEXT, 
      PartCategory TEXT,
      PartDescription TEXT,
      Quantity INTEGER,
      UnitOfMeasure TEXT,
      Remarks TEXT,
      ReceivedQuantity INTEGER
    )`

 ];

private showToast(message: string): void{

  const alertOptions = {
    title: 'Warning',
    message: message,
    okButtonText: 'Okay',
    cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
  }

  Dialogs.alert(alertOptions).then(test =>{
     console.log(test);
  });


}


  databaseInit() {
    this.getdbConnection().then(conn=>{
      this.dbInitScript.forEach(script =>{
        conn.execSQL(script).then(id =>{
          console.log(id)
        }).catch((error)=>{
           console.log(error)
        })
      })
    }).finally(()=>{
      this.closedbConnection();
    }).catch(error=>{
      this.showToast("Initiating db sequence denied")
    });
  }

 getdbConnection() : Promise<any> {
    return new Sqlite(this.databaseName);
  }

 closedbConnection() 
  {
    new Sqlite(this.databaseName)
    .then((db) => {
        db.close();
    });
  }


}
