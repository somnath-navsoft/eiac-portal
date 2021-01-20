import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cab-dashboard',
  templateUrl: './cab-dashboard.component.html',
  styleUrls: ['./cab-dashboard.component.scss']
})
export class CabDashboardComponent implements OnInit {

  userEmail: any;
  userType: any;
  userDetails: any;
  step1Data: any;
  loader: boolean = true;
  messageList: any = [];
  userId: any;
  recordsTotal: any;
  config: any;


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
  
  dashboardItemData: any = {};
  dashboardRecentUpdates: any[] = [];
  dashboardTradeLicFile: any;
  dashboardTradeLicExDate: any;
  dashboardTradeLicExStatus: boolean = false;
  licence_document_file: string;
  licence_document_path: string;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {
    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }

  getFile(file: string){
    let fname: string = file.split('/')[4].split('.')[0];
    console.log(fname, " == ", file);
    return fname;
  }

/*
<span *ngIf="item.form_meta == 'work_permit'">Work Permit</span>
<span *ngIf="item.form_meta == 'no_objection'">No Objection Certificate</span>
<span *ngIf="item.form_meta == 'work_activity'">Work Activity Permit</span>
*/

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
        return 'Inpremise Training';
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

  //Load Dashboatd data
  loadDashData(){
    this.loader = false;
    let getURL: string =this.Service.apiServerUrl + "/" + 'cab-dashboard/' ;
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          console.log(res,'res', " :: ", this.userDetails);
          if(res['status'] == 200){
            this.dashboardItemData = res['dashBoardData'];

            //Get recent updates
            if(this.dashboardItemData.lastLogin != undefined){
              let datePart: any = this.dashboardItemData.lastLogin.toString().split(" ");
              // let date = datePart[0];
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // console.log(">>>>... ", time1Ar, " -- ", time1Ar.length);
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" "+ time2;
              // console.log(datePart, " == ", date, " -- ",time);
              let dateStr: string = datePart[0] + " " + datePart[1];
              console.log(">>Date part: ", new Date(dateStr), " -- ", dateStr);
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Last Login ";
              this.dashboardRecentUpdates.push({title: titleText,date:dateStr});
            }
            if(this.dashboardItemData.lastAccrApplied != undefined){
              let datePart: any = this.dashboardItemData.lastAccrApplied.toString().split(" ");
              // let date = datePart[0];
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" "  + time2;
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Applied " + this.getFormType(this.dashboardItemData.lastAccrPayFormName) + " Application ";
              this.dashboardRecentUpdates.push({title: titleText,date: dateStr});
            }
            if(this.dashboardItemData.lastRegApplied != undefined){
              let datePart: any = this.dashboardItemData.lastRegApplied.toString().split(" ");
              // let date = datePart[0];
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" "  + time2;
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Applied " + this.getFormType(this.dashboardItemData.lastRegPayFormName) + " Application ";
              this.dashboardRecentUpdates.push({title: titleText,date: dateStr});
            }
            if(this.dashboardItemData.lastTrainingApplied != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingApplied.toString().split(" ");
              // let date = datePart[0]; 
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" " + time2;
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Applied " + this.getFormType(this.dashboardItemData.lastTrainingPayFormName) + " Application ";
              this.dashboardRecentUpdates.push({title: titleText,date: dateStr});
            }
            if(this.dashboardItemData.lastAccrPayment != undefined){
              let datePart: any = this.dashboardItemData.lastAccrPayment.toString().split(" ");
              // let date = datePart[0];
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" "  + time2;
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Accreditaion Payment details of " + this.getFormType(this.dashboardItemData.lastAccrPayFormName) + " Updated ";
              this.dashboardRecentUpdates.push({title: titleText,date: dateStr});
            }
            if(this.dashboardItemData.lastRegPayment != undefined){
              let datePart: any = this.dashboardItemData.lastRegPayment.toString().split(" ");
              // let date = datePart[0];
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" "  + time2;
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Registration Payment details of " + this.getFormType(this.dashboardItemData.lastRegPayFormName) + " Updated ";
              this.dashboardRecentUpdates.push({title:titleText,date:dateStr});
            }
            if(this.dashboardItemData.lastTrainingPayment != undefined){
              let datePart: any = this.dashboardItemData.lastTrainingPayment.toString().split(" ");
              // let date = datePart[0];
              // let time1 = datePart[1];
              // let time1Ar = time1.split(":");
              // if(time1Ar.length == 1){
              //   time1 = time1 +":00";
              // }
              // let time2 = datePart[2];
              // let time = time1 +" "  + time2;
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Training Payment details of " + this.getFormType(this.dashboardItemData.lastTrainingPayFormName) + " Updated ";
              this.dashboardRecentUpdates.push({title: titleText,date:dateStr});
            }
          }
          console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

        });
  }


  ngOnInit() {

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


    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
      .subscribe(
        res => {
          this.loader = true;
          this.userDetails = res['data']['user_data'][0];
          this.step1Data = res['data']['step1'][0];
          console.log("Prof: ", res);
          //
          // var differDate = new Date(this.step1Data.date_of_expiry);
          // var currDate = new Date();
          // if(differDate > currDate) {
          //   console.log('Not expired');
          // }else if(currDate > differDate) {
          //   console.log('Expired');
          // }

          if(this.step1Data && this.step1Data.date_of_expiry != null){
            this.dashboardTradeLicExDate = this.step1Data.date_of_expiry;
            let date = new Date();
            let yr = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let todays: any = new Date(yr+"-"+month+"-"+day);
            let expiryData: any = new Date(this.step1Data.date_of_expiry);//new Date("2021-1-19");
            let diffDate: any = Math.round((expiryData-todays)/(1000*60*60*24))
            console.log("@@@ Difvdate: ", diffDate, " -- ", this.step1Data.date_of_expiry);

            if(diffDate >= 0){
              //console.log("#########");
              this.licence_document_file = this.getFile(this.step1Data.trade_license);
              this.licence_document_path = this.constant.mediaPath + this.step1Data.trade_license;
              this.dashboardTradeLicExStatus = false;
            }else{
              //console.log("....");
              this.dashboardTradeLicExStatus = true;
            }
            console.log("diffdaat: ", diffDate, " -- ",todays," == ",expiryData, " == ", this.dashboardTradeLicExStatus);
          }
          if(this.step1Data && this.step1Data.trade_license != null){
            this.dashboardTradeLicFile = this.step1Data.trade_license;
          }
          // console.log(res,'res'); 
        });

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          res['data'].message_list.forEach((rec, index) => {
            if (rec.meta_title != 'user_registration') {
              this.messageList.push(rec);
            }
          });
          // this.messageList = res['data'].message_list;
          this.recordsTotal = res['data'].recordsTotal;
          this.loader = true;
        });
        setTimeout(() => {
          this.loadDashData(); 
        },1000)
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
