import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

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


  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) { }

  ngOnInit() {
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

    if (this.userType != 'operations') {
      var landUrl = '/dashboard' + this.userType + '/home'
      this.router.navigateByUrl(landUrl);
    }

    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.messageList + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          // console.log(this.messageList);

          this.loader = true;
          // console.log(res['data'].message_list);
        });

    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-user-list' + '?type=cab_client&searchKey=S')
      .subscribe(
        res => {
          this.searchDetails = [];
          // this.selectSearch = [];
          this.searchDetails = res['data'].user_list;
          // this.selectSearch = res['data'].user_list;
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

        });

  }

  getRouteId(routeId) {
    sessionStorage.setItem('routeId', routeId);
  }

  validateFile(fileEvent: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.') + 1, file_name.length);
    var ex_type = ['pdf', 'xlsx', 'xlx'];
    var ex_check = this.Service.isInArray(file_exe, ex_type);
    if (ex_check) {
      this.chatMessage.upload_message = fileEvent.target.files[0].name;
      this.chatMessageFile.append('upload_message_file', fileEvent.target.files[0]);
      this.file_validation = true;
      return true;
    } else {
      this.file_validation = false;
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
    console.log(ngForm);

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

  getValue(value) {
    this.selectedUserId = value;

  }

}
