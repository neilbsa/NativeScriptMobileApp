import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Dialogs, prompt,inputType, ObservableArray, PromptOptions, View, PromptResult } from '@nativescript/core';
import { layout } from '@nativescript/core/utils';
import { ListViewEventData } from 'nativescript-ui-listview';
import { MaterialTransferHeader } from '~/app/warehouse/Models/material-transfer-header';
import { MaterialTransferService } from '~/app/warehouse/services/material-transfer.service';

@Component({
  selector: 'app-list-mtf',
  templateUrl: './list-mtf.component.html',
  styleUrls: ['./list-mtf.component.css']
})
export class ListMTFComponent implements OnInit,AfterViewInit  {


  materialtransferList : MaterialTransferHeader[] = []
  private _localMTFObservable: ObservableArray<MaterialTransferHeader>;
  private leftThresholdPassed = false;
  private rightThresholdPassed = false;
  

  constructor(
    private route : RouterExtensions,
    private matlMtfService : MaterialTransferService
    ) { }


  ngAfterViewInit(): void {
  
  }

  ngOnInit(): void {
    this.refreshMainList();
  }


  refreshMainList(){
    this.matlMtfService.GetLocalMaterialTransferList().then((row)=>{
      this.materialtransferList = row.slice();
      this._localMTFObservable = new ObservableArray(row.slice())
    })
  }

  get dataItems(): ObservableArray<MaterialTransferHeader> {
    return this._localMTFObservable;
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


  navigateBack(){
    this.route.backToPreviousPage();
  }

  handleUploadAction(currentItem){
    Dialogs.confirm({
      title: "Upload",
      message: "Are you sure you want to upload updates?",
      okButtonText: "Yes",
      cancelButtonText: "No",
  }).then(res=>{
    if(res){
      let options: PromptOptions = {
        title: "Partial",
        message: "Input Reciept Notice",
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        cancelable: true,
        inputType: inputType.text, 
    };
    prompt(options).then((result: PromptResult) => {
   
      if(result.result){
        console.log("prompt accessed success");
              if(result.text.trim()){
               this.matlMtfService.updateMaterialTransferAndUpload(+currentItem.Id,result.text.trim()).then(updateUploadRes=>{
                      if(updateUploadRes){
                         console.log("update success")
                          this.matlMtfService.deleteMaterialtransfer(currentItem.Id).then(deleteResult=>{
                            console.log("delete success")
                            if(deleteResult){
                              this.showToast("upload success");
                              this.refreshMainList();
                            }
                          },error=>{
                            this.showToast(`deleting local has error ${error  }`);
                          })
                      }
               },error=>{
                    this.showToast(`uploading has error: ${ error }`);
               })
              }else{
                this.showToast("cannot accept empty RN")
              }
        }else{
          console.log('canceled inputted');
        }
    })







         // this.matlMtfService.updateMaterialTransferAndUpload(currentItem.Id,)


      
        
    }
  });
  }


handleDeleteAction(currentItem){
  Dialogs.confirm({
    title: "Delete",
    message: "Are you sure you want to delete forcasted-PO?",
    okButtonText: "Yes",
    cancelButtonText: "No",
}).then(res =>{
  console.log(res);
  if(res){

    this.matlMtfService.deleteMaterialtransfer(currentItem.Id).then(res=>{
      this.refreshMainList();
    },error=>{
      this.showToast(`error getting local MTF: ${error}`)
    })
          // this.matlMtfService.deleteMaterialtransfer(currentItem.Id).then(res=>{
          //   this.refreshMainList();
          // },error =>{
          //   this.showToast(error);
          
          // })
  }
});
}




onItemTap(evt):void{
  var id = this.materialtransferList[evt.index].Id;
 this.route.navigate(['warehouse','mtfdetails',id]);
}







  onSwipeCellFinished(args: ListViewEventData){
    const swipeView = args['object'];
    const leftItem = swipeView.getViewById('upload-view');
    const rightItem = swipeView.getViewById('delete-view');
    var currentItem = this.dataItems.getItem(args.index) 
  console.log('onSwipeCellFinished triggered')
    if (this.leftThresholdPassed) {
     
      this.handleUploadAction(currentItem);

    } else if (this.rightThresholdPassed) {
     
        this.handleDeleteAction(currentItem);

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
