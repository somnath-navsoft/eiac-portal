import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TrainerService } from '../../../../services/trainer.service';

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
  userDetails: any;
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

  ioDeartment: any[] = [];
  totalDeptSchemeCount: number = 0;
  totalDeptCertificateCount: number = 0;
  totalDeptCABCount: number = 0;
  totalDeptDocCount: number = 0;
  totalDeptPendingCount: number = 0;
  totalDeptCabWaitingCount: number = 0;

  totalDeptStatus: any = {};
  totalDeptSelect: string = '';
  getCountryStateCityAll: any[] = [];
  loadCountryList: any[] = [];
  select_country: string = '';

  subscription: Subscription;


  constructor(public Service: AppService, private _trainerService: TrainerService, public constant: Constants, public router: Router, public toastr: ToastrService) {

    this.config = {
      itemsPerPage: this.Service.dashBoardPagination,
      currentPage: 1,
    };
  }

  searchCountry(theEvt: any) {
    ////console.log(">>>> enter: ", theEvt);
    let query: string = '';
    if (theEvt) {
      query = theEvt.target.value
    }
    ////console.log(">>> query: ", query, " == ", query.length);
    let result: any = this.selectCountry(query);
    if (result) {
      this.loadCountryList = result;
    }
  }
  selectCountry(query: string): any[] {
    let result: string[] = [];
    let countryData: any = this.getCountryStateCityAll;
    ////console.log(">>>> country: ", countryData);
    var re = new RegExp(query, 'gi');
    countryData.forEach(item => {
      if (re.exec(item.CountryName)) {
        result.push(item);
      }
    })
    return result;
  }

  loadCountryStateCityAll = async () => {
    let cscLIST = this.Service.getCSCAll();
    await cscLIST.subscribe(record => {
      console.log("...> ", record);
      this.getCountryStateCityAll = record['Countries'];
      this.loadCountryList = record['Countries'];
      console.log("...>>> ", this.getCountryStateCityAll);
    });
  }

  onSelectCountry(selCountry: string) {
    console.log(">>>Select country: ", selCountry, " -- ", this.selectDepartment);
    if (this.selectDepartment == undefined || this.selectDepartment == '') {
      this.toastr.warning("Please select department", '');
      return;
    }
    let departmetnId: any = this.selectDepartment;
    let region: string = selCountry;

    if (departmetnId != undefined && (departmetnId != '' && region != '')) {
      this.loader = false;
      let getURL: string = this.Service.apiServerUrl + "/" + 'io-dashboard/?department_type=' + departmetnId + '&region=' + region;
      this.Service.getwithoutData(getURL)
        .subscribe(
          res => {
            this.loader = true;
            let getData: any = {};
            getData = res['dashBoardData'];
            this.dashboardItemData = res['dashBoardData'];
            console.log(getData, '::::Department data');

            this.totalDeptSelect = getData.lastApplication;
            if (getData.allScheme != undefined) {
              this.totalDeptSchemeCount = getData.allScheme.length;
            }
            this.totalDeptDocCount = getData.totalDeptDocCount;
            this.totalDeptCABCount = getData.cabWaitingCount;
            this.totalDeptCertificateCount = getData.all_crtificate_count;
            this.totalDeptPendingCount = getData.pendingAccrCount;

            if (getData.status_count != undefined) {
              this.totalDeptStatus.accredatedCount = getData.status_count.accredatedCount; //getData.status_count.accredatedCount[0].cab_data.certificate;
              this.totalDeptStatus.suspendedCount = getData.status_count.suspendedCount;  //getData.status_count.suspendedCount[0].cab_data.certificate;
              //this.totalDeptStatus.volWithdrawCount   = getData.status_count.volWithdrawCount;  //getData.status_count.volWithdrawCount[0].cab_data.certificate;
              //this.totalDeptStatus.volSuspendedCount  = getData.status_count.volSuspendedCount.length;
              this.totalDeptStatus.withdrawCount = getData.status_count.withdrawCount;
            }
          });
    }
  }


  changeDepartmentView(theEvt: any) {
    console.log("> ", this.selectDepartment, " -- ", theEvt);
    this.loader = false;
    let departmetnId: any = '';
    if (theEvt && theEvt.value != undefined) {
      departmetnId = theEvt.value;
    } else {
      departmetnId = theEvt;
    }
    this.loader = false;
    let getURL: string = '';
    getURL = this.Service.apiServerUrl + "/" + 'io-dashboard/?department_type=' + departmetnId;
    if (this.select_country != '' && this.select_country != undefined && this.select_country != null) {
      let region: string = this.select_country;
      getURL = this.Service.apiServerUrl + "/" + 'io-dashboard/?department_type=' + departmetnId + '&region=' + region;
    }

    this.Service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          let getData: any = {};
          getData = res['dashBoardData'];
          this.dashboardItemData = res['dashBoardData'];
          console.log(getData, '::::Department data');

          this.totalDeptSelect = (getData.lastApplication == '' && this.selectDepartment === 'inspection_bodies') ? 'IB' : (getData.lastApplication != '' && this.selectDepartment === 'halal_conformity_bodies') ? 'HCAB' : getData.lastApplication;
          if (getData.allScheme != undefined) {
            this.totalDeptSchemeCount = getData.allScheme.length;
          }
          this.totalDeptDocCount = getData.totalDocCount;
          this.totalDeptCABCount = getData.totalCabCount;
          this.totalDeptCertificateCount = getData.all_crtificate_count;
          if (getData.status_count != undefined) {
            this.totalDeptStatus.accredatedCount = getData.status_count.accredatedCount;//getData.status_count.accredatedCount[0].cab_data.certificate;
            this.totalDeptStatus.suspendedCount = getData.status_count.suspendedCount;//getData.status_count.suspendedCount[0].cab_data.certificate;
            this.totalDeptStatus.volWithdrawCount = getData.status_count.volWithdrawCount;//getData.status_count.volWithdrawCount[0].cab_data.certificate;
            this.totalDeptStatus.volSuspendedCount = getData.status_count.volSuspendedCount.length;
            this.totalDeptStatus.withdrawCount = getData.status_count.withdrawCount;

          }
        });
    //}
  }


  openScheme() {
    if (this.selectDepartment == undefined || this.selectDepartment == '') {
      this.toastr.warning("Please select department", '');
      return;
    }
    let selDept: any = this.selectDepartment;
    //console.log(">>>dept...", selDept);
    localStorage.setItem("io_dept", selDept);
    this.router.navigateByUrl('/dashboard/operations/scheme-list')
  }

  openServiceEnquiries() {
    if (this.selectDepartment == undefined || this.selectDepartment == '') {
      this.toastr.warning("Please select department", '');
      return;
    }
    let selDept: any = this.selectDepartment;
    //console.log(">>>dept...", selDept);
    localStorage.setItem("io_dept", selDept);
    this.router.navigateByUrl('/dashboard/operations/service-enquiries-list')
  }
  getFormType(formMeta: string) {
    // | 
    if (formMeta === 'health_care') {
      return 'HP';
    }
    else if (formMeta === 'inspection_body') {
      return 'IB';
    }
    else if (formMeta === 'testing_calibration') {
      return 'TCL';
    }
    else if (formMeta === 'certification_bodies') {
      return 'CB';
    }
    else if (formMeta === 'pt_providers') {
      return 'PTP';
    }
    else if (formMeta === 'halal_conformity_bodies') {
      return 'HCAB';
    } else if (formMeta === 'inprimise') {
      return 'In Premise Training';
    } else if (formMeta === 'public_training') {
      return 'Public Training';
    } else if (formMeta === 'work_permit') {
      return 'Work Activity Permit';
    } else if (formMeta === 'no_objection') {
      return 'No Objection Certificate';
    } else if (formMeta === 'work_activity') {
      return 'Work Activity Permit';
    } else {
      return 'NA';
    }
  }


  loadRecordsData(offset?: number, limit?: number) {
    this.loader = false;
    this._trainerService.getRecordList(offset, limit)
      .subscribe(
        record => {
          let data: any = record;
          console.log("@@@ Total records: ", data);
          this.loader = true;
        })
  }


  //Load Dashboatd data
  loadDashData() {
    this.loader = false;
    let getURL: string = this.Service.apiServerUrl + "/" + 'io-dashboard/';
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

            if (this.dashboardItemData.io_roles != undefined && this.dashboardItemData.io_roles.length > 0) {
              this.dashboardItemData.io_roles.forEach(item => {
                if (item == 'certification_bodies') {
                  this.ioDeartment.push({ title: 'CB', value: item })
                }
                if (item == "inspection_bodies") {
                  this.ioDeartment.push({ title: 'IB', value: item })
                }
                if (item == "testing_calibration") {
                  this.ioDeartment.push({ title: 'TCL', value: item })
                }
                if (item == "pt_providers") {
                  this.ioDeartment.push({ title: 'PTP', value: item })
                }
                if (item == "health_care") {
                  this.ioDeartment.push({ title: 'HP', value: item })
                }
                if (item == "halal_conformity_bodies") {
                  this.ioDeartment.push({ title: 'HCAB', value: item })
                }
                // if(item == "work_permit"){
                //   this.ioDeartment.push({title:'WAP', value: item})
                // }
                // if(item == "no_objection"){
                //   this.ioDeartment.push({title:'NOC', value: item})
                // }
              });
              this.ioDeartment.sort((a, b) => (a.title > b.title) ? 1 : -1);
              if (this.ioDeartment.length == 1) {
                this.selectDepartment = this.ioDeartment[0].value;
                this.changeDepartmentView(this.selectDepartment);
              }
            }

            //Get recent updates
            if (this.dashboardItemData.lastLogin != undefined) {
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
              //console.log(datePart, " == ", date, " -- ",time);  
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Last Login ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }

            if (this.dashboardItemData.lastAccrApplied != undefined) {
              let datePart: any = this.dashboardItemData.lastAccrApplied.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", " + this.getFormType(this.dashboardItemData.lastAccrAppliedFormName) + " Application has been received ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }
            if (this.dashboardItemData.lastRegApplied != undefined) {
              let datePart: any = this.dashboardItemData.lastRegApplied.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", " + this.getFormType(this.dashboardItemData.lastRegAppliedFormName) + " Application has been received ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }
            if (this.dashboardItemData.lastTrainingApplied != undefined) {
              let datePart: any = this.dashboardItemData.lastTrainingApplied.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", " + this.getFormType(this.dashboardItemData.lastTrainingAppliedFormName) + " Application has been received ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }
            if (this.dashboardItemData.lastAccrPayment != undefined) {
              let datePart: any = this.dashboardItemData.lastAccrPayment.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Accreditaion Payment details of " + this.getFormType(this.dashboardItemData.lastAccrPayFormName) + " Updated ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }
            if (this.dashboardItemData.lastRegPayment != undefined) {
              let datePart: any = this.dashboardItemData.lastRegPayment.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Registration Payment details of " + this.getFormType(this.dashboardItemData.lastRegPayFormName) + " Updated ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }
            if (this.dashboardItemData.lastTrainingPayment != undefined) {
              let datePart: any = this.dashboardItemData.lastTrainingPayment.toString().split(" ");
              let dateStr: string = datePart[0] + " " + datePart[1];
              let titleText: string = this.userDetails.first_name + " " + this.userDetails.last_name + ", Training Payment details of " + this.getFormType(this.dashboardItemData.lastTrainingPayFormName) + " Updated ";
              this.dashboardRecentUpdates.push({ title: titleText, date: dateStr });
            }

          }
          //console.log(">>>> Load Data: ", res, " == ", this.dashboardRecentUpdates);

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
      { field: 'Customer ID', value: 'CAB Code' },
      { field: 'Candidate', value: 'Candidate' },
      { field: 'Trainer', value: 'Trainer' },
      { field: 'Assessor', value: 'Assessor' },
      { field: 'Super Admin', value: 'Super Admin' }
    ];
    this.userType = localStorage.getItem('type');
    this.userEmail = localStorage.getItem('email');
    this.userId = localStorage.getItem('userId');


    // if(localStorage.getItem("io_dept") != '' && localStorage.getItem("io_dept") != undefined){
    //     this.selectDepartment = localStorage.getItem("io_dept").toString();
    //     this.changeDepartmentView(this.selectDepartment);
    // }

    // setTimeout(() => {
    //   this.loadDashData();
    // }, 100)   
    this.loadRecordsData();
    this.loadCountryStateCityAll();

    if (this.userType != 'operations') {
      var landUrl = '/dashboard' + this.userType + '/home'
      this.router.navigateByUrl(landUrl);
    }

    this.loader = false;

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.profileService + '?userType=' + this.userType + '&email=' + this.userEmail)
      .subscribe(
        res => {
          this.loader = true;
          console.log(">>> User Profile: ", res);
          this.userDetails = res['data']['user_data'][0];
          if (this.userDetails != undefined && this.userDetails != null) {
            this.loadDashData();
          }
        });

    //this.getMessageList();

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          console.log("@message detete: ", res);
          this.loader = true;
        });

    // this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=cab_client&searchKey=')
    //   .subscribe(
    //     res => {
    //       this.searchDetails = [];
    //       // this.selectSearch = [];
    //       this.searchDetails = res['data'].user_list;
    //       // this.selectSearch = res['data'].user_list;
    //     }, err => {
    //       this.loader = true;
    //     });

  }


  getMessageList() {
    console.log("@@@@Load list...........");
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          this.loader = true;
        });
  }



  setField(value) {
    // this.search(this.searchTerm);
    this.selectedUser = [];
    //this.loader = false;
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

    // this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=' + this.getUserType + '&searchKey=')
    //   .subscribe(
    //     res => {
    //       this.searchDetails = res['data'].user_list;
    //       this.loader = true;;
    //       // this.search(this.searchTerm);

    //     }, err => {
    //       this.loader = true;
    //     });

  }

  getRouteId(routeId) {
    localStorage.setItem('routeId', routeId);
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
    console.log("@Submit User: ", this.selectedUserId);
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
              setTimeout(() => {
                //callback
              }, 1000);
            }
          }, err => {
            this.loader = true;
          })
    }
  }

  getValue(value, data) {
    this.fruitInput.nativeElement.blur();
    this.selectedUser = [];
    //this.selectedUserId = value.id;
    this.selectedUserId = (data == 'cab_name' || data == 'cab_code') ? value.user_id : value.id;
    console.log("@Getvalue: ", value, " :: ", data, "--", this.selectSearch);
    this.button_disable = this.selectedUserId != '' ? false : true;
    if (data == 'cab_name') {
      this.selectedUser.push(value.cab_name);
    } else if (data == 'cab_code') {
      this.selectedUser.push(value.cab_code);
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
    localStorage.setItem('messageUserDetails', JSON.stringify(user));
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

  enterInput(theEvt: any) {
    if (this.selectedUser.length > 0) {
      this.selectSearch = [];
      theEvt.preventDefault();
      return;
    }
  }

  changeInput(){
    console.log("@change input...");
    if(this.selectSearch.length > 0) {
      this.selectSearch = [];
    }
  }

  search(query: string) {
    if (this.selectedUser.length > 0) {
      this.selectSearch = [];
      return;
    }
    this.select(query);
    // let result = this.select(query);
    // console.log("@return: ", result);
    // if (query != '') {
    //   this.selectSearch = result;
    // } else {
    //   this.selectSearch = [];
    // }
  }

  select = (query: string) => {
    let result: string[] = [];
    //let re = new RegExp(query, 'gi');
    console.log("### ", query);
    console.log(this.subscription);
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    if (query != '') {
      this.subscription = this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=' + this.getUserType + '&searchKey=' + query)
        .subscribe(
          res => {
            this.searchDetails = res['data'].user_list;
            this.loader = true;
            // this.search(this.searchTerm);
            console.log("@get User: ", this.searchDetails);
            this.selectSearch = this.searchDetails;

          }, err => {
            this.loader = true;
          });
    } else {
      this.selectSearch = [];
    }


    /*if (this.getUserType == 'cab_client' || this.getUserType == 'cab_code') {
      for (let a of this.searchDetails) {
        //console.log(">>>, ",a);
        //if (a.cab_name.toLowerCase().indexOf(query) > -1) {
        if(a.cab_name != null && a.cab_name != '' && this.getUserType == 'cab_client'){          
          if(re.exec(a.cab_name)){ 
            result.push(a); 
          }
          // if (a.cab_name.toString().toLowerCase().indexOf(query) > -1) {
          //   result.push(a);
          // }
        }else if(a.cab_code != null && a.cab_code != '' && this.getUserType == 'cab_code'){
          // if (a.cab_code.toString().toLowerCase().indexOf(query) > -1) {
          //   result.push(a);
          // }
          if(re.exec(a.cab_code)){ 
            result.push(a); 
          }
        }  
      }
    } else {
      for (let a of this.searchDetails) {
        if(re.exec(a.email)){ 
          result.push(a); 
        }
        // if (a.email.toLowerCase().indexOf(query) > -1) {
        //   result.push(a);
        // }
      }
    }*/

    // this.searchDetails = result;
    //return result;
  }


}
