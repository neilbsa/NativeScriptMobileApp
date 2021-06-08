import { MaterialTransferDetails } from "./material-transfer-details";

export class MaterialTransferHeader {

    public CompanyId : string;
    public Id : number;
    public  Reference :string;
    public Date :Date;
    public  From :string;
    public  To :string;
    public  PartsTransferRequestId? : number;
    public  CISReference :string ;
    public  BranchId :string;
    public  Status :string;
    public  TransferMode :string;
    public  ReceiptNumber :string;
    public  Instructions :string
    public  PreparedBy:string;
    public  ApprovedBy :string;
    public  CreateDate? :Date
    public  LastModifiedDate? : Date;
    public  CreateUser :string;
    public  LastModifiedUser :string
    public  MaterialsTransferDetails :MaterialTransferDetails[]


}
