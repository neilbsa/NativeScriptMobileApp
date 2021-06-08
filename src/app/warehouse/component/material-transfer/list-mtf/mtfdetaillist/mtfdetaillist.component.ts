import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Dialogs,prompt, inputType, ObservableArray, PromptOptions, View, PromptResult } from '@nativescript/core';
import { layout } from '@nativescript/core/utils';
import { ListViewEventData } from 'nativescript-ui-listview';
import { MaterialTransferDetails } from '~/app/warehouse/Models/material-transfer-details';
import { MaterialTransferHeader } from '~/app/warehouse/Models/material-transfer-header';
import { MaterialTransferService } from '~/app/warehouse/services/material-transfer.service';

@Component({
  selector: 'app-mtfdetaillist',
  templateUrl: './mtfdetaillist.component.html',
  styleUrls: ['./mtfdetaillist.component.css']
})
export class MtfdetaillistComponent implements OnInit,AfterViewInit {
  currentMaterialTransfer: MaterialTransferHeader;
  materialtransferDetailList :MaterialTransferDetails[] = [];
  private leftThresholdPassed = false;
  private rightThresholdPassed = false;
  private _localMTFObservable: ObservableArray<MaterialTransferDetails>;


  
  constructor(
    private route : RouterExtensions,
    private matlService : MaterialTransferService,
    private activatedRoute : ActivatedRoute
  ) { }


  ngAfterViewInit(): void {
   
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id'];
      this.matlService.GetLocalTransaction(+id).then(res=>{
        this.currentMaterialTransfer = res;
        this.materialtransferDetailList = res.MaterialsTransferDetails.slice();
        this._localMTFObservable =new ObservableArray(this.materialtransferDetailList);
      })

    })
  }




  handleItemUpdate(id : number, quantity : number) {
    this.matlService.updateMtfRecieveQuantity(id,quantity).then(res=>{
      if(res){
       
         let itemIndex = this.dataItems.findIndex(function (x, i, obs) { return x.Id === id; });
        let dataPoolItem = this.dataItems.getItem(itemIndex);
        dataPoolItem.ReceivedQuantity = quantity;
      }
    },error =>{
      alert(error);
    })
  }


  
  handleLeftFunction(currentItem: any) {
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
  }
  handleRightFunction(currentItem: any) {
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



  get dataItems(): ObservableArray<MaterialTransferDetails> {
    return this._localMTFObservable;
  } 


  navigateBack(){
    this.route.backToPreviousPage();
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


  onSwipeCellFinished(args: ListViewEventData){
    const swipeView = args['object'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
    var currentItem = this.dataItems.getItem(args.index) 
  console.log('onSwipeCellFinished triggered')
    if (this.leftThresholdPassed) {
     
      this.handleLeftFunction(currentItem);

    } else if (this.rightThresholdPassed) {
     
        this.handleRightFunction(currentItem);

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
