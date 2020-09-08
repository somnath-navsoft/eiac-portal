import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cab-training-public-course-list',
  templateUrl: './cab-training-public-course-list.component.html',
  styleUrls: ['./cab-training-public-course-list.component.scss']
})
export class CabTrainingPublicCourseListComponent implements OnInit {

  subscriptions: Subscription[] = [];
  pageDetails: any[]= [];
  loaderData: boolean = false;
  
  constructor(public _service: AppService, public _constant:Constants, public _trainerService: TrainerService) { }

  ngOnInit() {
    this.loadData()
  }
  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  //Load Data
  loadData(){
    this.loaderData = true;
    this.subscriptions.push(this._trainerService.getTrainerCourseTypeDetails()
    .subscribe(
       result => {
         let data: any = result;
         this.pageDetails = data.data;
         this.loaderData = false;
         //console.log(">>>>List REcord: ", this.pageDetails);
       }
    ));
  }

}
