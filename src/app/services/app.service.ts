import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import {Http, Headers, RequestOptions} from '@angular/http';
import { from, Subject, Subscription } from 'rxjs';
import {BehaviorSubject}  from "rxjs";
import { VERSION, MatDialogRef, MatDialog, MatDatepicker, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
//import {HappinessMeterComponent} from '../pages/common-all/happiness-meter/happiness-meter.component';
import { Observable} from 'rxjs'; 
import * as jwt_decode from 'jwt-decode';
import { Constants} from  './constant.service';

import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../store/app.states';
import { LogOut, LogInSuccess } from '../store/actions/auth.actions';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Injectable()
export class AppService {
  currentlatitude: any;
  dashBoardPagination: any = 5;
  messagePagination: any = 10;

  //IShita
  // public apiServerUrl         =   'http://192.168.3.94:8000/webservice';
  // public apiRequestUrl        =   'http://192.168.3.94:8000/';

  //Amit
  public apiServerUrl         =   'http://192.168.7.28:8000/webservice';
  public apiRequestUrl        =   'http://192.168.7.28:8000/';

  //@UAT
  // public apiServerUrl         =   'https://uat-service.eiac.gov.ae/webservice';
  // public apiRequestUrl        =   'https://uat-service.eiac.gov.ae/';

  //@DEV
  // public apiServerUrl         =   'https://dev-service.eiac.gov.ae/webservice';
  // public apiRequestUrl        =   'https://dev-service.eiac.gov.ae/';


  public apiUatServerUrl         =   'https://uat-service.eiac.gov.ae/webservice';
  // public apiRequestUrl        =   'https://uat-service.eiac.gov.ae/';

  public countryURL           =   "https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json";
  public assetsBasePath       =   "https://uat-portal.eiac.gov.ae/assets/csc-json/";

  //https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json

  public regExName: any;
  public regExUrl: any;
  public regExCont: any;
  public regExAlphaNum: any;
  public regExNumb: any;
  public regExEmail: any;
  public nameOnly: any;
  user = null;
  public mapboxToken = 'pk.eyJ1IjoicHJpbmF2IiwiYSI6ImNrNmh4YXVpcTJwbnMzbm4zYTc1ZG5kbHIifQ.lEliOwWLfcau6c0McnkGUA';
  // private node:Subject<Node> = new BehaviorSubject();
  // dynamicVal:any;
  // dynamicVal: Subject<any> = new Subject<any>();
  public setValue: any;
  public setIBValue: any;
  public oldScopeData: any;
  userDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  publicuserData: any[] =[];
  public urlData = new Subject<any>();
  urlSubscription: Subscription;

  constructor(public http: HttpClient, private _constant: Constants,
    private _flashMessage: FlashMessagesService,public _router: Router,
    public dialog: MatDialog,public snackBar: MatSnackBar, private store: Store<AppState>) { 
      // this.dynamicVal = new Subject<any>();
      //initilize input type regex
      this.regExName = /^[a-zA-Z0-9(-/\\),.:_@#$%^&*!\s]*$/;///^[a-zA-Z\s]*$/;
      this.regExEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      this.regExCont = /^[a-zA-Z0-9(-/\\),.:_@#$%^&*!\s]*$/;
      this.nameOnly = /^[a-zA-Z\s]*$/;
      this.regExAlphaNum = /^[a-zA-Z0-9,.:@#$&\s]*$/;
      this.regExNumb = /^[0-9]*$/;
      this.regExUrl = '/(\w*\W*)?\w*(\.(\w)+)+(\W\d+)?(\/\w*(\W*\w)*)*/';

      //check token
      //this.setValue = 0;
      //this.userData = this.userDataSource.asObservable();
    }

    getFileName(fileName: string){
      let fname: any = fileName.split('/')[1].split('.')[0];
      console.log(fname);
      return fname;
    }

/*
function getFeesPerTrainee(training_days){
    // alert("val = "+training_days);
    var knowledgeFees = parseInt($('#knowledgeFees').val());
    var feesPerDay = parseInt($('#feesPerDay').val());
    var tax = parseFloat($('#tax').val());
    var investmentFees = parseInt($('#investmentFees').val());
    var afterWard = tax*training_days*feesPerDay;
    // alert("afterWard = "+afterWard);
    // alert("investmentFees = "+investmentFees);
    var fees_per_trainee = training_days*feesPerDay+knowledgeFees+investmentFees+afterWard;

    // alert("fees_per_trainee = "+fees_per_trainee);
    $('#fees_per_trainee').val(fees_per_trainee);
    $('#show_fees_per_trainee').html("<b>Fees per Trainee: </b>"+fees_per_trainee);

}

*/

getObjectLength(obj: any){
  let count: number =0;
  for(var key in obj){
    if(obj.hasOwnProperty(key)){
      count++;
    }
  }
  return count;
} 
setValueUrlIB(value: any) {
  // //console.log(">>assign IB value: ", value);
  //this.userDataSource.next(value);
  //this.setIBValue =  value;
  // const currentValue = this.userDataSource.value;
  // const updatedValue = [...currentValue, value];
  // this.userDataSource.next(updatedValue);
  this.urlData.next(value); 
}

removePlus(data) {
  return data.replace('+','');
}

setValueUrl(value?:any) {
  // //console.log(">>assign value: ", value);
  this.setValue =  value;
}
getValue(){
  // //console.log(">>get value: ", this.setValue);
  return this.setValue;
}
getValueIB(){
  setTimeout(() => {
    // //console.log(">>>getting val...",);
    return this.setValue;
  },100)
  
  // this.userData.subscribe(rec => {
  //     //console.log("<><><> Get Value: ", rec);
  // })
  //return this.setIBValue;
}

jsonToArray(data: any){
  var result = [];
  //console.log("get convert: ", data);
    for(var i in data){
      result.push([i,data[i]]);
    }
    //console.log("convert: ", result);
  return result;    
}

// getDynamic(): Observable<any> {
//   return this.dynamicVal.asObservable();
// }
// addDynamicsVal(data) {
 
//   this.dynamicVal.next({value: 2});
//   //console.log(data,'segsrgtd',this.dynamicVal);
// }

addMinutesToTime()
{
  var x = 30; //minutes interval
  var timesVal = []; // time array
  var timesKey = []; // time array
  var tt = 0; // start time
  var ap = [' AM', ' PM']; // AM-PM
  var newdutyTimeArr = [];

  for (var i=0;tt<24*60; i++) {
    var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
    var mm = (tt%60); // getting minutes of the hour in 0-55 format
    timesKey[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2) + ':00'; // pushing data in array in [00:00 - 12:00 AM/PM format]
    timesVal[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
    tt = tt + x;
    newdutyTimeArr.push({'key':timesKey[i],'val':timesVal[i]});
  }
  
  return newdutyTimeArr;
}

  decodeJWT(token: string){
    let decoded: any;
    if(token){
       decoded = jwt_decode(token); 
    }
    return decoded;
  }

  getToken(){
    return sessionStorage.getItem('token');
  }

  getUserType(){
    let getToken = this.getToken();
    let decodeToken: any;
    if(getToken != null){
      decodeToken = this.decodeJWT(getToken);
      ////console.log("@Decode: ", decodeToken);
      if(typeof decodeToken === 'object'){
        this._constant.logType = decodeToken.user_type;
      }
    }    
  }

  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    //setTimeout(() => this._input.nativeElement().focus()); //By focus if needed
  } 
  
  getAuthHeaders(){
    let header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${btoa(this.getToken())}`)
    }
    return header;
  }
  //{ "Accept": "application/json" }
  //        

  getReqHeadersUpload(){
    let header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.getToken()}`)
        .set("Accept", "application/json")
    }
    return header;
  }

  getReqHeaders(){
    let header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.getToken()}`)
    }
    return header;
  }

  updateStoreAuthenticated(){
    let getToken = this.getToken();
    if(getToken != '' && getToken != 'null'){
      ////console.log('store update....');
      this.store.dispatch(new LogInSuccess({token: getToken}));
    }
  }

  logOut(): void {
    this.store.dispatch(new LogOut(this.user));
  }

  //All Message dialog
  openMessageDialog(message: string, messageHeading: string, timeout?:number){
    this.snackBar.open(message, messageHeading, {
      duration: (timeout != undefined) ? timeout :this._constant.messageTimeout,
    });
  }

  //All Flash Message dialog
  openFlashMessage(message: string, messageType?: string, messageTime?:number){
    let typeMessage = (messageType != '' && messageType != undefined) ? messageType : 'alert-success';
    let timeoutMessage = (messageTime > 0) ? messageTime : this._constant.messageTimeout;
    this._flashMessage.show(
      message, { cssClass: typeMessage, timeout: timeoutMessage }
    );
  }

  //Filter text input inject
  inputFilter1(e: any) {
    //By ASCII
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  inputFilter(e: any, regType?:any) {
    ////////console.log('@ ',e, " - ", regType)
    //By Regular expression
    try {        
        let regEx = (regType === undefined) ? new RegExp(this.regExCont) : new RegExp(regType);
        if (regEx.test(e.key)) {
           ////////console.log('test true');
            return true;
        } else {
          ////////console.log('test false');
            e.preventDefault();
            return false;
        }
    } catch (ex) {
      ////////console.log('Exception: ',ex);
    }
  }
  stripHTML(theText: string, ...allowTags: any[]){
    let stripText: string = "";
    if(theText != undefined){
      if(allowTags.length > 0){
        stripText = theText.toString().replace(new RegExp(`<(?!\/?(${allowTags.join('|')})\s*\/?)[^>]+>`, 'g'), '');
      }else{
        stripText = theText.toString().replace(/<[^>]+>/g, '');
      }
    }
    return stripText;
  }
  returnCurrentDate()
  {
    return new Date(); 
  }

  isObjectEmpty(Obj) {
    for(var key in Obj) 
    {
      ////////console.log(key, " -- ", Obj);
      if(Obj.hasOwnProperty(key))
      return false;
    }
    return true;
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  stepDisable(){
    let urlVal: any= '';
    //console.log(">>> step: ", this._router.url);
    var wholeUrl = this._router.url;
    var splitUrl = wholeUrl.split('/');
    let pageName: any;
    
    //console.log(splitUrl);
    if(splitUrl[3] != undefined && splitUrl[3] != ''){
      pageName = splitUrl[3]; // page name - /
    }
    if(splitUrl[4] != undefined && splitUrl[4] != ''){
      urlVal = splitUrl[4];
    }
    if(urlVal != ''){

      let getData: any = JSON.parse(sessionStorage.getItem('userData'));

      ////console.log(">>> User Save data: ", getData);
      if(pageName === 'inspection-bodies-form' || pageName === 'health-care-form' || pageName == 'testing-calibration-form' || pageName == 'pt-providers-form'){
        if(getData.data.accredation_criteria == 2){
          ////console.log(">>step select: ", getData.data.accredation_criteria );
        return true;
        }

      }

      //let getId= (urlVal);
      //let url = this.apiServerUrl+"/"+'accrediation-details-show/'+getId;
      //////console.log(">>>Get url and ID: ", url, " :: ", getId);
      // this.getwithoutData(url)
      // .subscribe(
      //   res => {
      //     let getData: any = res;
      //     //console.log(">>> Get Data: ", getData);
      //     if(pageName === 'inspection-bodies-form' || pageName === 'health-care-form'){
      //       //console.log(">>> disable class...");
      //       if(getData.data.accredation_criteria == 2){
      //           // let stepData: any = stepRecords.find(item => item.title == 'information_audit_management');
      //           // //console.log(">>step select: 1 ", stepData);
      //           // if(stepData){
      //           //   stepData.activeClass = '';
      //           //   stepData.stepComp = true;
      //           // }
      //           return true;
      //       }
      //     }

      //   })
      
    }
    return false;
  }

  //------------------ Custom Step Function ---------------------
  traverseSteps(stepId: string,stepData: any[],target?:any){
      ////console.log('traverseSteps> ');

      let disableStep: boolean = false;
      disableStep = this.stepDisable();
      //console.log(">>> disable status: ", disableStep);
      
      if(stepData.length){
        let curStepIndex = stepData.findIndex(rec => rec.title === stepId.toString());
        if(curStepIndex >= 0 && curStepIndex < stepData.length){
            ////console.log('@Enter ....1');
            stepData.forEach((item,index) => {
                if(item.activeClass != '' && (item.activeClass === 'user-present' || item.activeClass === 'user-done')){
                  ////console.log('@Enter ....2 -- Find active class: ', item.activeClass, " -- index ",curStepIndex, " -- ", index );
                    if(index === curStepIndex){
                      let getSelData: any = stepData[index]
                      if(getSelData){
                        getSelData.activeClass = 'user-present';
                      }
                    }else{
                      item.activeClass = '';
                    }
                }
                if(index < curStepIndex && stepData[index].stepComp === true){
                  //console.log(">>> disable status: 2222 ", disableStep);
                  if(disableStep && stepData[index].title == 'information_audit_management'){
                    stepData[index].activeClass = '';
                  }else{
                    stepData[index].activeClass = 'user-done';
                  }
                  
                }
            })
        }
      }
      
  }

  headerStepMove(stepId: string,stepData: any[],sec?: string,target?:any){

    let stepElem = document.getElementById(stepId);
     let targetElem = document.getElementById(target);
     //search active steps
     let activeCurr = stepData.find(rec => rec.activeStep == true);
     let curStep = stepData.findIndex(rec => rec.title === stepId.toString());
    //  //console.log('Hedaers enter.....1')
     if(curStep > 0 || curStep == 0){
       if(curStep-1 < 0){
        if(activeCurr){
          activeCurr.activeStep = false;
         }
         stepData[curStep].activeStep = true;
       }
        var prevSteps = stepData[curStep-1];
        if(prevSteps){
            let prevStepComp = prevSteps.stepComp;
            if(!prevStepComp){
              return false;
            }else{
              if(activeCurr){
                activeCurr.activeStep = false;
               }
               stepData[curStep].activeStep = true;
            }
        }
        if(stepElem){
          // //console.log('Hedaers enter.....2')
          stepElem.style.display = 'block';
        }
     }
     if(targetElem){
      // //console.log('Hedaers enter.....3')
      targetElem.style.display = 'none';
    }else{
      // //console.log('Hedaers enter.....4')
      stepData[curStep].activeClass = 'user-present';
      var myClasses = document.querySelectorAll('.cust-stepper'),
          i = 0,
          l = myClasses.length;
       for (i; i < l; i++) {
          let elem: any = myClasses[i]
          if(myClasses[i].id != stepId){
            elem.style.display = 'none';
          }
      }
    }
    ////console.log("@Step Data: ", stepData);
    if(sec != '' && sec === 'menu'){
      // //console.log('Hedaers enter.....5')
      this.traverseSteps(stepId, stepData,target)
    }    
  }
 
   moveSteps(fromStep: string, toStep: string, stepData: any[]){
      let curStep     = stepData.find(rec => rec.title === fromStep);
      let findStep    = stepData.findIndex(rec => rec.title === toStep);
      if(findStep){
        stepData[findStep].activeClass = 'user-present';
        curStep.stepComp = true;
        curStep.activeClass = 'user-done';
        curStep.activeStep = false;
        stepData[findStep].activeStep = true;
        let prevTitle = stepData[findStep-1].title;
        let targetElem = document.getElementById(prevTitle.toString());
        targetElem.style.display = 'none';
      }
      // //console.log("#Step Data: ", stepData);
      this.headerStepMove(toStep, stepData);
  }

  moveJumpSteps(jumpStep: string, stepData: any[]){
      let jumpToStep = stepData.findIndex(rec => rec.title === jumpStep);
      // //console.log('Jumpstep: ', jumpToStep);
      if(jumpToStep){
        stepData.forEach((item,index) => {
            let theStep = item.title;
            let prevStep = '';
            let nextStep = '';
            let stepElem:any = '';
            if(index > jumpToStep){
              return;
            }
              if(index > 0){
                prevStep = stepData[index - 1].title;
              }
              if(index > 0 && index <= jumpToStep){
                nextStep = stepData[index + 1].title;
              }
              // //console.log(index, " - ", theStep, " << ", prevStep, " >> ", nextStep );
              if(prevStep != ''){
                this.moveSteps(prevStep,theStep, stepData);
              }
              if(prevStep != '' && index == (jumpToStep-1)){
                
                stepElem = document.getElementById(theStep);
                // //console.log('target...', stepElem);
                if(stepElem){
                  // //console.log('target opening...', theStep);
                  this.headerStepMove(theStep,stepData, '');
                  // //console.log('target opening...1');
                  // if(stepElem.style.display == 'none'){
                  //   //console.log('target opening...1');
                  //   stepElem.style.display = 'block';
                  // }
                  
                }
              }
        })
      }
  }



  //------------------ Custom Step Function ---------------------
    /*********************************************
       * @checkInput
       * @param:
       * inputParamas:       Type of validation        
       * modelInput:         model data value
       * Master Check Input function 
       * 
     *********************************************/
    allowCharacterAndDigitsOnly(e) {
      var k;
        document.all ? k = e.keyCode : k = e.which;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
    IsNumeric(e) {
      var keyCode = e.which ? e.which : e.keyCode;
      var ret = ((keyCode >= 48 && keyCode <= 57) || keyCode == 43);
      return ret;
    }
    isInArray(value, array) {
      return array.indexOf(value) > -1;
    }
    checkInput(inputParamas: string, modelInput: any){
      var resultValidInput = false;

      switch(inputParamas){
              case 'email':
              resultValidInput = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(modelInput);                
              break;

              case 'onlyName':
              resultValidInput = new RegExp(/^[a-z ]+$/).test(modelInput);
              break;

              case 'onlyNumberWithPlus':
              resultValidInput = new RegExp(/^[+-]?\d+$/).test(modelInput);
              break;

              case 'onlyNumber':
              resultValidInput = new RegExp(/^[0-9]+$/).test(modelInput);
              break;
              
              case 'blank':
              resultValidInput = new RegExp(/^[a-zA-Z ]*$/).test(modelInput);
              break;

              case 'url':
              resultValidInput = new RegExp(/(\w*\W*)?\w*(\.(\w)+)+(\W\d+)?(\/\w*(\W*\w)*)*/).test(modelInput);
              break;
      }
      return (resultValidInput) ? true : false;
    }

    post(url: string, body: any) {
      ////////console.log('======');
      ////////console.log(body)
      //////console.log('======');
      if(this.getToken() != 'undefined' && this.getToken() != '' && this.getToken() != null){
        return this.http.post(url, body, this.getReqHeaders());
      }
      else{
        return this.http.post(url, body);
      }
    }

    // post(url: string, body: any) {
    //   let headers = new HttpHeaders({'Content-Type':'application/json', 'Access-Control-Allow-Origin': '*'});
    //   return this.http.post(url, body, {headers: headers});
    //   }
    get(url: string, headers: any, param?: any) {
      let params = new HttpParams().set('data', param);
      // let headers = new HttpHeaders({'Content-Type':'application/json', 'Access-Control-Allow-Origin': '*'});
      // let httpOptions = {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json',
      //     'Access-Control-Allow-Origin': '*'
      //   }),
      //   params: new HttpParams().set('data', param)
      // };
      //get request CORS
      return this.http.get(url, { params: params })
    }

    getReq(url: string, headers: any, paramType?: any, paramValue?:any) {
      let params: any;
      if(paramType != '' && paramValue != ''){
        params = new HttpParams().set(paramType, paramValue);
        let requestOptions = new RequestOptions();
        requestOptions.headers = headers; 
        requestOptions.params = params;
        //const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;
        const options = { params: params, headers: headers };
        return this.http.get(url,  options)
      }       
      return this.http.get(url, headers);
    }

    getwithoutData(url: string) {
      let params = new HttpParams(); 
      return this.http.get(url, this.getReqHeaders());
    }
    delete() {

    }
    put(url: string, body: any) {
      return this.http.put(url, body, this.getReqHeaders());
    }

    public isValidEmail(email: string){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }
    
    public numberSuffix(i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return i + "st";
      }
      if (j == 2 && k != 12) {
          return i + "nd";
      }
      if (j == 3 && k != 13) {
          return i + "rd";
      }
      return i + "th";
  }
    public createLogin(post: any){ 
        let body = post;
        let url = this.apiServerUrl +  'login';
        return this.http.post<any>(url, body);
    }
    public resetPassword(post: any){
      let body = post;
      let url = this.apiServerUrl +  'forgot-password';
      return this.http.post<any>(url, body);
    }
    public resetChangePassword(post: any){
      let body = post;
      let url = this.apiServerUrl +  'reset-password';
      return this.http.post<any>(url, body);
    }
    //Make all key value of any object set empty
    public objectKeyValueEmpty(object: any){
      ////////console.log('Get object: ', object);
      if(object != null){
         object.forEach((rec,k) => {
             ////////console.log(rec[k]);
         })
      }
      // let filterObject = object.filter(record => {
      //    ////////console.log(record);
      // })
      //(object, val) => Object.keys(object).forEach(k => object[k] = '');
      //////////console.log(filterObject);
      //return filterObject;
    }
    public objectToArrayValue(getObject: any){
      let filteredArray = [];
      for (var prop in getObject) {
        filteredArray.push(getObject[prop].errorMessage);
      }
      return filteredArray;
    }
    public removeDuplicateProp(myArr, prop){
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }

    inputEvent(event,key,obj){
      var dateString = event.value._d;
      var d = new Date(dateString);
      var mm = d.getMonth() + 1;
      var dd = d.getDate();
      var yy = d.getFullYear();
      var convertedDate = yy + '-' + mm + '-' + dd;

      //var convertedDate = dateString.toLocaleDateString();
      delete obj[key]['certificate_expiry_date'];
      obj[key]['converted_date'] = convertedDate;
      return obj;
    }

    changeDateFormat(event,prev,steps){
      var dateString = event.value._d;
      var d = new Date(dateString);
      var mm = d.getMonth() + 1;
      var dd = d.getDate();
      var yy = d.getFullYear();
      var convertedDate = yy + '-' + mm + '-' + dd;

      // var step1Data = {};
      //var convertedDate = dateString.toLocaleDateString();
      delete prev.date_of_establishment;
      steps = convertedDate;
      return steps ;
    }

    inputEventForSecond(event,key,obj,inpuyBoxName = ''){
      var dateString = event.value._d;
      var d = new Date(dateString);
      var mm = d.getMonth() + 1;
      var dd = d.getDate();
      var yy = d.getFullYear();
      var convertedDate = yy + '-' + mm + '-' + dd;

      //var convertedDate = dateString.toLocaleDateString();
      if(inpuyBoxName == 'initial_date')
      {
        delete obj[key]['initial_date'];
        obj[key]['initial_date_formatted'] = convertedDate;
      }else {
        delete obj[key]['certificate_expiry_date_second'];
        obj[key]['converted_date_second'] = convertedDate;
      }
      return obj;
    }

    getCSCAll(){
      return this.http.get(this.countryURL);
    }

    getCountry(){
      var countryURL = this.assetsBasePath + 'countries.json';   
      //var cscObj = new csc();
      //let countryCCC = this.objCountry.getAllCountries();
      return this.http.get(countryURL);
    }
  
    getState(){
      var stateURL = this.assetsBasePath + 'states.json';
      return this.http.get(stateURL);
    }
  
    getCity(){
      var cityURL = this.assetsBasePath + 'cities.json';
      return this.http.get(cityURL);
      // return this.http.get(cityURL, {observe: 'response'});
    }

    getLanguages(){
      var cityURL = this.assetsBasePath + 'languages.json';
      return this.http.get(cityURL);
      // return this.http.get(cityURL, {observe: 'response'});
    }

}



