import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-operations-dashboard',
  templateUrl: './operations-dashboard.component.html',
  styleUrls: ['./operations-dashboard.component.scss']
})
export class OperationsDashboardComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA]; 
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];
  addOnBlur = true;
  userType: any;
  userEmail: any;
  chatMessage: any = {};
  file_validation: boolean = true;
  chatMessageFile: any = new FormData();
  loader: boolean = true;
  messageList: any;
  userId: any;
  select_field: any = [];
  selectedField: any = 'CAB Name';
  searchDetails: any = [];
  selectSearch: any = [];
  getUserType: string = 'cab_client';
  // searchTerm: any = '';
  selectedUserId: any = [];
  document: any = '';
  documentName: any = '';
  localUrl: any;
  button_disable: any = true;
  selectedUser: any = [];
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  config: any;
  selectDepartment: string;

  dashboardItemData: any = {};
  dashboardRecentUpdates: any[] = [];
  dashboardTradeLicFile: any;
  dashboardTradeLicExDate: any;
  dashboardTradeLicExStatus: boolean = false;
  licence_document_file: string;
  licence_document_path: string;

  ioDeartment: any[] =[];
  totalDeptSchemeCount: number = 0;
  totalDeptCertificateCount: number = 0;
  totalDeptCABCount: number = 0;
  totalDeptDocCount: number = 0;

  totalDeptStatus: any ={};
  totalDeptSelect: string ='';


  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {

    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }


  changeDepartmentView(theEvt: any){
    console.log("> ", this.selectDepartment, " -- ", theEvt);
    this.loader = false;
    let departmetnId: any =''
    if(theEvt && theEvt.value != undefined){
      departmetnId = theEvt.value;
          this.loader = false;
          let getURL: string =this.Service.apiServerUrl + "/" + 'io-dashboard/?department_type='+departmetnId;
          this.Service.getwithoutData(getURL)
            .subscribe(
              res => {
                this.loader = true;
                let getData: any = {};
                getData = res['dashBoardData'];
                console.log(getData,'::::Department data');

                this.totalDeptSelect = getData.lastApplication;
                if(getData.allScheme != undefined){
                  this.totalDeptSchemeCount = getData.allScheme.length;
                }
                this.totalDeptDocCount = getData.totalDocCount;
                this.totalDeptCABCount = getData.totalCabCount;
                this.totalDeptCertificateCount = getData.all_crtificate_count;
                if(getData.status_count != undefined){
                    this.totalDeptStatus.accredatedCount    = getData.status_count.accredatedCount.length;
                    this.totalDeptStatus.suspendedCount     = getData.status_count.suspendedCount.length;
                    this.totalDeptStatus.volWithdrawCount   = getData.status_count.volWithdrawCount.length;
                    this.totalDeptStatus.volSuspendedCount  = getData.status_count.volSuspendedCount.length;
                    this.totalDeptStatus.withdrawCount      = getData.status_count.withdrawCount.length;
                    
                }


          });
    }
  }


  //department view onchange
  //https://dev-service.eiac.gov.ae/webservice/io-dashboard/?department_type = io roles value

  //Load Dashboatd data
  loadDashData(){
    this.loader = false;
    let getURL: string =this.Service.apiServerUrl + "/" + 'io-dashboard/' ;
    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = {};
          getData = res;
          // console.log(res,'res');
          if(res['status'] == 200){
            this.dashboardItemData = res['dashBoardData'];

            console.log(">>>>> ", res['dashBoardData'], " == ", getData); 

            if(this.dashboardItemData.io_roles != undefined && this.dashboardItemData.io_roles.length > 0){
              this.dashboardItemData.io_roles.forEach(item => {
                    if(item == 'certification_bodies'){
                      this.ioDeartment.push({title:'CB', value: item})
                    }
                    if(item == "inspection_body"){
                      this.ioDeartment.push({title:'IB', value: item})
                    }
                    if(item == "testing_calibration"){
                      this.ioDeartment.push({title:'TCL', value: item})
                    }
                    if(item == "pt_providers"){
                      this.ioDeartment.push({title:'PTP', value: item})
                    }
                    if(item == "health_care"){
                      this.ioDeartment.push({title:'HP', value: item})
                    }
                    if(item == "halal_conformity_bodies"){
                      this.ioDeartment.push({title:'HCAB', value: item})
                    } 
                    // if(item == "work_permit"){
                    //   this.ioDeartment.push({title:'WAP', value: item})
                    // }
                    // if(item == "no_objection"){
                    //   this.ioDeartment.push({title:'NOC', value: item})
                    // }
              })
            }

            //Get recent updates
            if(this.dashboardItemData.lastLogin != undefined){
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
              this.dashboardRecentUpdates.push({title: "IO Last Login",date:date, time: time});
            }
            if(this.dashboardItemData.lastAccrApplied != undefined){
              let datePart: any = this.dashboardItemData.lastAccrApplied.toString().split(" ");
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
              this.dashboardRecentUpdates.push({title: "IO Last Accreditation Applied",date:date, time: time});
            }            
          }
          console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

        });
  }

  ngOnInit() {

    this.totalDeptStatus['accredatedCount'] = 0;
    this.totalDeptStatus['suspendedCount'] = 0;
    this.totalDeptStatus['volWithdrawCount'] = 0;
    this.totalDeptStatus['volSuspendedCount'] = 0;
    this.totalDeptStatus['withdrawCount'] = 0;

    this.getUserType = 'cab_client';
    this.select_field = [
      { field: 'CAB Name', value: 'CAB Name' },
      { field: 'CAB Code', value: 'CAB Code' },
      { field: 'Candidate', value: 'Candidate' },
      { field: 'Trainer', value: 'Trainer' },
      { field: 'Assessor', value: 'Assessor' },
      { field: 'Super Admin', value: 'Super Admin' }
    ];
    this.userType = sessionStorage.getItem('type');
    this.userEmail = sessionStorage.getItem('email');
    this.userId = sessionStorage.getItem('userId');

    this.loadDashData();

    if (this.userType != 'operations') {
      var landUrl = '/dashboard' + this.userType + '/home'
      this.router.navigateByUrl(landUrl);
    }

    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          this.loader = true;
        });

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=cab_client&searchKey=S')
      .subscribe(
        res => {
          this.searchDetails = [];
          // this.selectSearch = [];
          this.searchDetails = res['data'].user_list;
          // this.selectSearch = res['data'].user_list;
        }, err => {
          this.loader = true;
        });

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

  getRouteId(routeId) {
    sessionStorage.setItem('routeId', routeId);
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

  onSubmit(ngForm) {
    if (ngForm.form.valid) {
      this.chatMessage.email = this.userEmail;
      this.chatMessage.userType = this.userType;
      this.loader = false;
      this.chatMessageFile.append('data', JSON.stringify(this.chatMessage));
      this.Service.post(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService, this.chatMessageFile)
        .subscribe(
          res => {
            if (res['status'] == true) {
              this.loader = true;
              this.toastr.success(res['msg'], '');
            }
          })
    }
  }

  onOperationSubmit(ngForm) {

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
              this.setField('CAB Name');
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


  showFile() {
    window.open(this.localUrl, '_blank');
  }

  getUserDetails(user) {
    sessionStorage.setItem('messageUserDetails', JSON.stringify(user));
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

  pageChanged(event) {
    this.config.currentPage = event;
  }

}
