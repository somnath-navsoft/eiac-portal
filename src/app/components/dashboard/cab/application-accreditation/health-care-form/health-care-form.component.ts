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
  selector: 'app-health-care-form',
  templateUrl: './health-care-form.component.html',
  styleUrls: ['./health-care-form.component.scss']
})
export class HealthCareFormComponent implements OnInit {

  color = 'primary';
  mode = 'determinate';
  value = 50;
  public newRow: any = {};
  public healthCareFormFile: any = new FormData();
  public healthCareForm: any = {};
  public ownOrgBasicInfo: Array<any> = [];
  public ownOrgMembInfo: Array<any> = [];
  public proficiencyTesting: Array<any> = [];
  public accreditationInfo: Array<any> = [];
  public technicalManager: any = {};
  public managementManager: any = {};
  public medicalLabInfo:Array<any>=[];
  public pointOfCareInfo:Array<any>=[];
  public sampleCollectionCenter:Array<any>=[];
  public sampleCollection:any={};
  public medicalLabScopeFields:Array<any>=[];
  public pointOfCareInfoFields:Array<any>=[];
  public medicalLabData:any={}
  public medicalLabPointOfCareDataData:any={}
  public medicalPointOfCareData:any={}
  public medicalLabFirstData:Array<any>=[];
  public pointOfCareFirstData:Array<any>=[];
  public countryList:Array<any>=[];
  public labTypeList:Array<any>=[];
  public banner:any=[];
  public orgMembToggle: boolean = false;
  public is_bod: any = 0;
  public checkSecurity:boolean = false;
  public addMinutesToTime:any;

  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public selectedValuesMl:Array<any>=[];
  public selectedValuesPc:Array<any>=[];
  public selectedValuesData:Array<any>=[];
  public medicalLaboratoryScopeData:any = {};
  public pointOfCareData:any = {};
  selectedFood1: string;
  selectedFood2: string;
  rowCount:number=1;
  POCrowCount:number=1;
  onbehalf_representative_date:boolean = false;

  field2:number=2;
  public minDate;
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  public file_validation:boolean = true;
  public labType:any;
  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  // version = VERSION;
  authorization_confirm2:any;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
  convertedDate:any;
  searchCountryLists:any;
  allCityByCountry: any = [];
  getCountryLists:any;
  half_representative_date:boolean = false;

  public radiologyAccreditationCenter:Array<any>=[];
  public radiologyAccreditation:any={};

  public dayCareSurgeryCenter:Array<any>=[];
  public dayCareSurgery:any={};

  public neurophysiologyAccreditationCenter:Array<any>=[];
  public neurophysiologyAccreditation:any={};

  bannerURL: any = '';
  bannerImageTitle: string = '';
  bannerLinkTarget: string = '';

  afterSubmit:boolean = false;

  customUrlPattern: any;

  @ViewChild('mydiv', null) mydiv: ElementRef;
  @HostListener('scroll', ['$event.target'])
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;
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

  getFieldTooltip(){
    let getval = this.healthCareForm.official_website;
    let urlReg = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
    console.log('>>> ', getval, " --- ", urlReg.test(getval));
    if(!urlReg.test(getval)){
      return 'Enter URL properly';
    }
  }

  onChange(prevFieldId,row,curField,field) {
    //console.log('prevFieldId',prevFieldId)
   let selectedValueObj = this.selectedValuesMl[row-1] ? this.selectedValuesMl[row-1] : {};
   let selectedValueObj2 = this.selectedValuesData[row-1] ? this.selectedValuesData[row-1] : {};
   selectedValueObj[curField] = prevFieldId.value;

   let tempKey = ''

   if(curField=='field1'){
     tempKey = this.medicalLabScopeFields[0].id;
   }
   else if(curField=='field2'){
     tempKey = this.medicalLabScopeFields[1].id;
   }
   else if(curField=='field3'){
     tempKey = this.medicalLabScopeFields[2].id;
   }
   else if(curField=='field4'){
     tempKey = this.medicalLabScopeFields[3].id;
   }
   else if(curField=='field5'){
     tempKey = this.medicalLabScopeFields[4].id;
   }
   else if(curField=='field6'){
     tempKey = this.medicalLabScopeFields[5].id;
   }

   selectedValueObj2[tempKey] = prevFieldId.source.selected.viewValue;

   if(this.selectedValuesMl[row-1]){
     this.selectedValuesMl[row-1] = selectedValueObj;
     this.selectedValuesData[row-1] = selectedValueObj2;
   }
   else{
     this.selectedValuesMl.push(selectedValueObj);
     this.selectedValuesData.push(selectedValueObj2);
   }

   this.rowCount = row

   this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcare_form_basic_data,{'value_id':prevFieldId.value})
   .subscribe(
     res => {
       // if(res['banner'].length>0){
       //   this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
       // }
       
       if(field=='field2'){
         // this.medicalLabData[this.rowCount][this.field2] = ''
         this.medicalLabData[this.rowCount]['field2']=res['scopeValue']
       }
       else if(field=='field3'){
         //console.log('field3')
         this.medicalLabData[row].field3=res['scopeValue']
       }
       else if(field=='field4'){
         this.medicalLabData[row].field4=res['scopeValue']
       }
       else if(field=='field5'){
         this.medicalLabData[row].field5=res['scopeValue']
       }
       else if(field=='field6'){
         this.medicalLabData[row].field6=res['scopeValue']
       }

       this.medicalLaboratoryScopeData['medicalLabData'] = this.selectedValuesData;
       this.healthCareForm.medicalLabScopeData = this.medicalLaboratoryScopeData;

       //console.log("LOggggg==>");
       //console.log(this.healthCareForm);

     },
     error => {
     
 })
}

