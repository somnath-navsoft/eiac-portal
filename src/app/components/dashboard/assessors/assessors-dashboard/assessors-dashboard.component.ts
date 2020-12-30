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
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';

import { FullCalendarOptions, EventObject } from 'ngx-fullcalendar';

declare var FullCalendar: any;

@Component({
  selector: 'app-assessors-dashboard',
  templateUrl: './assessors-dashboard.component.html',
  styleUrls: ['./assessors-dashboard.component.scss']
})
export class AssessorsDashboardComponent implements OnInit { 
  //@ViewChild('calendar', { static: true }) calendar: any;
  //options: FullCalendarOptions;
  options: OptionsInput;
  eventsModel: any;
  optionCal: FullCalendarOptions;
  @ViewChild('fullcalendar', { static: true }) fullcalendar: CalendarComponent;

  @ViewChild('calendar', { static: true }) calendar: any;
  eventYear: string = '';
  eventMonth: any;
 // events: any[] = [];
 events: EventObject[];
  messageList: any = [];
  userId: any;
  loader: boolean = true;
  recordsTotal: any;
  config: any;
  userDetails: any;
  userEmail: any;
  userType: any;
  step1Data: any;
  step2Data: any;

  dashboardItemData: any = {};
  dashboardRecentUpdates: any[] = [];
  dashboardTradeLicFile: any;
  dashboardTradeLicExDate: any;
  dashboardTradeLicExStatus: boolean = false;
  licence_document_file: string;
  licence_document_path: string;

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

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {
    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }


  //Load Dashboatd data
  loadDashData() {
    this.loader = false;
    let getURL: string = this.Service.apiServerUrl + "/" + 'assessor-dashboard/';
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = {};
          getData = res;
          // console.log(res,'res');
          if (res['status'] == 200) {
            this.dashboardItemData = res['dashBoardData'];

            console.log(">>>>> ", res['dashBoardData'], " == ", getData);
            //Get recent updates
            if (this.dashboardItemData.lastLogin != undefined) {
              let datePart: any = this.dashboardItemData.lastLogin.toString().split(" ");
              let date = datePart[0];
              let time1 = datePart[1];
              let time1Ar = time1.split(":");
              console.log(">>>>... ", time1Ar, " -- ", time1Ar.length);
              if (time1Ar.length == 1) {
                time1 = time1 + ":00";
              }
              let time2 = datePart[2];
              let time = time1 + " " + time2;
              console.log(datePart, " == ", date, " -- ", time);
              this.dashboardRecentUpdates.push({ title: "Assessor Last Login", date: date, time: time });
            }

          }
          console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

        });
  }


  //Calendar hooks
  //On Nav header click
  handleNavclick(evtData: any) {
    ////console.log('Nav Header Click - ', evtData);
  }

  //On Date click in any month
  handleDateClick(evtData: any) {
    ////console.log('Date Click - ', evtData);
  }



  //Handling day
  handleDay(eventDay: any) {
    ////console.log("Event Day: ", eventDay);
    //elem - innerText/innerHTML/hidden/height/width/title/textContent
    let dateObj = eventDay.date;
    let elem = eventDay.el;
    let output = eventDay.view;
    output.header.el.innerText.toString().replace("Sun", 'Holiday');
    output.header.el.innerText.toString().replace("Mon", 'AdDay');
    if (new Date(dateObj).getDay() === 5 && output.header.el.innerText != undefined) {
      //elem.title = "FFF";
      //output.header.el.innerText = 'Sun Mon Tue Wed Thu Holiday Holiday';
      let find = output.header.el.innerText.toString().toLowerCase().indexOf('fri');
      if (find != -1) {
        ////console.log('changing text haedrer...');
        output.header.el.innerText.toString().replace("Fri", 'Holiday');
      }
      // //console.log('search fri: ', find);
    }
    if (new Date(dateObj).getDay() === 6 && elem.hidden != undefined) {
      //elem.hidden = true;
    }
    // //console.log(eventDay, " :: ", dateObj, " - ", new Date(dateObj).getDay());
  }
  //fc-day fc-widget-content fc-tue fc-other-month fc-past
  //fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-allow-mouse-resize

  handleDates(eventDates: any) {
    ////console.log("Dates Event: ", eventDates);
  }

  //Click on event on calendar
  handleEventClick(evtData: any) {
    // console.log('Event Click - ', evtData);
    let obj = {
      // title : evtData.event._def.title,
      title: evtData.calEvent.title,
      // description : evtData.event._def.extendedProps.description,
      description: evtData.calEvent.description,
      // link : evtData.event._def.extendedProps.redirectUrl
      link: evtData.calEvent.redirectUrl
    };
    // console.log('Event Click - ', title+description+link);
    //this.uiDialog.eventCalenderDialog(obj);
  }

  //calendar hooks

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');
    // this.options = {
    //   defaultDate: new Date(),
    //   editable: false,
    //   navLinks: true,
    //   weekends: true,
    //   hiddenDays: [], //0-6 range day number        
    // }
    this.eventYear = new Date().getFullYear().toString();
    let getMon = new Date().getMonth();
    this.eventMonth = getMon + 1;

    this.loader = false;
    this.select_field = [
      { field: 'Internal Operations', value: 'Internal Operations' },      
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
          this.step1Data = res['data']['step1'][0];
          this.step2Data = res['data']['step2']['education'][0];
          // console.log(res,'res');
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
          // console.log(this.messageList);
          this.loader = true;
          this.recordsTotal = res['data'].recordsTotal;
          // console.log(res['data'].message_list);
        });
        //this.yearMonth + '-07' || this.yearMonth + '-15'
        this.options = {
          editable: true,
          events: [{
            title: 'Long Event',
            start: '2020-12-07',
            end: '2020-12-17'
          },
          {
            title: 'Day Event',
            start: '2020-12-20',
            end: '2020-12-20'
          }],
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

        // this.optionCal = {
        //   defaultDate: new Date(),
        //   editable: false,
        //   navLinks: true,
        //   weekends: true,
        //   hiddenDays: [], //0-6 range day number        
        // }
        // this.events = [
        //   { id: 'a', title: 'My Birthday', allDay: true },
        //   { id: 'b', title: 'Friends coming round', start: '2018-07-26T18:00:00', end: '2018-07-26T23:00:00' }
        // ]
        // this.eventYear = new Date().getFullYear().toString();
        // let getMont = new Date().getMonth();
        // this.eventMonth = getMont + 1;
  
        console.log(">>> Get month: ",this.eventMonth);
  }
  getUserDetails(user) {
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
  }
  eventClick(model) {
    console.log(model);
  }
  eventDragStop(model) {
    console.log(model);
  }
  clickButton(model) {
    console.log(model);
  }
  dateClick(model) {
    console.log(model);
  }
  updateEvents() {
    this.eventsModel = [{
      title: 'Updaten Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }
  get yearMonth(): string {
    const dateObj = new Date();
    return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
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
