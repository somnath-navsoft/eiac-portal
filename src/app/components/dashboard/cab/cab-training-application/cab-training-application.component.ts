import { Component, OnInit, OnDestroy } from '@angular/core';

import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cab-training-application',
  templateUrl: './cab-training-application.component.html',
  styleUrls: ['./cab-training-application.component.scss']
})
export class CabTrainingApplicationComponent implements OnInit  {
  
  subscriptions: Subscription[] = [];
  pageDetails: any[]= [];
  loaderData: boolean = false;
  userType: any;
  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.userType = sessionStorage.getItem('type');
    this.loadData()
  }
  ngOnDestroy(){ 
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  //Load Data
  loadData(){
    this.loaderData = true;
    this.subscriptions.push(this._trainerService.getTrainerPageDetails()
    .subscribe(
       result => {
        console.log(">>>>course: ", result);
         let data: any = result;
         this.pageDetails = data.pageData;
         this.loaderData = false;
         
       }
    ));
  }

}
