import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/services/constant.service';
import { Router, ActivatedRoute} from '@angular/router'
// import { filter} from 'rxjs/operators';
import { HttpClient  } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  forgotPassword: FormGroup;
  changePasswordForm:any = {};
  public passblock: boolean = false;
  public passConfBlock: boolean = false;
  // resetId:any;
  @Input() resetId:any;
  // param:any = 'reset-id';

  constructor(private router: Router,public appService: AppService, public constant:Constants,public toastr: ToastrService,public signinBuild: FormBuilder,public route: ActivatedRoute,public http:HttpClient) { 
    // this.resetId = this.route.snapshot.params.param1;
    // //console.log(this.resetId,'resetId');
    this.forgotPassword = new FormGroup({
      password:    new FormControl('', 
      [Validators.required]),
      confirmPassword:    new FormControl('', 
      [Validators.required]),
    });

  }

  passwordDisplay(type: string){
    if(type === 'normal'){
      this.passblock = !this.passblock;
    }else{
      this.passConfBlock = !this.passConfBlock;
    }
  }

  checkPassword(event: any, type: string){
      var theObject = event;
      var theValue  = theObject.target.value;
      this.changePasswordForm.passwordStrength[type] = {};
      this.changePasswordForm.passwordStrength[type]['pcLengthValue'] = 0;
      this.changePasswordForm.passwordStrength[type]['pcUpperValue'] = 0;
      this.changePasswordForm.passwordStrength[type]['pcLowerValue'] = 0;
      this.changePasswordForm.passwordStrength[type]['pcNumberValue'] = 0;
      this.changePasswordForm.passwordStrength[type]['pcSpecialValue'] = 0;

      let lengthCharacters      = /^([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){9,}$/;
      let upperCaseCharacters   = /[A-Z]+/g;
      let lowerCaseCharacters   = /[a-z]+/g;
      let numberCharacters      = /[0-9]+/g;
      let specialCharacters     = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

      if (lengthCharacters.test(theValue) === true) {
        this.changePasswordForm.passwordStrength[type]['pcLengthValue']   = 1;
      }
      if(upperCaseCharacters.test(theValue) === true) {
        this.changePasswordForm.passwordStrength[type]['pcUpperValue']    = 1;
      }
      if (lowerCaseCharacters.test(theValue) === true) {
        this.changePasswordForm.passwordStrength[type]['pcLowerValue']    = 1;
      }
      if (numberCharacters.test(theValue) === true) {
        this.changePasswordForm.passwordStrength[type]['pcNumberValue']   = 1;
      }
      if (specialCharacters.test(theValue) === true) {
        this.changePasswordForm.passwordStrength[type]['pcSpecialValue']  = 1;
        this.changePasswordForm.passwordStrength[type]['checkPassword']   = 1;
      }
  }

  validCheckPassword(type: string){
      var checkClass = '';
      switch(type){
          case 'password':
            if(this.changePasswordForm.passwordStrength[type].checkPassword === 1){
              checkClass = 'checkbutton checkactive';
            }
            if(this.changePasswordForm.password == '' || !this.checkStrongPasswordType(type)){
              checkClass = 'checkbutton';
            }
          break;
      }
      return checkClass;
  }

  checkStrongPasswordType(type: string){
      var checkedType = true;
      var typeObject  = this.changePasswordForm.passwordStrength[type];
      for (const [key, value] of Object.entries(typeObject)) {
          if(!value && key != undefined){
            return false;
          }
      }
      return checkedType;
  }

  ngOnInit() {
    // this.resetId = this.route.snapshot.queryParamMap.get('reset-id');
    // this.resetId = this.route.snapshot.paramMap.get("id");

    this.changePasswordForm.password   = '';
    this.changePasswordForm.confirmPassword   = '';
    this.changePasswordForm.passwordStrength  = {};
    this.changePasswordForm.passwordStrength['password'] = {};
    this.changePasswordForm.passwordStrength['confirmPassword'] = {};
  }

  isValid(){
    if(this.changePasswordForm.password  == '' ){
      this.toastr.error("Password can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    if(this.changePasswordForm.confirmPassword  == '' ){
      this.toastr.error("Confirm Password can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    if(this.changePasswordForm.password  != '' && 
    this.changePasswordForm.confirmPassword != '' &&
    this.changePasswordForm.confirmPassword != this.changePasswordForm.password){
      this.toastr.error('Confirm password not match.','Validation Error', {timeOut: 3000});
      return false;
    }
    if(!this.checkStrongPasswordType('password')){
      this.toastr.error('Password strength failed','Validation Error', {timeOut: 3000});
      return false;
    }
    if(!this.checkStrongPasswordType('confirmPassword')){
      this.toastr.error('Confirm Password strength failed','Validation Error', {timeOut: 3000});
      return false;
    }
    return true;
  }

  resetPassword() {
    
    var splitId = this.resetId.split('=');
    var splitEmail = splitId[1].split('&');
    
    var email = splitEmail[0];
    var hash = splitId[2];

    if(this.isValid()){
      this.changePasswordForm.resetId = this.resetId;
      // //console.log(this.forgotPassword.value,'forgotPassword');
      var passwordHash = btoa(this.changePasswordForm.confirmPassword);
      this.appService.getwithoutData(this.appService.apiServerUrl+"/"+this.constant.API_ENDPOINT.userPasswordReset+'?email='+email+'&hash='+hash+'&password='+passwordHash)
      .subscribe(
        res => {
          if(res['status'] != true) {
            this.toastr.success('Password change successfully','', {timeOut: 3000});
            this.router.navigateByUrl('/sign-in');
          }
        });
    }
  }

}
