import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-event-lists',
  templateUrl: './event-lists.component.html',
  styleUrls: ['./event-lists.component.scss']
})
export class EventListsComponent implements OnInit {

  loader:boolean = true;
  subscriptions: Subscription[] = [];
  paginationConfig: any;
  pageLimit: number = 10;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;
  eventData:any;
  curSortDir: any = {};

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService, public _trainerService:TrainerService) { }

  ngOnInit() {
    this.curSortDir['id']                       = false;
    this.curSortDir['created_date']             = false;
    this.curSortDir['accr_status']             = false;
    this.curSortDir['applicantName']             = false;
    this.curSortDir['criteria_request']             = false;
    this.curSortDir['form_meta']             = false;
    this.curSortDir['location']             = false;
  }

  loadPageData() {
    this.loader = false;
    var id = 'all';
    this.subscriptions.push(this._trainerService.getAccreditationStatusList(id)
      .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          // console.log('Data load...', data.records);
          
          this.eventData = data.records;
          dataRec = data.records;
          this.pageTotal = data.records.length;
        },
        ()=>{
          // console.log('comp...');
        }
      )          
    )
  }

  sortedList(data: any, sortBy: string, sortDir: boolean){
    //true - asc / false - desc
    ////console.log('>>>', data);
    if(data.length){
        if(sortBy === 'id'){
          //console.log(">>>Enter type...");
          this.curSortDir.id = !sortDir;
          if(this.curSortDir.id){
            let array = data.slice().sort((a, b) => (a.id > b.id) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.id){
            let array = data.slice().sort((a, b) => (a.id < b.id) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }
        //By created_date
        if(sortBy == 'created_date'){
          this.curSortDir.created_date = !sortDir;
          //console.log(">>>Enter code...", data, " -- ", this.curSortDir.course_code);
          if(this.curSortDir.created_date){
            let array = data.slice().sort((a, b) => (a.created_date > b.created_date) ? 1 : -1)
            this.eventData = array;
            //console.log("after:: ", array, " :: ", this.eventData);
          }
          if(!this.curSortDir.created_date){
            let array = data.slice().sort((a, b) => (a.created_date < b.created_date) ? 1 : -1)
            this.eventData = array;
          }
        }
        //By accr_status
        if(sortBy == 'accr_status'){
          this.curSortDir.accr_status = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.accr_status){
            let array = data.slice().sort((a, b) => (a.accr_status > b.accr_status) ? 1 : -1)
            this.eventData = array;
            //console.log("after:: ", array, " :: ", this.eventData);
          }
          if(!this.curSortDir.accr_status){
            let array = data.slice().sort((a, b) => (a.accr_status < b.accr_status) ? 1 : -1)
            this.eventData = array;
          }
        }
        //By Prelim Status
        if(sortBy == 'applicantName'){
          this.curSortDir.applicantName = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.applicantName){
            let array = data.slice().sort((a, b) => (a.applicantName > b.applicantName) ? 1 : -1)
            this.eventData = array;
            //console.log("after:: ", array, " :: ", this.eventData);
          }
          if(!this.curSortDir.applicantName){
            let array = data.slice().sort((a, b) => (a.applicantName < b.applicantName) ? 1 : -1)
            this.eventData = array;
          }
        }
        //By criteria_request
        if(sortBy == 'criteria_request'){
          this.curSortDir.criteria_request = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.criteria_request){
            let array = data.slice().sort((a, b) => (a.criteria_request > b.criteria_request) ? 1 : -1)
            this.eventData = array;
            //console.log("after:: ", array, " :: ", this.eventData);
          }
          if(!this.curSortDir.criteria_request){
            let array = data.slice().sort((a, b) => (a.criteria_request < b.criteria_request) ? 1 : -1)
            this.eventData = array;
          }
        }

        //By form_meta
        if(sortBy == 'form_meta'){
          this.curSortDir.form_meta = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.form_meta){
            let array = data.slice().sort((a, b) => (a.form_meta > b.form_meta) ? 1 : -1)
            this.eventData = array;
            //console.log("after:: ", array, " :: ", this.eventData);
          }
          if(!this.curSortDir.form_meta){
            let array = data.slice().sort((a, b) => (a.form_meta < b.form_meta) ? 1 : -1)
            this.eventData = array;
          }
        }
        //By Payment Status
        // if(sortBy == 'payment_status'){
        //   this.curSortDir.payment_status = !sortDir;
        //   //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
        //   if(this.curSortDir.payment_status){
        //     let array = data.slice().sort((a, b) => (a.payment_status > b.payment_status) ? 1 : -1)
        //     this.eventData = array;
        //     //console.log("after:: ", array, " :: ", this.eventData);
        //   }
        //   if(!this.curSortDir.payment_status){
        //     let array = data.slice().sort((a, b) => (a.payment_status < b.payment_status) ? 1 : -1)
        //     this.eventData = array;
        //   }
        // }  
        if(sortBy == 'location'){
          this.curSortDir.location = !sortDir;
          //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
          if(this.curSortDir.location){
            let array = data.slice().sort((a, b) => (a.location > b.location) ? 1 : -1)
            this.eventData = array;
            //console.log("after:: ", array, " :: ", this.eventData);
          }
          if(!this.curSortDir.location){
            let array = data.slice().sort((a, b) => (a.location < b.location) ? 1 : -1)
            this.eventData = array;
          }
        }        
    }
  }
}
