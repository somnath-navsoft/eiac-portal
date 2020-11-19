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
  messageDetail: any;
  message: any;
  document: any = '';
  attachedFile: string;
  documentName: any = '';
  localUrl: string;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService) { }

  ngOnInit() {

    this.replyMessageId = this.router.url.toString().split('/')[3];
    this.loader = false;
    this.userType = sessionStorage.getItem('type');
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.userId = sessionStorage.getItem('userId');
    this.getMessage();
  }

  getMessage() {
    this.loader = false;
    // https://dev-service.eiac.gov.ae/webservice/message-list/message_id=12  
    this.Service.getwithoutData(this.Service.apiServerUrl + "/" + 'message-list?message_id=' + this.replyMessageId + "&user_id=" + this.userId)
      .subscribe(
        res => {
          this.messageList = res['data'].message_list;
          console.log(this.messageList);
          this.loader = true;

        });
  }

  validateFile(fileEvent: any) {
    this.localUrl = URL.createObjectURL(fileEvent.target.files[0]);
    this.document = fileEvent.target.files[0];
    var file_name = fileEvent.target.files[0].name;
    this.documentName = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.') + 1, file_name.length);
    var ex_type = ['pdf'];
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
      this.chatMessage.user_id = this.userId;
      this.chatMessage.message_id = this.replyMessageId;
      let formdata = new FormData();
      formdata.append('user_id', this.userId);
      formdata.append('message_id', this.replyMessageId);
      formdata.append('message_type', 'reply');
      formdata.append('message', this.chatMessage.message);
      formdata.append('document', this.document);
      this.loader = false;
      this.Service.put(this.Service.apiServerUrl + "/" + 'message-list/', formdata)
        .subscribe(
          res => {
            if (res['status'] == true) {
              this.chatMessage.message = '';
              this.chatMessage.upload_message = '';
              this.loader = true;
              this.toastr.success(res['msg'], '');
              this.getMessage();
            }
          })
    }
  }

  showFile() {
    window.open(this.localUrl, '_blank');
  }

}
