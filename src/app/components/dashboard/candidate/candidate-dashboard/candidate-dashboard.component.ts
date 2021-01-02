import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { CalendarComponent } from 'ng-fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarOptions, EventObject } from 'ngx-fullcalendar';
import { OptionsInput } from '@fullcalendar/core';

declare var FullCalendar: any;
declare var $: any;
@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.scss']
})
export class CandidateDashboardComponent implements OnInit {
  @ViewChild('calendar', { static: true }) calendar: any;
  options: OptionsInput;
  messageList: any = [];
  userId: any;
  loader: boolean = true;
  recordsTotal: any;
  config: any;
  userDetails:any;
  userEmail:any;
  userType:any;
  step1Data:any;
  step2Data:any;

  dashboardItemData: any = {};
  dashboardRecentUpdates: any[] = [];
  dashboardTradeLicFile: any;
  dashboardTradeLicExDate: any;
  dashboardTradeLicExStatus: boolean = false;
  licence_document_file: string;
  licence_document_path: string;
  dashboardEvents: any = [];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];
  addOnBlur = true;
  select_field: any = [];
  selectedUser: any = [];

  selectedField: any = 'Internal Operations';
  getUserType: string = 'operations';
  document: any = '';
  documentName: any = '';
  searchDetails: any = [];
  selectSearch: any = [];
  selectedUserId: any = [];
  chatMessage: any = {};
  file_validation: boolean = true;
  chatMessageFile: any = new FormData();
  localUrl: any;
  button_disable: any = true;
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  optionCal: FullCalendarOptions;
  @ViewChild('fullcalendar', { static: true }) fullcalendar: CalendarComponent;


  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {
    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }

  eventClick(theEvt: any){
    console.log("@Event: ",theEvt)
  }

  //Load Dashboatd data
  loadDashData(){
    this.loader = false;
    let getURL: string =this.Service.apiServerUrl + "/" + 'candidate-dashboard/' ;
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          console.log(res,'res');
          if(res['status'] == 200){
            this.dashboardItemData = res['dashBoardData'];

            //dashboardEvents
            if(this.dashboardItemData.eventDetails != undefined && this.dashboardItemData.eventDetails.length > 0){
              this.dashboardEvents = this.dashboardItemData.eventDetails;
              // console.log(">>>Events: ", this.dashboardEvents);
            }
            //Get recent updates
            if(this.dashboardItemData.lastLogin != undefined){
              // let dt = new Date(this.dashboardItemData.lastLogin);
              // let date = dt.toLocaleDateString();
              // let time = dt.toLocaleTimeString();
              let datePart: any = this.dashboardItemData.lastLogin.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              console.log(">>>>... ", time1Ar, " -- ", time1Ar.length);
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "+ time2;
              console.log(datePart, " == ", date, " -- ",time);
              this.dashboardRecentUpdates.push({title: "CAB Last Login",date:date, time: time});
            }
            if(this.dashboardItemData.lastAccrApplied != undefined){
              let datePart: any = this.dashboardItemData.lastAccrApplied.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "CAB Accreditation Applied",date:date, time: time});
            }
            if(this.dashboardItemData.lastRegApplied != undefined){
              let datePart: any = this.dashboardItemData.lastRegApplied.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "CAB Registration Applied",date:date, time: time});
            }
            if(this.dashboardItemData.lastTrainingApplied != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingApplied.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" " + time2;
              this.dashboardRecentUpdates.push({title: "CAB Training Applied",date:date, time: time});
            }
            if(this.dashboardItemData.lastAccrPayment != undefined){
              let datePart: any = this.dashboardItemData.lastAccrPayment.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "CAB Accreditation Payment",date:date, time: time});
            }
            if(this.dashboardItemData.lastRegPayment != undefined){
              let datePart: any = this.dashboardItemData.lastRegPayment.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "CAB Registration Payment",date:date, time: time});
            }
            if(this.dashboardItemData.lastTrainingPayment != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingPayment.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              if(time1Ar.length == 1){
                time1 = time1 +":00";
              }
              let time2 = datePart[2];
              let time = time1 +" "  + time2;
              this.dashboardRecentUpdates.push({title: "CAB Training Payment",date:date, time: time});
            }

            let eventData: any[]=[];
            if(this.dashboardItemData.eventDetails != undefined && this.dashboardItemData.eventDetails.length > 0){
              console.log(">>> Events: ", this.dashboardItemData.eventDetails);
              this.dashboardItemData.eventDetails.forEach(item => {
                eventData.push({
                  id: item.courseDetails.id,
                  title: item.courseDetails.course,
                  start: item.event_start_date_time,
                  end: item.event_end_date_time
                })
              })
            }

          //   setTimeout(() => {
          //     $("#calendar").fullCalendar({  
          //         header: {
          //             left   : 'prev,next today',
          //             center : 'title',
          //             right  : 'month,agendaWeek,agendaDay'
          //         },
          //         navLinks   : true,
          //         editable   : true,
          //         eventLimit : true,
          //         events: eventData,  // request to load current events
          //     });
          //  }, 100); 


            this.options = {
              editable: true,
              events: eventData,
              eventLimit: true,
              eventLimitText: "More",
              customButtons: {
                myCustomButton: {
                  text: 'custom!',
                  click: function() {
                    alert('clicked the custom button!');
                  }
                }
              },
              header: {
                left: 'prev,next today myCustomButton',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              },
              plugins: [ dayGridPlugin, interactionPlugin ]
            };
          }
          console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

        });
  }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');
    this.loader = false;
    this.select_field = [
      { field: 'Internal Operations', value: 'Internal Operations' },
      { field: 'Trainer', value: 'Trainer' }      
    ];


    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=' + this.getUserType + '&searchKey=S')
      .subscribe(
        res => {
          this.searchDetails = res['data'].user_list;
          this.loader = true;;
          // this.search(this.searchTerm);

        }, err => {
          this.loader = true;
        });


    this.loadDashData();
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
    .subscribe(
      res => {
        this.loader = true;
        this.userDetails = res['data']['user_data'][0];
        this.step1Data = res['data']['step1'][0];
        // this.step2Data = res['data']['step2']['education'][0];
        console.log(res,'res');
      });

    this.userId = sessionStorage.getItem('userId');

    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          // this.messageList = res['data'].message_list;
          res['data'].message_list.forEach((rec, index) => {
            if (rec.meta_title != 'user_registration') {
              this.messageList.push(rec);
            }
          });
          this.recordsTotal = res['data'].recordsTotal;
          this.loader = true;
        });
  }

  getUserDetails(user) {
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  onSubmit(ngForm) {

    if (ngForm.form.valid && this.selectedUserId != '') {
      let formdata = new FormData();
      formdata.append('message_by', this.userId);
      formdata.append('user_id', this.selectedUserId);
      // formdata.append('message_id', null);
      formdata.append('message', this.chatMessage.message);
      formdata.append('document', this.document);
      formdata.append('message_type', 'admin_comment');
      this.loader = false;
      this.Service.put(this.Service.apiServerUrl + "/" + 'message-list/', formdata)
        .subscribe(
          res => {
            if (res['status'] == true) {
              this.setField('Internal Operations');
              this.documentName = '';
              this.selectedUserId = '';
              this.selectedUser = [];
              this.chatMessage.message = '';
              this.chatMessage.upload_message = '';
              this.loader = true;
              this.toastr.success(res['msg'], '');
              // this.getMessage();
            }
          }, err => {
            this.loader = true;
          })
    }
  }

  setField(value) {
    // this.search(this.searchTerm);
    this.selectedUser = [];
    this.loader = false;
    this.searchDetails = [];
    this.selectSearch = [];
    this.selectedField = value;
    // cab_code,cab_client,candidate,assessors,trainers,super_admin
    if (this.selectedField == 'CAB Name') {
      this.getUserType = 'cab_client';
    }
    if (this.selectedField == 'CAB Code') {
      this.getUserType = 'cab_code';
    }
    if (this.selectedField == 'Candidate') {
      this.getUserType = 'candidate';
    }
    if (this.selectedField == 'Trainer') {
      this.getUserType = 'trainers';
    }
    if (this.selectedField == 'Assessor') {
      this.getUserType = 'assessors';
    }
    if (this.selectedField == 'Super Admin') {
      this.getUserType = 'super_admin';
    }
    if (this.selectedField == 'Internal Operations') {
      this.getUserType = 'operations';
    }

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=' + this.getUserType + '&searchKey=S')
      .subscribe(
        res => {
          this.searchDetails = res['data'].user_list;
          this.loader = true;;
          // this.search(this.searchTerm);

        }, err => {
          this.loader = true;
        });

  }

  showFile() {
    window.open(this.localUrl, '_blank');
  }
  

  add(event: MatChipInputEvent): void {

  }

  remove(fruit: any): void {
    this.button_disable = true;
    this.selectedUser = [];
  }

  getFileName(file) {
    return file.split('/')[-1];
  }

  search(query: string) {
    // this.searchTerm = query;
    let result = this.select(query);
    // this.searchDetails = result;
    if (query != '') {
      this.selectSearch = result;
    } else {
      this.selectSearch = [];
    }

  }

  select(query: string): string[] {
    let result: string[] = [];
    if (this.getUserType == 'cab_client' || this.getUserType == 'cab_code') {
      for (let a of this.searchDetails) {
        if (a.username.toLowerCase().indexOf(query) > -1) {
          result.push(a);
        }
      }
    } else {
      for (let a of this.searchDetails) {
        if (a.email.toLowerCase().indexOf(query) > -1) {
          result.push(a);
        }
      }
    }

    // this.searchDetails = result;
    return result;
  }


  getValue(value, data) {
    this.fruitInput.nativeElement.blur();
    this.selectedUser = [];
    this.selectedUserId = value.id;
    this.button_disable = this.selectedUserId != '' ? false : true;
    if (data == 'username') {
      this.selectedUser.push(value.username);
    } else {
      this.selectedUser.push(value.email);
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitInput.nativeElement.blur();


  }


  validateFile(fileEvent: any) {
    // window.open(fileEvent.target.value, '_blank');
    this.localUrl = window.URL.createObjectURL(fileEvent.target.files[0]);
    this.document = fileEvent.target.files[0];
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.') + 1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this.Service.isInArray(file_exe, ex_type);
    if (ex_check) {
      this.chatMessage.upload_message = fileEvent.target.files[0].name;
      this.chatMessageFile.append('upload_message_file', fileEvent.target.files[0]);
      this.file_validation = true;
      this.documentName = fileEvent.target.files[0].name;
      return true;
    } else {
      this.file_validation = false;
      this.documentName = '';
      this.document = '';
      return false;
    }


  }

}
