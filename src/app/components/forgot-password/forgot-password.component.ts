import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/services/constant.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [Constants, AppService, ToastrService]
})
export class ForgotPasswordComponent implements OnInit {

  forgotPassword: FormGroup;
  constructor(public appService: AppService, public constant:Constants,public toastr: ToastrService,public signinBuild: FormBuilder) {
    // this.forgotPassword = signinBuild.group({
    //   email: ["",[Validators.required,Validators.pattern("^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@" + "[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$")]],
    // });
    this.forgotPassword = new FormGroup({
      email:    new FormControl('', 
      [Validators.required,Validators.pattern("^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@" + "[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$")]),
    });
   }

  ngOnInit() {
  }

  isValid(){
    if(!this.appService.checkInput('email', this.forgotPassword.get('email').value)){
      this.toastr.error('Email is InValid','Validation Error', {timeOut: 3000});
      ////console.log("email invalid....");
      // this.store.dispatch(new LogInFailure({ error: 'Email is InValid' }));
      return false;
    }
    return true;
  }

  onSubmit() {
    if(this.isValid()){
      //console.log(this.forgotPassword.value);
      this.toastr.success('Email link is sent to your account','', {timeOut: 3000});
    }
  }

}
