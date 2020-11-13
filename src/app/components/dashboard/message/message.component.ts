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
  myControl = new FormControl();
  options: string[] = ['One Four', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.select_field = [
      { field: 'CAB Name', value: 'CAB Name' },
      { field: 'CAB Code', value: 'CAB Code' },
      { field: 'Candidate', value: 'Candidate' },
      { field: 'Trainer', value: 'Trainer' },
      { field: 'Assesor', value: 'Assesor' },
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



  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  setField(value) {
    console.log(value);

    this.selectedField = value;
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

}
