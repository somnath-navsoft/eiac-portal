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
import { CalendarComponent, FullCalendarModule } from 'ng-fullcalendar';

// import * as $ from 'jquery'; 
// import 'fullcalendar';

declare var $: any;
@Component({
  selector: 'app-assessors-dashboard',
  templateUrl: './assessors-dashboard.component.html',
  styleUrls: ['./assessors-dashboard.component.scss']
})
export class AssessorsDashboardComponent implements OnInit { 
  //@ViewChild('calendar', { static: true }) calendar: any;
  //options: FullCalendarOptions;
  //options: OptionsInput;
  eventsModel: any;
  dashboardEvents: any = [];
  //optionCal: FullCalendarOptions;
  @ViewChild('fullcalendar', { static: true }) fullcalendar: CalendarComponent;

  @ViewChild('calendar', { static: true }) calendar: any;
  eventYear: string = '';
  eventMonth: any;
 // events: any[] = [];
 //events: EventObject[];
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
  eventData: any[] = [];
  options:any;
  technicalFields: any[] =[];
  technicalFieldsCount: number = 0;

  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  eventId:any;
  yrsService: any;
  assessorType: any[] =[];
  assessorTypes: string = '';
  totalYear: any = 0;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {
    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }


  loadTechnicalFields(){
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail+'&id='+this.userId)
    .subscribe(
      rec => {
          let record: any = rec;
          let data: any = record.data;

          if(typeof data == 'object' && data.technical_field != undefined && data.technical_field.length > 0){
              this.technicalFields = data.technical_field;
          }
          // console.log(">>>Technical fields: ", this.technicalFields);
          // if(this.technicalFields.length > 0){
          //   this.technicalFields.forEach(item => {
          //       if(item.technical_fields != undefined && item.technical_fields != '' && 
          //           typeof item.technical_fields == 'object' && item.technical_fields.length > 0){
          //             // console.log(">>>Count: ", item.technical_fields)
          //         this.technicalFieldsCount += item.technical_fields.length;
          //       }
          //   })
          // }
          // console.log("@Total count: ", this.technicalFieldsCount);

          var arr = [];
          if(rec['data'].step4 != '') {
            // console.log(res['data'].technical_field);
            var step4 = rec['data'].step4;
            // console.log(step4['technical_experience'],'step5');
            for(let key in step4['technical_experience']) {
              this.technicalFields.forEach(res => {
                for(let nxtkey in res['technical_fields']) {
                  if(key == res['technical_fields'][nxtkey].field_mgmt) {
                    res['technical_fields'][nxtkey].knowledge_experienced = step4['technical_experience'][key];
                    arr.push(res['technical_fields'][nxtkey].service_name);
                  }
                }
              });
            }
            let unique = arr.filter((item, i, ar) => ar.indexOf(item) === i);
            this.technicalFieldsCount = unique.length;
            // console.log(unique);
            // const uniqueArr = [...new Set(arr.map(item => item.key))]
            // console.log(uniqueArr,'htryyyyyyyyyyyyyy');
          }
          
      }
    );

  }

  calcDays(date1,date2){
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);

    var message = date2.toDateString();
    //message += " was "
    message += days + " days " 
    message += months + " months "
    message += years + " years ago \n"

    console.log("Todat years: ", message);
    return message;
  }

  getFormType(formMeta: string){
    // | 
      if(formMeta === 'health_care'){
        return 'HP';
      }
      else if(formMeta === 'inspection_body'){
        return 'IB';
      }
      else if(formMeta === 'testing_calibration'){
        return 'TCL';
      }
      else if(formMeta === 'certification_bodies'){
        return 'CB';
      }
      else if(formMeta === 'pt_providers'){
        return 'PTP';
      }
      else if(formMeta === 'halal_conformity_bodies'){
        return 'HCAB';
      }else if(formMeta === 'inprimise'){
        return 'In Premise Training';
      }else if(formMeta === 'public_training'){
        return 'Public Training';
      }else if(formMeta === 'work_permit'){
        return 'Work Activity Permit';
      }else if(formMeta === 'no_objection'){
        return 'No Objection Certificate';
      }else if(formMeta === 'work_activity'){
        return 'Work Activity Permit';
      }else{
        return 'NA';
      }
  }


  checkStatus(item) {
    let date = new Date();
    let yr = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let todays: any = new Date(yr+"-"+month+"-"+day);
    let expiryData: any = new Date(item['eventDate'][item['eventDate'].length - 1].event_date);//new Date("2024-12-31");//;//
    // console.log(expiryData);   
    let diffDate: any = Math.round((expiryData-todays)/(1000*60*60*24));
    // console.log(diffDate);
    if(diffDate >= 0){
      return 'Active';
    }else{
      return 'InActive';
    }
    
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
          console.log(res,'res');
          if (res['status'] == 200) {
            this.dashboardItemData = res['dashBoardData'];

            // this.technicalFieldsCount = this.dashboardItemData.technicalFieldsCount;

            if(this.dashboardItemData.assessorDetails != undefined && this.dashboardItemData.assessorDetails.length > 0){
                let assessorData: any = this.dashboardItemData.assessorDetails[0];
               // this.dashboardItemData.assessorDetails[0].appointment_date = new Date('2019-10-10');
                console.log("@Assesor data: ", assessorData);

                let date = new Date();
                let yr = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let todays: any = new Date(yr+"-"+month+"-"+day);
                let appintmentDate: any = new Date(assessorData.appointment_date);//new Date("2024-12-31");//;//
                let diffDate: any = Math.round((todays - appintmentDate)/(1000*60*60*24))

                let curYear: number = yr;
                let appYear: number = appintmentDate.getFullYear();

                console.log("@ YEAR: ", curYear, " :: ", appYear);

                if( assessorData.appointment_date !=  null){
                  var dateFrom = assessorData.appointment_date; 
                  var dateTo =todays;
                  var date1: any = new Date(dateFrom);
                  var date2: any = new Date(dateTo);
                  var diff=0;
                  let  monthp=31;
                  var days=1000*60*60*24;
                  diff=date2-date1; 
                  var dayp=(Math.floor(diff/days));   
                  var years = (Math.floor(dayp/365));
                  var months = Math.round(dayp % 365)/monthp;
                  let dayCal: any = Math.ceil(dayp*30);
                  var totalYears: string = years + "Years" + Math.ceil(months) + ' Months' + dayCal + ' Days';
                  //if(this.totalYear < 10){
                  if(curYear > appYear){
                    //this.totalYear = '0' + years;
                    this.totalYear = (curYear - appYear);
                  }
                  if(curYear == appYear){
                    this.totalYear = 0;
                  }
                }
                    
                
                console.log(">>>Difference Year: ", diffDate, " -- ", this.calcDays(todays,appintmentDate), " -- ", years, " : ", months, " : ", dayp, " == ", totalYears);

                if(assessorData.expert != undefined && assessorData.expert != null && assessorData.expert != '' && assessorData.expert == 'y'){
                  this.assessorType.push('Expert');
                }
                if(assessorData.lead != undefined && assessorData.lead != null && assessorData.lead != '' && assessorData.lead == 'y'){
                  this.assessorType.push('Lead');
                }
                if(assessorData.technical != undefined && assessorData.technical != null && assessorData.technical != '' && assessorData.technical == 'y'){
                  this.assessorType.push('Technical');
                }
                if(this.assessorType.length > 0){
                  this.assessorTypes = this.assessorType.join(',');
                }
            }
            console.log(">>>>> ", res['dashBoardData'], " == ", getData, " -- ", this.userDetails);
            //Get recent updates
            if (this.dashboardItemData.lastLogin != undefined) {              
              let datePart: any = this.dashboardItemData.lastLogin.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Last Login ";
              this.dashboardRecentUpdates.push({title: titleText,date: dateStr}); 
            }
            if(this.dashboardItemData.lastAccrApplied != undefined){
              let datePart: any = this.dashboardItemData.lastAccrApplied.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Applied " + this.getFormType(this.dashboardItemData.lastAccrAppliedFormName) + " Application ";
              this.dashboardRecentUpdates.push({title: titleText,date: dateStr});
            }
            if(this.dashboardItemData.lastRegApplied != undefined){ 
              let datePart: any = this.dashboardItemData.lastRegApplied.toString().split(" ");              
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Applied " + this.getFormType(this.dashboardItemData.lastRegAppliedFormName) + " Application ";
              this.dashboardRecentUpdates.push({title:titleText,date:dateStr});
            }
            if(this.dashboardItemData.lastTrainingApplied != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingApplied.toString().split(" ");              
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Applied " + this.getFormType(this.dashboardItemData.lastTrainingAppliedFormName) + " Application ";
              this.dashboardRecentUpdates.push({title: titleText,date:dateStr});
            }

            //
            //dashboardEvents
            let curYear: any;
            let curMonth: any;
            let curDate: any = new Date();
            curYear = curDate.getFullYear();
            curMonth = curDate.getMonth() + 1;
            //let eventCanderArr = []; 
            console.log(">>>", curYear, " :: ", curMonth);
            if (this.dashboardItemData.eventDetails != undefined && this.dashboardItemData.eventDetails.length > 0) {
              // this.dashboardEvents = this.dashboardItemData.eventDetails;
              let array = this.dashboardItemData.eventDetails.slice().sort((a, b) => (a['eventDate'][0].event_date < b['eventDate'][0].event_date) ? 1 : -1)
              this.dashboardEvents = array;
              // console.log(">>>Events: ", this.dashboardEvents);
              // let filterEvents: any[] =[];
              // this.dashboardEvents.forEach(item => {
              //   let evtStart: any = item.event_start_date_time;
              //   let evtDate: any = new Date(evtStart);
              //   let evtYear: any = evtDate.getFullYear();
              //   let evtMonth: any = evtDate.getMonth() + 1;
              //   console.log("@Evt datae: ", evtStart, " :: ", evtYear, " :: ", evtMonth);

              //   if((curYear == evtYear) && (curMonth == evtMonth)){
              //     filterEvents.push(item);
              //     eventCanderArr.push({
              //       id: item.id,
              //       title: item.courseDetails.course,
              //       start: item.event_start_date_time,
              //       end: item.event_end_date_time
              //     })
              //   }
                
              // })
              // this.dashboardEvents = filterEvents;
            }

            var eventCanderArr = [];
            
            this.dashboardEvents.forEach((res,key) => {
              // console.log(res,'res');
              // var tempObj = {}
              // tempObj['title'] = res['courseDetails'].course;
              // tempObj['start'] = res.event_start_date_time;
              // tempObj['end'] = res.event_end_date_time;
              // eventCanderArr.push(tempObj);
              eventCanderArr.push({
                id:res.id,
                title:res['courseDetails'].course,
                start:res['eventDate'][0].event_date,
                end:res['eventDate'][res['eventDate'].length - 1].event_date,
              });
            })

          //   setTimeout(() => {
          //     $("#calendar").fullCalendar({  
          //                     header: {
          //                         left   : 'prev,next today',
          //                         center : 'title',
          //                         right  : 'month,agendaWeek,agendaDay'
          //                     },
          //                     navLinks   : true,
          //                     editable   : true,
          //                     eventLimit : true,
          //                     events: this.eventData,  // request to load current events
          //                 });
          //  }, 100);

            this.options = {
              editable: true,
              events: eventCanderArr,
              selectable: true,
              eventLimit: true,
              eventLimitText: "Click to more events...",
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
              firstDay: 1,
              
              plugins: [ dayGridPlugin, interactionPlugin ]
            };


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

    
    this.loadTechnicalFields();

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
      .subscribe(
        res => {
          this.loader = true;
          this.userDetails = res['data']['user_data'][0];
          this.step1Data = res['data']['step1'][0];
          this.step1Data = res['data']['step1'][0];
          this.step2Data = res['data']['step2']['education'][0];
          // console.log(res,'res');
          this.userDetails != undefined ? this.loadDashData() : '';
          
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
        // this.options = {
        //   editable: true,
        //   events: [{
        //     title: 'Long Event',
        //     start: '2020-12-07',
        //     end: '2020-12-17'
        //   },
        //   {
        //     title: 'Day Event',
        //     start: '2020-12-20',
        //     end: '2020-12-20'
        //   }],
        //   customButtons: {
        //     myCustomButton: {
        //       text: 'custom!',
        //       click: function() {
        //         alert('clicked the custom button!');
        //       }
        //     }
        //   },
        //   header: {
        //     left: 'prev,next today myCustomButton',
        //     center: 'title',
        //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
        //   },
        //   plugins: [ dayGridPlugin, interactionPlugin ]
        // };

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
  
        // console.log(">>> Get month: ",this.eventMonth);
  }

  fullcanderClick(obj) {

    this.eventId = obj.event._def.publicId;
    // console.log(eventId);
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
    alert('....');
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
