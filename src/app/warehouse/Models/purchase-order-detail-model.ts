export class PurchaseOrderDetailModel {
    Id: number;
    MaterialsPurchaseOrderId : number;
    ProductMasterId? : number;
    PartNumber :string;
    PartCategory : string;
    PartDescription :string;
    Quantity : number;
    ReceivedQuantity : number;
    InTransitQuantity : number;
    AllocatedQuantity: number;
    UnitOfMeasure:string;
    SellingPrice: number;
    Remarks: number;
    CaseNo: String;
    ProdNumber : String;
}
