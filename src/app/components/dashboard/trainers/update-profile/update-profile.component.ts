import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  emailForm: any= {};
  constructor() { }

  ngOnInit() {
    this.emailForm['email'] = '';
  }

  onStep1Next(event: any){
    //console.log(">>Form 1 :", event);
  }
  onStep2Next(event: any){
    //console.log(">>Form 2 :", event);
  }
  onStep3Next(event: any){
    //console.log(">>Form 3 :", event);
  }

  onComplete(event: any){
    //console.log(">>Complete :", event);
  }

}
