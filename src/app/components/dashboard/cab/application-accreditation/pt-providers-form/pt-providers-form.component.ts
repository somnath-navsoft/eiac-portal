import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-pt-providers-form',
  templateUrl: './pt-providers-form.component.html',
  styleUrls: ['./pt-providers-form.component.scss']
})
export class PtProvidersFormComponent implements OnInit {

  public newRow: any = {};
  public ptProvidersForm: any = {};
  public ptProvidersFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [];
  public ownOrgMembInfo: Array<any> = [];
  public proficiencyTesting: Array<any> = [];
  public scopeForCalibration: Array<any> = [];
  public scopeForTesting: Array<any> = [];
  public scopeForMedical: Array<any> = [];

  public accreditationInfo: Array<any> = [];
  public technicalManager: any = {};
  public managementManager: any = {};
  public medicaMainlLabInfo:Array<any>=[];
  public countryList:Array<any>=[];
  public ptProvidertypeList:Array<any>=[];
  public ptProviderAccrediationTypeList:Array<any>=[];
  public authorizationList:any;
  accreditationCriteriasId:any;
  public authorizationStatus:boolean=true;
  public authorization_confirm3:Array<any>=[];
  public recommend_confirm:any = {};
  public mailing_address:boolean=true;
  public orgMembToggle: boolean = false;
  public is_bod: boolean = false;
  public is_agreement: boolean=false;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public banner:any=[];
  public isSubmit: boolean = true;
  afterSubmit: boolean = false;
  public addMinutesToTime:any;
  public accreditationCriteria:any;
  selectedFood1: string;
  selectedFood2: string;
  public file_validation:boolean = true;
  public minDate;
  public maxDate = new Date();
  // ngx-google-places-autocomplete [options]='options' #placesRef="ngx-places"
  // version = VERSION;
  allCityByCountry: any = [];
  getCountryLists:any;
  authorization_confirm2:any;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
  searchCountryLists:any;
  onbehalf_representative_date:boolean = false;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  @ViewChild('mydiv', null) mydiv: ElementRef;
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;
  @HostListener('scroll', ['$event.target'])
  scrollHandler(elem) {
    if(elem != undefined){
      //console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if(( elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
         ////console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
      }
    }        
  }

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  getData(getVal: string){
    this.Service.mapboxToken = getVal;
   }

 ngOnInit() { 
   // this.minCurrentDate = new Date(2020, 0, 13);
  //  this.titleService.setTitle('EIAC - Proficiency Testing Providers');
   this.addMinutesToTime = this.Service.addMinutesToTime();
   this.loadData();
   this.loadFormDynamicTable();
   //this.checkCaptchaValidation = false;
   this.loader = false;
  //  this.setting();
 }

 setexDate(evnt){
   let cdate =this.ptProvidersForm.date_of_issue;
   this.minDate = new Date(cdate  + (60*60*24*1000));
 }
//  setting(){

//    this.placesRef.options.componentRestrictions = new ComponentRestrictions({
//      country: 'IN'
//    });
//    this.placesRef.options.types = [];

