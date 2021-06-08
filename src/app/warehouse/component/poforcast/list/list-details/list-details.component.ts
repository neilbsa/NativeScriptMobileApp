import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions  } from '@nativescript/angular';
import { action, Dialogs, ObservableArray, prompt, View } from '@nativescript/core';
import { layout } from '@nativescript/core/utils';
import { ListViewEventData } from 'nativescript-ui-listview';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PurchaseOrderDetailModel } from '~/app/warehouse/Models/purchase-order-detail-model';
import { PurchaseOrderModel } from '~/app/warehouse/Models/purchase-order-model';
import { ForcastServiceService } from '~/app/warehouse/services/forcast-service.service';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';
import { inputType, PromptOptions, PromptResult } from '@nativescript/core/ui/dialogs/dialogs-common';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css']
})
export class ListDetailsComponent implements OnInit,OnDestroy {
  paramSubcription : Subscription
  filterSubcription : Subscription
  private leftThresholdPassed = false;
  private rightThresholdPassed = false;
  currentSelectedPurchaseOrder : PurchaseOrderModel;

 

  showFilter : boolean = false;
  caseNoValue = 'All';
  caseNos : String[] = [];
  prodNoValue = 'All';
  prodNos : String[] = [];

  currentOriginalSelectedPOdetails :PurchaseOrderDetailModel[] =[];
  currentSelectedPOdetails :PurchaseOrderDetailModel[] =[];
  subsCurrentSelectedPOdetails = new BehaviorSubject<PurchaseOrderDetailModel[]>(null);
  filterParam = new BehaviorSubject<string[]>([this.caseNoValue,this.prodNoValue]); 
 
 obsPOdetails = new ObservableArray<PurchaseOrderDetailModel>();
 
  @ViewChild("detailsListView", { read: RadListViewComponent, static: false }) myListViewComponent: RadListViewComponent;
  canNavigateBack: boolean=true;

  constructor(
    private route : RouterExtensions,
    private purchaseOrderService : ForcastServiceService,
    private activatedRoute : ActivatedRoute
  
    ) { }


  ngOnInit(): void {
      this.subsCurrentSelectedPOdetails.subscribe(res=>{
            this.currentSelectedPOdetails = res;
      })


      this.filterParam.subscribe(params =>{
        this.handleFiltrationActivity(params)
      })



     this.paramSubcription= this.activatedRoute.params.subscribe((params : HttpParams) =>{
        this.purchaseOrderService.GetLocalForcastHeader(+params['id']).then(res=>{
              this.currentSelectedPurchaseOrder=res;
              this.currentOriginalSelectedPOdetails = res.Details.slice();
              this.subsCurrentSelectedPOdetails.next(this.currentOriginalSelectedPOdetails);
              this.caseNos =["All",...new Set(this.currentSelectedPOdetails.map(a=>a.CaseNo))]
              this.prodNos =["All",...new Set(this.currentSelectedPOdetails.map(a=>a.ProdNumber))]
              this.obsPOdetails = new ObservableArray(this.currentOriginalSelectedPOdetails);
        })
      })
  } 



get dataItem () : ObservableArray<PurchaseOrderDetailModel>  {
  return this.obsPOdetails;
}



  handleFiltrationActivity(params: string[]) {
       let currentFiltered= this.currentOriginalSelectedPOdetails.filter(
          (g)=>{
            return (this.caseNoValue === 'All' || g.CaseNo === params[0]) &&
                    (this.prodNoValue === 'All' || g.ProdNumber === params[1]) 
    
            }
        ).slice();
        this.obsPOdetails = new ObservableArray(currentFiltered);
  }


  filterOnClick (value : string)
  {
        let choices = (value === 'Case') ? [...this.caseNos] : this.prodNos;
        let options = {
          title: "Select",
          message: "Choose your race",
          cancelButtonText: "Cancel",
          actions: <string[]>choices
        };
      action(options).then((result) => {
                
            if(result !== 'Cancel'){
              if(value === 'Case'){
                this.caseNoValue=result;
              }else{
                this.prodNoValue=result;
              }
            }
               
          
          }).finally(()=>{
            this.filterParam.next([this.caseNoValue, this.prodNoValue]);
          });
  }






 

