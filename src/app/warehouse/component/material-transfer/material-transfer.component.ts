import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';

@Component({
  selector: 'app-material-transfer',
  templateUrl: './material-transfer.component.html',
  styleUrls: ['./material-transfer.component.css']
})
export class MaterialTransferComponent implements OnInit {

  constructor(private route : RouterExtensions, 
    private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
  }


  onTapNavigate(navitem){
    this.route.navigate(['warehouse',navitem],{
      transition: {
        name: 'fade',
      }
    });
  }
  
  navigateBack(){
    this.route.backToPreviousPage();
  }



}
