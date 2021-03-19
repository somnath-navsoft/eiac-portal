import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
//import { API } from 'src/app/appServices/constant';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
//import { PortalBoardService } from 'src/app/services/portal-board.service';

//import { AuthService } from "angularx-social-login";
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
//import { UiDialogService } from 'src/app/services/uiDialog.service';

import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../store/app.states';
import { LogIn, LogInFailure } from '../../store/actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';



//PortalBoardService
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [Constants, AppService, ToastrService]
})
export class SigninComponent {

  hide = true;
  signin: FormGroup;
  //user: any;
  public checkRemember: boolean = false;
  public messgeList: any = [];
  public userObject: User;
  public httpLoader: boolean = false;
  public validError:boolean = false;
  public validErrorMesg: string = '';
  public inputErrorValidation: any = {};
  public emailValue: string = '';
  public subscriptions: Subscription[] = [];

  public passblock:boolean = false;
  //Password checking declaration --- START
  changePasswordForm: any = {};
  //Password checking declaration --- END
  public roleRecord: any[]=[];
  public authLoginData: any = {}; 
  public loader: boolean = false; 
  
  
  user: User = new User();
  getState: Observable<any>;
  errorMessage: string | null;
  public checkCaptchaValidation:boolean = false;
  public checkSecurity:boolean = false;

  //public _portalServ: PortalBoardService 
  constructor(public appService: AppService, public constant:Constants,
              private store: Store<AppState>, private authService: AuthService,
              public signinBuild: FormBuilder , public router: Router, public _snackBar: MatSnackBar,public toastr: ToastrService
              ) {
    this.signin = new FormGroup({
      email:    new FormControl('', 
      [Validators.required,Validators.pattern("^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@" + "[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$")]),
      password: new FormControl(''),
      userRole: new FormControl('',[Validators.required])
    });
    //this.getState = this.store.select(selectAuthState);
    
  }

  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  passwordDisplay(){
     this.passblock = !this.passblock;
  }
  /******************************
   *
   * @Functionality
   * Change Password UI
   *
   ******************************/
  checkPassword(type: string,event?: any){
    var theValue = '';
    if(event != undefined){
      var theObject = event;
      theValue  = theObject.target.value;
    }else{
      theValue = this.changePasswordForm.password;
    }
    
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

  isValid(){
    ////console.log(this.signin.get('email').value, " :: ", this.signin.get('userRole').value, " --- ", this.signin.value);
    if(this.signin.get('email').value == ''){
      this.toastr.error('Email is InValid','Validation Error', {timeOut: 3000});
      ////console.log("email invalid....");
      // this.store.dispatch(new LogInFailure({ error: 'Email is InValid' }));
      return false;
    }
    if(this.signin.get('password').value == ''){
      // this.store.dispatch(new LogInFailure({ error: 'Password strength failed' }));
      this.toastr.error("Password can't be blank",'Validation Error', {timeOut: 3000});
      return false;
    }
    // if(this.signin.get('userRole').value === ''){
    //   //this.toastr.error('Please select Role','Validation Error', {timeOut: 3000});
    //   return false;
    // }
    if(this.checkCaptchaValidation != true) {
      
      this.toastr.error("Please select captcha","Validation Error", {timeOut: 3000});
      return false;
    }
    return true;
  }
  createLogin(){
    ////console.log("Login creating....");
    //Check remeber status action
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('RememberMe');
    if(this.checkRemember){
      localStorage.setItem('email', this.signin.get('email').value);
      localStorage.setItem('password', this.changePasswordForm.password);
      localStorage.setItem('RememberMe',JSON.stringify(this.checkRemember));
    }
    //Check remeber status action
    if(this.isValid()){
      this.signin.get('password').setValue(this.changePasswordForm.password);
      let formObject: any;
      formObject = this.signin.value;
      ////console.log("validate...", formObject, " - ", this.signin.get('email').value);
      this.loader = true;

      const payload = {
        email: this.signin.get('email').value,
        password: this.signin.get('password').value
      };
      this.store.dispatch(new LogIn(payload));      
    }
  }
  ngOnInit() {
    //Define different input validation messages
    // console.log(this.constant.logType,'logType');
    this.inputErrorValidation.emailValidation = '';

    //Pass checking
    this.changePasswordForm.password   = '';
    this.changePasswordForm.passwordStrength  = {};
    this.changePasswordForm.passwordStrength['password'] = {};
    //////console.log("@@@@role...");
    //Check previous remeber me 
    if(localStorage.getItem('email') != null && localStorage.getItem('password') != null && 
       localStorage.getItem('RememberMe') != null){
         
      let emailValue: string         = localStorage.getItem('email');
      let passValue: string          = localStorage.getItem('password');
      //this.userObject.email   = this.emailValue;
      //////console.log('get remember me value...', emailValue, " :: ", passValue, " -- ", this.changePasswordForm);
      this.signin.get('email').setValue(emailValue);
      this.changePasswordForm.password = passValue;
      this.checkPassword('password');
      //////console.log('get remember me value...', emailValue, " :: ", passValue, " -- ", this.changePasswordForm);
      this.checkRemember  = JSON.parse(JSON.stringify(localStorage.getItem('RememberMe')));
    } 
    this.authService.appErrorStack.subscribe(response => {
      ////console.log("Result Message: ", response);
      let data: any = response;
      // console.log(data.payload,'hgfffffffffffffffffff');
      if(data != undefined && data.payload != undefined && data.payload.error != '' ){
         this.errorMessage = data.payload.error;
      }
    })
    //this.getRole();
  }
}
