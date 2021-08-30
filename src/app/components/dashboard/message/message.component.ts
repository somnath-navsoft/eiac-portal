import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

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
  selectedUserId: any;
  document: any = '';
  documentName: any = '';
  localUrl: any;
  button_disable: any = true;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];
  addOnBlur = true;
  selectedUser: any = [];
  config: any;
  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) {
    this.config = {
      itemsPerPage: this.Service.messagePagination,
      currentPage: 1,
    };
  }

  ngOnInit() {

    this.getUserType = 'cab_client';
    this.select_field = [
      { field: 'CAB Name', value: 'CAB Name' },
      { field: 'Customer ID', value: 'Customer ID' },
      { field: 'Candidate', value: 'Candidate' },
      { field: 'Trainer', value: 'Trainer' },
      { field: 'Assessor', value: 'Assessor' },
      { field: 'Super Admin', value: 'Super Admin' }
    ];
    this.userType = localStorage.getItem('type');
    this.userEmail = localStorage.getItem('email');
    this.userId = localStorage.getItem('userId');

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

  enterInput(theEvt: any) {
    console.log("@select....", this.selectSearch, " -- ", this.selectedUser);
    if (this.selectedUser.length > 0) {
      this.selectSearch = [];
      theEvt.preventDefault();
      return;
    }
  }
  enterInputClick() {
    console.log("@select....", this.selectSearch, " -- ", this.selectedUser);
    if (this.selectSearch.length > 0) {
      this.selectSearch = [];
    }
  }

  search(query: string) {
    // this.searchTerm = query;
    // let result = this.select(query);
    // // this.searchDetails = result;
    // if (query != '') {
    //   this.selectSearch = result;
    // } else {
    //   this.selectSearch = [];
    // }

    if (this.selectedUser.length > 0) {
      this.selectSearch = [];
      return;
    }
    this.select(query);

  }

  changeInput(){
    console.log("@change input...");
    if(this.selectSearch.length > 0) {
      this.selectSearch = [];
    }
  }

  select(query: string) {

    let result: string[] = [];
    //let re = new RegExp(query, 'gi');
    console.log("### ", query);
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
    if (query != '') {
      this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=' + this.getUserType + '&searchKey=' + query)
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
    /*
    let result: string[] = [];
    if (this.getUserType == 'cab_client' || this.getUserType == 'cab_code') {
      for (let a of this.searchDetails) {
          console.log(a)
        // if (a.username.toLowerCase().indexOf(query) > -1) {
        //   result.push(a);
        // }
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
    */
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
    if (this.selectedField == 'Customer ID') {
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

    // this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=' + this.getUserType + '&searchKey=S')
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

  // getValue(value, data) {
  //   this.fruitInput.nativeElement.blur();
  //   this.selectedUser = [];
  //   this.selectedUserId = value.id;
  //   this.button_disable = this.selectedUserId != '' ? false : true;
  //   if (data == 'username') {
  //     this.selectedUser.push(value.username);
  //   } else {
  //     this.selectedUser.push(value.email);
  //   }
  //   this.fruitInput.nativeElement.value = '';
  //   this.fruitInput.nativeElement.blur();


  // }


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

}
