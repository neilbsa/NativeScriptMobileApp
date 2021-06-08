import {PurchaseOrderDetailModel} from './purchase-order-detail-model';


export class PurchaseOrderModel {
/**
 *
 */
constructor() {
    this.Details = [];
    


}
    Id: number;
    MaterialsBatchId? : number;
    CompanyId : string;
    Reference: string;
    ExternalReference: string;
    PurchaseType: string;
    Date : Date;
    ProductSupplierId : string;
    Principal : string;
    CurrencyId: string;
    OrderClass : string;
    BranchId: string;
    WareHouseId: string;
    Instructions: string;
    Attention:string;
    Remarks:string;
    ExpectedArrivalDate?: Date;
    Terms: string;
    Address:string;
    Amount: number;
    Status:string;
    UserDefined1: string;
    UserDefined2: string;
    CreateDate?: Date;
    LastModifiedDate?: Date;
    CreateUser : string;
    LastModifiedUser : string;
    ServiceProductLineId?: number;
    Details : PurchaseOrderDetailModel[];
}
