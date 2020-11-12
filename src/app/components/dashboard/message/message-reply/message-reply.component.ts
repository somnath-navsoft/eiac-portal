import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-reply.component.html',
  styleUrls: ['./message-reply.component.scss']
})
export class MessageReplyComponent implements OnInit {

  userType: any;
  userEmail: any;
  chatMessage: any = {};
  file_validation: boolean = true;
  chatMessageFile: any = new FormData();
  loader: boolean = true;
  messageList: any;
  userId: any;
  replyMessageId: any;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) { }

  ngOnInit() {

    this.replyMessageId = this.router.url.toString().split('/')[3];
    console.log(this.replyMessageId);

    this.userType = sessionStorage.getItem('type');
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    // if (this.userType != 'operations') {
    //   var landUrl = '/dashboard' + this.userType + '/home'
    //   this.router.navigateByUrl(landUrl);
    // }
    this.getMessage();
  }

  getMessage() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + this.constant.API_ENDPOINT.replyMessage + '?id=' + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          // console.log(this.messageList);

          this.loader = true;
          // console.log(res['data'].message_list);
        });
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

}
