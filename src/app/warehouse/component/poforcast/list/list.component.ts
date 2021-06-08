import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Dialogs, ObservableArray, View } from '@nativescript/core';
import { PurchaseOrderModel } from '~/app/warehouse/Models/purchase-order-model';
import { ForcastServiceService } from '~/app/warehouse/services/forcast-service.service';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';
import { ListViewEventData } from 'nativescript-ui-listview';
import { layout } from '@nativescript/core/utils';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit,OnDestroy {

  purchaseOrders : PurchaseOrderModel[] = [];
  private _localPurchaseOrderObeservable: ObservableArray<PurchaseOrderModel>;
  private leftThresholdPassed = false;
  private rightThresholdPassed = false;
  
  @ViewChild("purchaseOrderListView", { read: RadListViewComponent, static: false }) myListViewComponent: RadListViewComponent;




  constructor(
    private route : RouterExtensions,
    private forcastService : ForcastServiceService) { }


  ngOnDestroy(): void {
   
  }

 
  ngAfterViewInit(): void {
     
  }


  ngOnInit(): void {
    this.refreshMainList();
  }

  get dataItems(): ObservableArray<PurchaseOrderModel> {
    return this._localPurchaseOrderObeservable;
  } 
  



  navigateBack(){
    this.route.backToPreviousPage();
  }


refreshMainList(){
  this.forcastService.GetAllLocalForcastPO().then((row)=>{
     
    this.purchaseOrders = row.slice();
    this._localPurchaseOrderObeservable = new ObservableArray(row.slice())
  })
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



  onItemTap(evt):void{
    var id = this.purchaseOrders[evt.index].Id;
   this.route.navigate(['warehouse','forcastdetail',id]);
  }



  onNavItemTap(navItemRoute: string): void {
    this.route.navigate([navItemRoute], {
        transition: {
            name: "fade",
        },
        clearHistory: true
    });

  } 

  onSwipeCellFinished(args: ListViewEventData){
    const swipeView = args['object'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
    var currentItem = this.dataItems.getItem(args.index) 
  console.log('onSwipeCellFinished triggered')
    if (this.leftThresholdPassed) {
     
      Dialogs.confirm({
          title: "Upload",
          message: "Are you sure you want to upload update?",
          okButtonText: "Yes",
          cancelButtonText: "No",
      }).then(res=>{
        if(res){
              this.forcastService.uploadUpdate(currentItem.Id).then(res=>{
                  this.showToast('Upload success');
                  this.refreshMainList();
              },error =>{
                console.log(error);
                this.showToast(`error in uploading update: ${error}` )
              })
        }
      });
    } else if (this.rightThresholdPassed) {
      Dialogs.confirm({
        title: "Delete",
        message: "Are you sure you want to delete forcasted-PO?",
        okButtonText: "Yes",
        cancelButtonText: "No",
    }).then(res =>{
      console.log(res);
      if(res){
              this.forcastService.cancelUpdate(currentItem.Id).then(res=>{
                this.refreshMainList();
              },error =>{
                this.showToast(error);
                throwError(`cancelUpdate failed: ${error}`)
              })
      }
    });
    }
    this.leftThresholdPassed = false;
    this.rightThresholdPassed = false;
  }

  public onSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args['object'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
    swipeLimits.left = swipeLimits.right = args.data.x > 0 ? swipeView.getMeasuredWidth() / 2 : swipeView.getMeasuredWidth() / 2;
    swipeLimits.threshold = swipeView.getMeasuredWidth();
    console.log(swipeLimits);
}


 
 

  onCellSwiping(args: ListViewEventData){
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args['swipeView'];
    const mainView = args['mainView'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
 
    
    if (args.data.x > swipeView.getMeasuredWidth() / 4 && !this.leftThresholdPassed) {
        console.log("Notify perform left action");
        //const markLabel = leftItem.getViewById('mark-text');
        this.leftThresholdPassed = true;
    } else if (args.data.x < -swipeView.getMeasuredWidth() / 4 && !this.rightThresholdPassed) {
       // const deleteLabel = rightItem.getViewById('delete-text');
        console.log("Notify perform right action");
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




  
}
