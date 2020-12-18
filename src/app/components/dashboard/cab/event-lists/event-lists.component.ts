import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TrainerService } from 'src/app/services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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
  eventData:any[] = [];
  curSortDir: any = {};
  modalOptions:NgbModalOptions;
  closeResult: string;
  participantsTempList:any[] = [{}];
  participantsList:any[] = [{}];
  dataLoad: boolean = false;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService, public _trainerService:TrainerService, private modalService: NgbModal) { }

  ngOnInit() {
    this.curSortDir['course']                       = false;
    this.curSortDir['created_date']             = false;
    this.curSortDir['accr_status']             = false;
    this.curSortDir['applicantName']             = false;
    this.curSortDir['criteria_request']             = false;
    this.curSortDir['form_meta']             = false;
    this.curSortDir['location']             = false;

    this.participantsTempList = [{'name':'Test test','email':'test@test.com','phone':89898989},{'name':'Test2 test2','email':'test2@test2.com','phone':56756756657},{'name':'Test3 test','email':'test3@test3.com','phone':787686778}];

    this.loadPageData();
  }

  loadPageData() {
    this.loader = false;
    var id = 'all';
    this.subscriptions.push(this._trainerService.getAllEventList()
      .subscribe(
        result => {
          this.loader = true;
          this.dataLoad = true;

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
        if(sortBy === 'course'){
          //console.log(">>>Enter type...");
          this.curSortDir.course = !sortDir;
          if(this.curSortDir.course){
            let array = data.slice().sort((a, b) => (a.course > b.course) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.course){
            let array = data.slice().sort((a, b) => (a.course < b.course) ? 1 : -1)
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

  open(content,arr:any[]) {
    // console.log(key)
    //this.voucherSentData = {};
    // if(id){
    //   console.log(">>ID: ", id);
    //   this.voucherSentData['accreditation'] = id;
    //   this.voucherSentData['index'] = key;
    //   this.voucherIndex = key
    // }
    // this.paymentReceiptValidation = null;
    this.participantsList = arr;

    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
