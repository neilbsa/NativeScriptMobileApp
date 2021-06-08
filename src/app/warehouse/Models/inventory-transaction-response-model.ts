import { WarehouseStatusCode } from "./warehouse-status-code";

export class InventoryTransactionResponseModel {

     Status :string;
     StatusMessage :string;
     LoadTableRow :string;
     ConfirmationId : string;
     Reference :string;
     RecvTransactionApplyId:number;
     AppliedAmount:number;
     UnAppliedAmount:number;
     NextStatus:string;
     UpdateDateTime:Date;
     CanOverride :boolean;
     WarehouseConfirmationCode : WarehouseStatusCode[];
     transactionType : string;
     transactionId : number;
     companyId : string;
}