scrollForm(data?:any){
 
}

labTypeChange(value){
 this.labType = value;
 //console.log(this.healthCareForm.laboratory_type)
}
pointCareChange(prevFieldId,row,curField,field) {
   ////console.log('prevFieldId',prevFieldId)
   let selectedValueObj = this.selectedValuesPc[row-1] ? this.selectedValuesPc[row-1] : {};
   let selectedValueObj2 = this.selectedValuesData[row-1] ? this.selectedValuesData[row-1] : {};
   selectedValueObj[curField] = prevFieldId.value;

   let tempKey = ''
   //console.log('field',field);
   //console.log('curField',curField);
   if(curField=='field1'){
     tempKey = this.pointOfCareInfoFields[0].id;
   }
   else if(curField=='field2'){
     tempKey = this.pointOfCareInfoFields[1].id;
   }
   else if(curField=='field3'){
     tempKey = this.pointOfCareInfoFields[2].id;
   }
   else if(curField=='field4'){
     tempKey = this.pointOfCareInfoFields[3].id;
   }
   else if(curField=='field5'){
     tempKey = this.pointOfCareInfoFields[4].id;
   }
   else if(curField=='field6'){
     tempKey = this.pointOfCareInfoFields[5].id;
   }

   selectedValueObj2[tempKey] = prevFieldId.source.selected.viewValue;

   if(this.selectedValuesPc[row-1]){
     this.selectedValuesPc[row-1] = selectedValueObj;
     this.selectedValuesData[row-1] = selectedValueObj2;
   }
   else{
     this.selectedValuesPc.push(selectedValueObj);
     this.selectedValuesData.push(selectedValueObj2);
   }
   //console.log('selectedValueObj2',selectedValueObj2)
   //console.log(this.selectedValuesData)
   this.POCrowCount = row
   //console.log('hello')
   this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcare_form_basic_data,{'value_id':prevFieldId.value})
   .subscribe(
     res => {
       // if(res['banner'].length>0){
       //   this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
       // }
      
       if(field=='field2'){
         //console.log('rowCount',this.POCrowCount)
         //console.log('scopeValue',res['scopeValue'])
         // this.medicalLabData[this.rowCount][this.field2] = ''
         this.medicalPointOfCareData[this.POCrowCount]['field2']=res['scopeValue']
       }
       else if(field=='field3'){
         //console.log('field3')
         this.medicalPointOfCareData[row].field3=res['scopeValue']
       }
       else if(field=='field4'){
         this.medicalPointOfCareData[row].field4=res['scopeValue']
       }
       else if(field=='field5'){
         this.medicalPointOfCareData[row].field5=res['scopeValue']
       }
       else if(field=='field6'){
         this.medicalPointOfCareData[row].field6=res['scopeValue']
       }

       this.pointOfCareData['pointOfCareData'] = this.selectedValuesData;
       this.healthCareForm.pointOfCareData = this.pointOfCareData;

       //console.log("LOggggg==>");
       //console.log(this.medicalPointOfCareData);

     },
     error => {
     
   })
 }
 //Get MapBoc Dynamic Values
 getData(getVal){
   //console.log(">>>>Get MapBox Value: ", getVal);
   this.Service.mapboxToken = getVal;
  }
 ngOnInit() { 
   ////console.log(this.Service.dutyTime());
  //  this.titleService.setTitle('EIAC - Healthcare Laboratories');
   this.addMinutesToTime = this.Service.addMinutesToTime();
   //console.log( this.addMinutesToTime);
   this.loadData();
   this.loadFormDynamicTable();
   //console.log('ddd');
   //this.getPlaceName();
   //this.checkCaptchaValidation = true;

   //this.customUrlPattern = { '0' : {pattern: new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?') }};
 }

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
   this.proficiencyTesting =[{}];
   this.medicalLabInfo=[{}];
   this.sampleCollectionCenter=[{}];
   this.pointOfCareInfo=[{}];
   this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,authorization_confirm3:false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,undertaking_confirm8:false,undertaking_confirm9:false};
   this.healthCareForm.organizationBasicInfo    = this.ownOrgBasicInfo;
   this.healthCareForm.organizationMemberInfo   = this.ownOrgMembInfo;
   this.healthCareForm.accreditationInfo        = this.accreditationInfo;
   this.healthCareForm.proficiencyTesting       = this.proficiencyTesting;
   this.healthCareForm.technicalManager         = this.technicalManager;
   this.healthCareForm.managementManager        = this.managementManager;
   this.healthCareForm.medicalLabInfo           = this.medicalLabInfo;
   this.healthCareForm.pointOfCareInfo          = this.pointOfCareInfo;
   

   this.healthCareForm.sampleCollectionCenter        = this.sampleCollectionCenter;
   this.sampleCollection['sampleCollectionData']    = this.healthCareForm.sampleCollectionCenter
   this.healthCareForm.sampleCollection         = this.sampleCollection;

   this.radiologyAccreditationCenter = [{}];
   this.healthCareForm.radiologyAccreditationCenter        = this.radiologyAccreditationCenter;
   this.radiologyAccreditation['radiologyAccreditationData']    = this.healthCareForm.radiologyAccreditationCenter
   this.healthCareForm.radiologyAccreditation         = this.radiologyAccreditation;

   this.dayCareSurgeryCenter = [{}];
   this.healthCareForm.dayCareSurgeryCenter        = this.dayCareSurgeryCenter;
   this.dayCareSurgery['dayCareSurgeryData']    = this.healthCareForm.dayCareSurgeryCenter
   this.healthCareForm.dayCareSurgery         = this.dayCareSurgery;

   this.neurophysiologyAccreditationCenter = [{}];
   this.healthCareForm.neurophysiologyAccreditationCenter        = this.neurophysiologyAccreditationCenter;
   this.neurophysiologyAccreditation['neurophysiologyAccreditationData']    = this.healthCareForm.neurophysiologyAccreditationCenter
   this.healthCareForm.neurophysiologyAccreditation         = this.neurophysiologyAccreditation;

 }
 setexDate(){
   let cdate =this.healthCareForm.date_of_issue;
   this.minDate = new Date(cdate  + (60*60*24*1000));
 }
 loadData(){
   this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.healthcare_form_basic_data)
   .subscribe(
     res => {
       this.medicalLabScopeFields = res['medicalLabScopeFields'];
       this.pointOfCareInfoFields = res['medicalLabScopeFields'];
       this.countryList = res['allCountry'];
       this.labTypeList = res['allLabtype'];
       ////console.log(this.labTypeList);
       //console.log(res['allLabtype'])
       Object.keys(res['scopeValue']).forEach(key => {
           this.medicalLabData[this.rowCount]=[];
           this.medicalLabData[this.rowCount].field1  = res['scopeValue'][key].values;
           this.medicalLabFirstData = res['scopeValue'][key].values;


           this.medicalPointOfCareData[this.POCrowCount]=[];
           this.medicalPointOfCareData[this.POCrowCount].field1  = res['scopeValue'][key].values;
           this.pointOfCareFirstData = res['scopeValue'][key].values;

           
       });
       this.loader= false;

     },
     error => {
     
 })
   if(this.medicalLabScopeFields.length<1){
     this.medicalLabScopeFields=  [{},{},{},{},{},{}];
   }
   if(this.pointOfCareInfoFields.length<1){
     this.pointOfCareInfoFields =  [{},{},{},{},{},{}];
   }
 }

 getPlaceName()
 {
   if(typeof this.healthCareForm.search_location_name != 'undefined')
   {
     this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.healthCareForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
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
   this.healthCareForm.location_longitude = longitude;
   this.healthCareForm.location_latitude = latitude;
 }

 validateFile(fileEvent: any) {
   var file_name = fileEvent.target.files[0].name;
   var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
   var ex_type = ['pdf','png'];
   var ex_check = this.Service.isInArray(file_exe,ex_type);
   if(ex_check){
     this.healthCareForm.trade_license_name = fileEvent.target.files[0].name;
     this.healthCareFormFile.append('trade_license_file',fileEvent.target.files[0]);
     this.file_validation = true;
     return true;
   }
   else{
     this.file_validation = false;
     return false;
   }
}

 //organizationArray
 addRow(obj: any = [],type?: string){
   if(type != '' && type != undefined){
     let getIndex    =   obj.findIndex(rec => rec.type == type);
     this.newRow     =   {};
     obj[getIndex].data.push(this.newRow);
   }
   if(type === '' || type == undefined){
     let objlength = obj.length+1;
     this.newRow     =   {};
     obj.push(this.newRow);
   }
     
   return true;
 }
 addMLRow(obj: any = [],type: string){ 

   this.rowCount++;
   if(type === '' || type == undefined){
     let objlength = obj.length+1;
     this.medicalLabData[this.rowCount]=[];
     this.medicalLabData[this.rowCount].field1 = this.medicalLabFirstData
     this.newRow     =   {};
     obj.push(this.newRow);
   }
     //console.log(this.medicalLabData)
   return true;
 }

 addPCRow(obj: any = [],type: string){ 

   this.POCrowCount++;
   if(type === '' || type == undefined){
     let objlength = obj.length+1;
     this.medicalPointOfCareData[this.POCrowCount]=[];
     this.medicalPointOfCareData[this.POCrowCount].field1 = this.pointOfCareFirstData
     this.newRow     =   {};
     obj.push(this.newRow);
   }
     //console.log(this.medicalPointOfCareData)
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

 onSubmit(ngForm){
   //console.log(this.healthCareForm);
   // this.healthCareForm.is_bod = !this.is_bod ? 0 : this.is_bod;
   this.is_bod = !this.is_bod || typeof this.is_bod == 'undefined' ? "0" : ""+this.is_bod+"";
   this.healthCareForm.is_bod = this.is_bod;
   this.afterSubmit = true;
   this.authorizationStatus = true;
   Object.keys(this.authorizationList).forEach(key => {
     if(this.authorizationList[key]==false){
       this.authorizationStatus = false;
     }
   })
   //console.log(this.authorizationList);
   if(this.authorizationStatus != true){
     this.isSubmit = false;
     this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
   }else{
     this.isSubmit = true;
   }
   if(this.healthCareForm.duty_shift == '1' && typeof this.healthCareForm.duty_from1 == 'undefined' && typeof this.healthCareForm.duty_to1 == 'undefined')
   {
     this.dutyTime1 = false;
     this.isSubmit = false;
   }else{
     this.dutyTime1 = true;
   }
   if(this.healthCareForm.duty_shift == '2' && typeof this.healthCareForm.duty_from2 == 'undefined' && typeof this.healthCareForm.duty_to2 == 'undefined')
   {
     if(typeof this.healthCareForm.duty_from1 == 'undefined' || typeof this.healthCareForm.duty_to1 == 'undefined')
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
   if(this.healthCareForm.duty_shift == '3' && typeof this.healthCareForm.duty_from3 == 'undefined' && typeof this.healthCareForm.duty_to3 == 'undefined')
   {
     if(typeof this.healthCareForm.duty_from1 == 'undefined' || typeof this.healthCareForm.duty_to1 == 'undefined')
     {
       this.dutyTime1 = false;
     }else{
       this.dutyTime1 = true;
     }
     if(typeof this.healthCareForm.duty_from2 == 'undefined' || typeof this.healthCareForm.duty_to2 == 'undefined')
     {
       this.dutyTime2 = false;
     }else{
       this.dutyTime2 = true;  
     }
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
   // if(!this.Service.checkInput('email',this.healthCareForm.mailing_address)){
   //   this.isSubmit = false;
   //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
   // }

   if(ngForm.form.valid && this.checkCaptchaValidation == true){
      this.healthCareForm.medicalLabScopeData = this.medicalLaboratoryScopeData != '' ? this.medicalLaboratoryScopeData : {};
      this.healthCareForm.pointOfCareData = this.pointOfCareData != '' ? this.pointOfCareData : {};
     
     this.healthCareFormFile.append('data',JSON.stringify(this.healthCareForm));

     //this.loader = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.healthCareFormFile)
      .subscribe(
        res => {
          if(res['status']==true){
            //this.loader = false;
           this.captchaRef.reset();
           this.checkCaptchaValidation = false;
           this.afterSubmit = false;
            this.toastr.success(res['msg'], '');
            //this.router.navigate(['application-form/service/health_care']);
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
//  openDialog(obj: any, index: number) {
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
