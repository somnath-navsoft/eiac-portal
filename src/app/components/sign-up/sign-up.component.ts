import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'portal-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [Constants, AppService, ToastrService]
})
export class SignUpComponent implements OnInit {
  userData:any = {};
  roleRecord:any;
  changePasswordForm: any = [];
  public checkCaptchaValidation:boolean = false;
  public checkSecurity:boolean = false;
  public passblock: boolean = false;
  public passConfBlock: boolean = false;
  loader:boolean = true;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.changePasswordForm.password   = '';
    this.changePasswordForm.cpassword   = '';
    this.changePasswordForm.passwordStrength  = {};
    this.changePasswordForm.passwordStrength['password'] = {};
    this.changePasswordForm.passwordStrength['cpassword'] = {};
    this.getRole();
    ////console.log(this.roleRecord);

    this.userData.name = '';
    this.userData.mobile = '';
    this.userData.code = '';
    this.userData.userType = '';
  }

  checkDisposableEmail(theEmail: any){
    //https://gist.github.com/adamloving/4401361 == disposable emails
      //console.log("@Email: ", theEmail.target.value.toString());
      let emailReg: any             = /^([\w-\.]+@(([\w-]+\.)+[\w-]{2,4}))?$/;
      let emailAddressVal: string   = theEmail.target.value.toString();
      let bad_domains               = ['yopmail.com', 'zoemail.org', '2prong.com','clickemail.com','minutemail.com','prong.com','hosting.com','hosting.net','tags.com','ajaxapp.net',
                                      'amiri.net','amiriindustries.com','anonbox.net','antispam.de','beefmilk.com','binkmail.com','dacoolest.com',
                                      'dandikmail.com','deadaddress.com','deadspam.com','mailinator.com','fizmail.com','get1mail.com','frapmail.com','gishpuppy.com','gowikicars.com','gowikifilms.com','gowikinetwork.com','gowikitravel.com','haltospam.com','keepmymail.com','klzlk.com','kurzepost.de','mailcatch.com','mailinator.net','neomailbox.com','nowmymail.com','pookmail.com','zoaxe.com','zoemail.org','trash-amil.com','supermailer.jp','spambob.com','rejectmail.com',
                                      'ourklips.com','moburl.com','spamify.com','tempalias.com','nobulk.com','sandelf.de','twinmail.de','wegwerfmail.de','jetable.net','greensloth.com','dodgit.com',
                                      ];

      if(this.Service.checkInput('email',emailAddressVal)){
        let emailMatch: any                = emailAddressVal.match(emailReg);      
        let domain: string                    = '';
        console.log(">>> ", bad_domains.length);
        if(typeof emailMatch == 'object' && emailMatch[2] != undefined && emailMatch[2] != null){
          domain = emailMatch[2];
        }
        if(domain != ''){
          for(var i = 0; i < bad_domains.length; i += 1) {
            if(domain.toLowerCase() == bad_domains[i]){
              this.toastr.warning("Sorry! we don't allow disposable email addresses.Please try a different email account.","", {timeOut: 5000});
              this.userData.email = null;
            }                
          }
        }
      }            
  }

  getRole(){
    // this.roleRecord = this._portalServ.getUserRole();
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

  isValid()
  {
    if(this.userData.email  == '' ){
      this.toastr.error("Email can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    if(!this.Service.checkInput('email',this.userData.email )){
      this.toastr.error('Email is Invalid','Validation Error', {timeOut: 3000});
      return false;
    }
    
    if(this.userData.name  == '' ){
      this.toastr.error("Name can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    if(this.userData.code  == '' ){
      this.toastr.error("Please type any area code","Validation Error", {timeOut: 3000});
      return false;
    }
    if(this.userData.mobile  == '' ){
      this.toastr.error("Mobile Number can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    // if(this.userData.mobile  != '' && this.userData.mobile.length!=10){
    //   this.toastr.error("Mobile Number should be 10 digit","Validation Error", {timeOut: 3000});
    //   return false;
    // }
    // if(this.userData.mobile_code  == '' ){
    //   this.toastr.error("Mobile Code Number can't be empty","Validation Error", {timeOut: 3000});
    //   return false;
    // }
    if(this.changePasswordForm.password  == '' ){
      this.toastr.error("Password can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    if(this.changePasswordForm.cpassword  == '' ){
      this.toastr.error("Confirm Password can't be empty","Validation Error", {timeOut: 3000});
      return false;
    }
    // if(this.userData.email  != '' && 
    // this.userData.cemail != '' &&
    // this.userData.cemail != this.userData.email){
    //   this.toastr.error('Confirm email not match.','Validation Error', {timeOut: 3000});
    //   return false;
    // }
    if(!this.checkStrongPasswordType('password')){
      this.toastr.error('Password strength failed','Validation Error', {timeOut: 3000});
      return false;
    }
    if(!this.checkStrongPasswordType('cpassword')){
      this.toastr.error('Confirm Password strength failed','Validation Error', {timeOut: 3000});
      return false;
    }

    if(this.changePasswordForm.password  != '' && 
    this.changePasswordForm.cpassword != '' &&
    this.changePasswordForm.cpassword != this.changePasswordForm.password){
      this.toastr.error('Confirm password not match.','Validation Error', {timeOut: 3000});
      return false;
    }

    if(this.userData.userType  == '' ){
      this.toastr.error("Please select your reason for registration","Validation Error", {timeOut: 3000});
      return false;
    }

    if(this.userData.terms_condition != true) {
      this.toastr.error("Please select terms and conditions","Validation Error", {timeOut: 3000});
      return false;
    }

    if(this.checkCaptchaValidation != true) {
      this.toastr.error("Please select captcha","Validation Error", {timeOut: 3000});
      return false;
    }
    
    return true;
  }

  passwordDisplay(type: string){
    if(type === 'normal'){
      this.passblock = !this.passblock;
    }else{
      this.passConfBlock = !this.passConfBlock;
    }
  }

  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
  }

  onSubmit(ngForm:any) {
    // //console.log(this.userData.cpassword,'password');
    if(this.isValid()){
      this.loader = false;
      this.userData.password = this.changePasswordForm.password;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.signUp,this.userData)
        .subscribe(
          res => {
            // console.log(res,'res')
            this.loader = true;
            if(res['status'] == true) {
              this.toastr.success('Successfully registered with EIAC, Please check your email for verifying', '');
              this.router.navigateByUrl('/sign-in');
            }else{
              let getMsg = res['msg'];
              //alert(getMsg);
              if(getMsg == 'Sorry! this email-id alreadty exist'){
                this.toastr.warning("Email ID already exists", '');
              }else{
                this.toastr.warning(res['msg'], '');
              }
            }
          });
      ////console.log("validation done...resetting password...");
    }
  }
}
