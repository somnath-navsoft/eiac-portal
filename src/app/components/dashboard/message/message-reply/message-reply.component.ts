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
  }

}