//    this.placesRef.reset();
//  }
 resolvedSecurity(captchaResponse: string) {
   let captchaStatus   =  captchaResponse;
   if(captchaStatus != ''){
     this.checkSecurity = true;
     this.checkCaptchaValidation = true;
   }
 }
 bod_toggle(value){
   this.is_bod = value;
 }
 loadFormDynamicTable(){
   this.ownOrgBasicInfo  =   [{}];
   this.ownOrgMembInfo = [{}];
   this.accreditationInfo = [{}];
   this. proficiencyTesting =[{}];
   this.scopeForTesting   =[{}];
   this.scopeForMedical   =[{}];
   this.scopeForCalibration   =[{}];
   this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,authorization_confirm4:false,recommend_confirm:false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,undertaking_confirm8:false,undertaking_confirm9:false};

   this.medicaMainlLabInfo=[{}];
   this.ptProvidersForm.organizationBasicInfo    = this.ownOrgBasicInfo;
   this.ptProvidersForm.organizationMemberInfo   = this.ownOrgMembInfo;
   this.ptProvidersForm.accreditationInfo        = this.accreditationInfo;
   this.ptProvidersForm.proficiencyTesting       = this.proficiencyTesting;
   this.ptProvidersForm.scopeForCalibration       = this.scopeForCalibration;
   this.ptProvidersForm.scopeForTesting          = this.scopeForTesting;
   this.ptProvidersForm.scopeForMedical          = this.scopeForMedical;
   this.ptProvidersForm.technicalManager         = this.technicalManager;
   this.ptProvidersForm.managementManager        = this.managementManager;

   this.accreditationCriteria = [{"title":'ACCREDITATION SCOPE FOR PT-CALIBRATION',"id":1},
                                 {"title":'ACCREDITATION SCOPE FOR PT-TESTING',"id":2},
                                 {"title":'ACCREDITATION SCOPE FOR PT-MEDICAL',"id":3},
                               ];
   
 }

 accreditationCriterias (title){
   this.accreditationCriteriasId = title;
 }
 loadData(){
   this.Service.get(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.pt_provider,'')
   .subscribe(
     res => {
       //console.log(res)
       this.countryList = res['allCountry'];
       this.ptProvidertypeList = res['ptProvidertypeList'];
       this.ptProviderAccrediationTypeList = res['ptProviderAccrediationTypeList'];
       if(res['banner'].length>0){
         this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
       }
     },
     error => {
     
 })

 }

 validateFile(fileEvent: any) {
   var file_name = fileEvent.target.files[0].name;
   var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
   var ex_type = ['doc','odt','pdf','rtf','docx','xlsx'];
   var ex_check = this.Service.isInArray(file_exe,ex_type);
   if(ex_check){
     this.ptProvidersForm.trade_license_name =fileEvent.target.files[0].name;
     this.ptProvidersFormFile.append('trade_license_file',fileEvent.target.files[0]);
     this.file_validation = true;

     return true;
   }
   else{
     this.file_validation = false;

     return false;
   }
 }

 emailValidation(email){
   // var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   // if(!regex.test(email)){
   //   this.mailing_address = true;
   // }
   // else{
   //   this.mailing_address = false;
   // }
   // this.mailing_address = true;
 }
 authorization(){

 }
 //organizationArray
 addRow(obj: any = [],type?: string){
   if(type != '' && type != undefined){
     let getIndex    =   obj.findIndex(rec => rec.type == type);
     this.newRow     =   {};
     obj[getIndex].data.push(this.newRow);
   }
   if(type === '' || type == undefined){
     this.newRow     =   {};
     obj.push(this.newRow);
   }
     
   return true;
 }
 removeRow(obj: any, index: number, type?:string){

   if(type === '' || type == undefined){
     obj.splice(index, 1);
   }    
   return true;
 }
 showHideMembInfo(data){
   this.orgMembToggle  = data.checked;
 }
 // openDialog(){
 //   const dialogRef = this.dialog.open(ConfirmationDialog, {
 // 		data: {
 //       title : 'The Accreditation Agreement',
 //       content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
       
 // 		  }, 
 // 		  height: '300px',
 // 		  width: '700px',
 // 		  disableClose: true
 //     });
 //     dialogRef.afterClosed().subscribe((confirmed: boolean) => {
 //       if (confirmed) {
 //           this.is_agreement=true;
 //       }
 //     });
 // }
 onSubmit(ngForm){
   this.authorizationStatus = true;
   this.isSubmit = true;
   this.afterSubmit = true;
   
   Object.keys(this.authorizationList).forEach(key => {
     if(this.authorizationList[key]==false){
       this.authorizationStatus = false;
     }
   })
   //console.log(this.authorizationList);
   // if(!this.Service.checkInput('email',this.ptProvidersForm.mailing_address)){
   //   this.isSubmit = false;
   //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
   // }
   if(this.authorizationStatus != true){
     this.isSubmit = false;
     this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
   }
   else{
   
     this.isSubmit = true;
   }

   if(this.ptProvidersForm.duty_shift == '1' && typeof this.ptProvidersForm.duty_from1 == 'undefined' && typeof this.ptProvidersForm.duty_to1 == 'undefined')
   {
     ////console.log();
     this.dutyTime1 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime1 = true;
   }
   if(this.ptProvidersForm.duty_shift == '2' && typeof this.ptProvidersForm.duty_from2 == 'undefined' && typeof this.ptProvidersForm.duty_to2 == 'undefined')
   {
     if(typeof this.ptProvidersForm.duty_from1 == 'undefined' || typeof this.ptProvidersForm.duty_to1 == 'undefined')
     {
       this.dutyTime1 = false;
     }else{
       this.dutyTime1 = true;
     }
     this.dutyTime2 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime2 = true;
   }
   if(this.ptProvidersForm.duty_shift == '3' && typeof this.ptProvidersForm.duty_from3 == 'undefined' && typeof this.ptProvidersForm.duty_to3 == 'undefined')
   {
     if(typeof this.ptProvidersForm.duty_from1 == 'undefined' || typeof this.ptProvidersForm.duty_to1 == 'undefined')
     {
       this.dutyTime1 = false;
     }else{
       this.dutyTime1 = true;
     }
     if(typeof this.ptProvidersForm.duty_from2 == 'undefined' || typeof this.ptProvidersForm.duty_to2 == 'undefined')
     {
       this.dutyTime2 = false;
     }else{
       this.dutyTime2 = true;
     }
     ////console.log();
     this.dutyTime3 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime3 = true;
   }
   
   // if(this.checkSecurity == true)
   // {
   //   this.checkCaptchaValidation = true;
   // }else{
   //   this.checkCaptchaValidation = false;
   // }

   if(ngForm.form.valid  && this.checkCaptchaValidation == true){
     this.ptProvidersForm.is_bod = this.is_bod;
     this.ptProvidersFormFile.append('data',JSON.stringify(this.ptProvidersForm));
       // this.loader = true;
       this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.pt_provider,this.ptProvidersFormFile)
       .subscribe(
         res => {
           if(res['status']==true){
             // this.loader = false;
             this.afterSubmit = false;
             this.captchaRef.reset();
             this.checkCaptchaValidation = false;
             this.toastr.success(res['msg'], '');
           //  this.router.navigate(['application-form/service/pt_providers']);

           }
           else{
             this.toastr.error(res['msg'],'')
           }
         },
         error => {
           this.toastr.error('Something went wrong','')
     })
     }
     else{
       this.toastr.warning('Please Fill required field','')
     }

   }

   getPlaceName()
   {
     if(typeof this.ptProvidersForm.search_location_name != 'undefined')
     {
       this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.ptProvidersForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
         .subscribe(res => {
             ////console.log(res['features']);
             this.searchCountryLists = res['features'];
           },
           error => {
           
       })
     }
   }

   getLatitudelongitude(longitude,latitude)
   {
     this.ptProvidersForm.location_longitude = longitude;
     this.ptProvidersForm.location_latitude = latitude;
   }

   dayTimeChange(event,dayTime)
   {
     ////console.log(dayTime);
     if(event.value != '' && dayTime == '1')
     {
       this.dutyTime1 = true;
     }
     if(event.value != '' && dayTime == '2')
     {
       this.dutyTime2 = true;
     }
     if(event.value != '' && dayTime == '3')
     {
       this.dutyTime3 = true;
     }
   }

  //  openDialogBoxes(obj: any, index: number) {
  //    const dialogRef = this.dialog.open(DialogBoxComponent,{
  //      data:{
  //        message: 'Are you sure want to delete?',
  //        buttonText: {
  //          ok: 'Yes',
  //          cancel: 'No'
  //        },
  //        obj:obj,
  //        index:index,
  //      }
  //    });
  //  }

  //  openAuthorizationDialog() {
  //    const dialogRef = this.dialog.open(DialogBoxComponent,{
  //      data:{
  //        message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //        buttonText: {
  //          ok: 'Accept',
  //          cancel: 'Cancel'
  //        },
  //        obj:'',
  //        index:'',
  //        authorization_checked:true,
  //      },
  //      height: '300px',
  //      width: '600px',
  //    });
  //    dialogRef.afterClosed().pipe(
  //      filter(name => name)
  //    ).subscribe(name => {
  //      this.authorization_confirm2 = name.authorization;
  //      this.authorizationList.authorization_confirm2 = this.authorization_confirm2;
  //    })
  //  }

}