  navigateBack(){
    if(this.canNavigateBack){
      this.route.backToPreviousPage();
    }
  }

 
  onCheckedChange(data){
    this.showFilter = data.value;
    this.canNavigateBack = !data.value;
  }





  onItemTap(d){
 
  }



  
  onSwipeCellFinished(args: ListViewEventData){
    const swipeView = args['object'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
    var currentItem = this.dataItem.getItem(args.index); 

    if (this.leftThresholdPassed) {
     
      Dialogs.confirm({
          title: "Update Full",
          message: "Are you sure you receive it fully?",
          okButtonText: "Yes",
          cancelButtonText: "No",
      }).then(res=>{
        if(res){
         console.log(res)
          console.log(currentItem)
          this.handleItemUpdate(currentItem.Id,currentItem.Quantity);
        }
      });
    } else if (this.rightThresholdPassed) {
      let options: PromptOptions = {
        title: "Partial",
        message: "Input quantity",
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        cancelable: true,
        inputType: inputType.number, 
        
    };
    
    prompt(options).then((result: PromptResult) => {
     
      if(result.result){
          this.handleItemUpdate(currentItem.Id,+result.text);
        }else{
          console.log('canceled inputted');
        }
    });


    }
    this.leftThresholdPassed = false;
    this.rightThresholdPassed = false;
  }




  




  handleItemUpdate(id : number, quantity : number) {
    this.purchaseOrderService.updateRecvQuantityLineItem(id,quantity).then(res=>{
      if(res){
        console.log(`id: ${id} quantity: ${ quantity }`);
        //update temp Heap
        // let currentUpdate = this.currentOriginalSelectedPOdetails.map(podet =>{

        //     podet.Id === id ? { ...podet, ReceivedQuantity : quantity } : podet;
        //     return podet;

        // })
        // this.currentOriginalSelectedPOdetails = currentUpdate;

        //update UI
         let itemIndex = this.dataItem.findIndex(function (x, i, obs) { return x.Id === id; });
        let dataPoolItem = this.dataItem.getItem(itemIndex);
        dataPoolItem.ReceivedQuantity = quantity;
       
    

      }
    },error =>{
      alert(error);
    })
  }


  

  

  onCellSwiping(args: ListViewEventData){
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args['swipeView'];
    const mainView = args['mainView'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
 
    
    if (args.data.x > swipeView.getMeasuredWidth() / 4 && !this.leftThresholdPassed) {
     
        this.leftThresholdPassed = true;
    } else if (args.data.x < -swipeView.getMeasuredWidth() / 4 && !this.rightThresholdPassed) {
  
        this.rightThresholdPassed = true;
    }
    if (args.data.x > 0) {
        const leftDimensions = View.measureChild(
            leftItem.parent,
            leftItem,
            layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
            layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY));
        View.layoutChild(leftItem.parent, leftItem, 0, 0, leftDimensions.measuredWidth, leftDimensions.measuredHeight);
    } else {
        const rightDimensions = View.measureChild(
            rightItem.parent,
            rightItem,
            layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
            layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY));

        View.layoutChild(rightItem.parent, rightItem, mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0, mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
    }
  }





  public onSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args['object'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
    swipeLimits.left = swipeLimits.right = args.data.x > 0 ? swipeView.getMeasuredWidth() / 2 : swipeView.getMeasuredWidth() / 2;
    swipeLimits.threshold = swipeView.getMeasuredWidth();

}





    ngOnDestroy(){

      // if(!this.paramSubcription.closed){
      //   this.paramSubcription.unsubscribe();
      // }

      // if(!this.filterSubcription.closed){
      //   this.filterSubcription.unsubscribe();
      // }
 
    
    }
}
