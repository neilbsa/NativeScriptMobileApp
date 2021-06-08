import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';



@Component({
  selector: 'app-poforcast',
  templateUrl: './poforcast.component.html',
  styleUrls: ['./poforcast.component.css']
})
export class PoforcastComponent implements OnInit {
  

  
  ngOnInit(): void {

  }

/**
 *
 */
constructor(private route : RouterExtensions, 
            private activatedRoute : ActivatedRoute
            ) { }

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
