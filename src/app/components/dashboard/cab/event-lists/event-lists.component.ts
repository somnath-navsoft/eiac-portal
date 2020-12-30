import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TrainerService } from 'src/app/services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

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
  detailsCourse:any;
  detailsDate:any;
  noOfParticipants:any;
  exportAsConfig: ExportAsConfig;
  exportAs:any = {};
  eventTitle:any;
  show_data:any;
  advSearch: boolean = false;
  userType:any;
  event_date:any;
  minDate:any;
  searchDateData: any = {};
  searchText:any;
  selectStatus:any = [];
  searchValue:any;
  trainerEvent:any;
  targetAudarr:any = [];
  tutorListarr:any = [];
  
  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService, public _trainerService:TrainerService, private modalService: NgbModal, private exportAsService: ExportAsService) { }

  ngOnInit() {
    // console.log(this.event_date);
    this.userType = sessionStorage.getItem('type');
    this.curSortDir['course']                       = false;
    this.curSortDir['audience']                       = false;    
    this.curSortDir['created_date']             = false;
    this.curSortDir['accr_status']             = false;
    this.curSortDir['applicantName']             = false;
    this.curSortDir['criteria_request']             = false;
    this.curSortDir['form_meta']             = false;
    this.curSortDir['location']             = false;

    this.participantsTempList = [{'name':'Test test','email':'test@test.com','phone':89898989},{'name':'Test2 test2','email':'test2@test2.com','phone':56756756657},{'name':'Test3 test','email':'test3@test3.com','phone':787686778}];

    this.loadPageData();
    this.loadTargetAud();
  }

  loadTargetAud() {
    this.subscriptions.push(this._trainerService.searchTargetAud()
      .subscribe(
        result => {
          // console.log(result,'cvbcbvvcbvb');
          this.targetAudarr = result['records']['target_aud'];
          this.tutorListarr = result['records']['tutor_list'];
        },
        ()=>{
          // console.log('comp...');
        }
      )          
    )
  }

  searchableColumn() {
    this.searchText = '';
    var myClasses = document.querySelectorAll('.field_show'),
          i = 0,
          l = myClasses.length;
       for (i; i < l; i++) {
          let elem: any = myClasses[i]
          elem.style.display = 'none';
      }
    if(this.searchValue == 'course_title') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'targetAudId') {
      document.getElementById('targetAudId').style.display = 'block';
    }else if(this.searchValue == 'event_type') {
      document.getElementById('event_type').style.display = 'block';
    }else if(this.searchValue == 'event_date') {
      document.getElementById('event_date').style.display = 'block';
    }else if(this.searchValue == 'tutor_id') {
      document.getElementById('tutor_id').style.display = 'block';
    }else if(this.searchValue == 'capacity') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'training_days') {
      document.getElementById('applicant').style.display = 'block';
    }
  }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  showData() {
    //this.pageLimit = this.show_data;
    // this.loadPageData();
    // this.pageLimit = this.show_data;
    // this.pageCurrentNumber = 1;
    // this.eventData.slice(0, this.show_data);

    if(this.show_data != 'all'){
      this.pageLimit = this.show_data;
      this.pageCurrentNumber = 1;
      this.eventData.slice(0, this.show_data);
    }else{
      console.log('....');
      this.pageLimit = this.pageTotal;
      this.pageCurrentNumber = 1;
      this.eventData.slice(0, this.pageTotal);
    }
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
    this.filterSearchReset();
  }
  
  filterSearchReset(type?: string){
    this.searchValue = {};
    this.searchText = '';
    var myClasses = document.querySelectorAll('.field_show'),
          i = 0,
          l = myClasses.length;
       for (i; i < l; i++) {
          let elem: any = myClasses[i]
          elem.style.display = 'none';
      }
    document.getElementById('applicant').style.display = 'block';
    
    //Reset serach
    this.eventTitle = '' || null;
    if(type != undefined && type != ''){
      this.loadPageData();
    }
  }

  paginationReset() {
    this.exportAs = {};
  }

  isValidSearch(){
    if((this.searchValue == '' || this.searchValue == null) || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
    let postObject: any = new FormData();
     //console.log("Search click....");
     if(this.isValidSearch()){
      //  if(this.applicationNo != '' && this.applicationNo != null){
      //   postObject.append('id', this.applicationNo);
      //  }
      //  if(this.selectAccrTypeValue != '' && this.selectAccrTypeValue != null){
      //   postObject.append('form_meta', this.selectAccrTypeValue);
      //  }
      var appendKey = this.searchValue;
       if(this.searchValue != '' && this.searchValue != null && this.searchText != '' && this.searchText != null){

        if(this.searchValue == 'event_date') {
          let dtFormat: string = '';

          var dtData = this.searchText._i;
          var year = dtData.year;
          var month = dtData.month + 1;
          var date = dtData.date;
          dtFormat = year + "-" + month + "-" + date;

          postObject.append(appendKey, dtFormat);
        }else{
          postObject.append(appendKey, this.searchText);
        }
        
       }

        if(postObject){
          this.loader = false;
          this.subscriptions.push(this._trainerService.searchEventlist((postObject))
          .subscribe(
            result => {
              this.loader = true;
              let data: any = result;
                console.log("search results: ", result);
                this.loader = true;
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    console.log(">>> Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
                    this.eventData = data.records;
                    this.pageTotal = data.records.length;
                }
                if(data != undefined && typeof data === 'object' && data.records.length == 0){
                  this.eventData = data.records;
                  this.pageTotal = data.records.length;
                }
            }
            )
          )
        }

    }else{
      //this._service.openMessageDialog('Please select search fields properly.', "Validation Error");
      this.toastr.warning("Please select search fields properly",'')
    }     
  }

  exportFile() {
    // console.log(this.exportAs);
    this.exportAsConfig = {
      type: 'csv', // the type you want to download
      elementIdOrContent: 'accreditation-service-export', // the id of html/table element
    }
    // let fileName: string = (this.exportAs.toString() == 'xls') ? 'accreditation-service-report' : 
    this.exportAsService.save(this.exportAsConfig, 'report').subscribe(() => {
      // save started
    });
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
          data.records.forEach((item, key) =>{
               if(item.course != undefined && item.course.allTargatedAud  != undefined && item.course.allTargatedAud.length > 0){
                data.records[key]['audName'] = item.course.allTargatedAud[0].target_aud_name.title;
               }
          })          
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
            let array = data.slice().sort((a, b) => (a.course.course > b.course.course) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.course){
            let array = data.slice().sort((a, b) => (a.course.course < b.course.course) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }

        if(sortBy === 'audience'){
          //console.log(">>>Enter type...");
          this.curSortDir.audience = !sortDir;
          if(this.curSortDir.audience){
            let array = data.slice().sort((a, b) => (a.audience > b.audience) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.audience){
            let array = data.slice().sort((a, b) => (a.audience < b.audience) ? 1 : -1)
            this.eventData = array;
          }
        }

        if(sortBy === 'training_course_type'){
          //console.log(">>>Enter type...");
          this.curSortDir.training_course_type = !sortDir;
          if(this.curSortDir.training_course_type){
            let array = data.slice().sort((a, b) => (a.course.training_course_type > b.course.training_course_type) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.training_course_type){
            let array = data.slice().sort((a, b) => (a.course.training_course_type < b.course.training_course_type) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }

        if(sortBy === 'tutor'){
          //console.log(">>>Enter type...");
          this.curSortDir.tutor = !sortDir;
          if(this.curSortDir.tutor){
            let array = data.slice().sort((a, b) => (a.tutor && b.tutor && a.tutor.name > b.tutor.name) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.tutor){
            let array = data.slice().sort((a, b) => (a.tutor && b.tutor && a.tutor.name < b.tutor.name) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }

        if(sortBy === 'capacity'){
          //console.log(">>>Enter type...");
          this.curSortDir.capacity = !sortDir;
          if(this.curSortDir.capacity){
            let array = data.slice().sort((a, b) => (a.course.capacity > b.course.capacity) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.capacity){
            let array = data.slice().sort((a, b) => (a.course.capacity < b.course.capacity) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }

        if(sortBy === 'training_days'){
          //console.log(">>>Enter type...");
          this.curSortDir.training_days = !sortDir;
          if(this.curSortDir.training_days){
            let array = data.slice().sort((a, b) => (a.course.training_days > b.course.training_days) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.training_days){
            let array = data.slice().sort((a, b) => (a.course.training_days < b.course.training_days) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }

        if(sortBy === 'training_days'){
          //console.log(">>>Enter type...");
          this.curSortDir.training_days = !sortDir;
          if(this.curSortDir.training_days){
            let array = data.slice().sort((a, b) => (a.course.training_days > b.course.training_days) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.training_days){
            let array = data.slice().sort((a, b) => (a.course.training_days < b.course.training_days) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }
        if(sortBy === 'created_date'){
          //console.log(">>>Enter type...");
          this.curSortDir.created_date = !sortDir;
          if(this.curSortDir.created_date){
            let array = data.slice().sort((a, b) => (a['eventDates'] && b['eventDates'] && a['eventDates'][0].event_date > b['eventDates'][0].event_date) ? 1 : -1)
            this.eventData = array;
          }
          if(!this.curSortDir.created_date){
            let array = data.slice().sort((a, b) => (a['eventDates'] && b['eventDates'] && a['eventDates'][0].event_date < b['eventDates'][0].event_date) ? 1 : -1)
            this.eventData = array;
            //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
          }
        }
    }
  }

  open(content,newObj:any) {
    console.log(newObj)
    //this.voucherSentData = {};
    // if(id){
    //   console.log(">>ID: ", id);
    //   this.voucherSentData['accreditation'] = id;
    //   this.voucherSentData['index'] = key;
    //   this.voucherIndex = key
    // }
    // this.paymentReceiptValidation = null;
    this.participantsList = newObj.participants != null && newObj.participants.length > 0 ? newObj.participants : [];
    this.detailsCourse = newObj.course.course;

    this.detailsDate = newObj.eventDates != null && newObj.eventDates.length > 0 ? newObj.eventDates[0].event_date : '';
    this.noOfParticipants = newObj.participants != null && newObj.participants.length > 0 ? newObj.participants.length : 0;
    this.trainerEvent = newObj.tutor != null && newObj.tutor ? newObj.tutor.name : 'N/A';

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
