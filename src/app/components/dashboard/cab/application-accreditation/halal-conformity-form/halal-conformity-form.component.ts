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
  selector: 'app-halal-conformity-form',
  templateUrl: './halal-conformity-form.component.html',
  styleUrls: ['./halal-conformity-form.component.scss']
})
export class HalalConformityFormComponent implements OnInit {

  public publicHalalConformityForm: any = {};
  public publicHalalConformityFormTemp:any = new FormData();
  public technicalManager: any = {};
  public islamicAffair: any = {};
  public qualityManager: any = {};
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public managing_director: Array<any> = [];
  public ownershipOfTheCompany: Array<any> = [];
  public boardOfDirector: Array<any> = [];
  public hcabLocationList: Array<any> = [];
  public hcabAccreditation: Array<any> = [];
  public halalConformityAssessment: Array<any> = [];
  public certifiedSlaughterhouse: Array<any> = [];
  public halalProductTesting: Array<any> = [];
  public scopeOfHalalConformity: Array<any> = [];
  public authorizedHalalCertificates: Array<any> = [];
  public is_bod:any=0;
  public is_cab_location:any=0;
  public is_cab_accdiations:any=0;
  public summaryDetail:Array<any> = [];
  public categoryDetail:Array<any> = [];
  public loader:boolean=true
  public newRow: any = {};
  public banner:any=[];
  allCountry:any;
  allService:any;
  file_validation:boolean = true;
  hcab_location:any;
  is_hold_other_accreditation:any;
  searchCountryLists:any;
  public file_validation2:boolean = true;
  public file_validation3:boolean = true;
  public file_validation4:boolean = true;
  
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  allCityByCountry: any = [];
  getCountryLists:any;
  // version = VERSION;
  public minDate;

  afterSubmit: boolean = false;


  bannerURL: any = '';
  bannerImageTitle: string = '';
  bannerLinkTarget: string = '';
  // certificate_expiry_date_second:Date = new Date();
  onbehalf_representative_date:boolean = false;
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  getData(getVal){
    this.Service.mapboxToken = getVal;
  }

  ngOnInit() {
    // this.titleService.setTitle('EIAC - Halal Conformity Bodies');
    this.loadFormDynamicTable();
    // this.loadCountryStateCity();
  }

  is_toggle(type,value){
    if(type=="is_bod"){
      this.is_bod = value;
    }
    else if(type=="is_cab_location"){
      this.is_cab_location = value;
    }
    else if(type=="is_cab_accdiations"){
      this.is_cab_accdiations = value;
    }
  }

  // idToName(title,val) {
  //   if(title == 'country')
  //   {
  //     this.publicHalalConformityForm.country_name = val;
  //   }else if(title == 'labour_type_name')
  //   {
  //     this.publicHalalConformityForm.labour_type_name = val;
  //   }
  // }

  loadFormDynamicTable() {
    this.publicHalalConformityForm.authorization_of_application_confirmation = false;
    this.publicHalalConformityForm.authorization_of_application = false;
    this.managing_director  =   [{}];
    this.ownershipOfTheCompany  =   [{}];
    this.boardOfDirector  =   [{}];
    this.hcabLocationList  =   [{}];
    this.hcabAccreditation  =   [{}];
    this.halalConformityAssessment  =   [{}];
    this.certifiedSlaughterhouse  =   [{}];
    this.halalProductTesting  =   [{}];
    this.scopeOfHalalConformity  =   [{}];
    this.authorizedHalalCertificates  =   [{}];
    this.technicalManager  =   {};
    this.islamicAffair  =   {};
    this.qualityManager  =   {};
    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false};

    this.summaryDetail = [{"position":'Managerial/Professional'},{'position':'Decision Maker'},{'position':'Technical'},{'position':'Administrative'},{'position':'Auditors Name'},{'position':'Technical Expert'},{'position':'Inspectors Name'},{'position':'Category Code'},{'position':'Islamic Affairs Expert'},{'position':'Others (e.g. logistics, marketing, sales, etc,) other specify'}];

    this.categoryDetail = [{"key":'Farming 1 (Animals)',"val":'Farming 1 (Animals)'},{"key":'Farming 2 (Plants)',"val":'Farming 2 (Plants)'},{"key":'Processing 1 (Perishable animal products)including all activities after animal farming',"val":'Processing 1 (Perishable animal products)including all activities after animal farming'},{"key":'Processing 2 (Perishable vegetal products)',"val":'Processing 2 (Perishable vegetal products)'},{"key":'Processing 3 (Products with long shelf life at ambient temperature)',"val":'Processing 3 (Products with long shelf life at ambient temperature)'},{"key":'Feed production',"val":'Feed production'},{"key":'Catering',"val":'Catering'},{"key":'Distribution',"val":'Distribution'},{"key":'Services',"val":'Services'},{"key":'Transport and storage',"val":'Transport and storage'}];

    this.publicHalalConformityForm.managingDirector    = this.managing_director;
    // this.publicHalalConformityForm.organizationBasicInfo    = this.managing_director;
    this.publicHalalConformityForm.summaryDetail    = this.summaryDetail;
    this.publicHalalConformityForm.categoryDetail    = this.categoryDetail;
    this.publicHalalConformityForm.ownershipOfTheCompany    = this.ownershipOfTheCompany;
    this.publicHalalConformityForm.boardOfDirector    = this.boardOfDirector;
    this.publicHalalConformityForm.hcabLocationList    = this.hcabLocationList;
    this.publicHalalConformityForm.hcabAccreditation    = this.hcabAccreditation;
    this.publicHalalConformityForm.technicalManager    = this.technicalManager;
    this.publicHalalConformityForm.qualityManager    = this.qualityManager;
    this.publicHalalConformityForm.islamicAffair    = this.islamicAffair;
    this.publicHalalConformityForm.halalConformityAssessment    = this.halalConformityAssessment;
    this.publicHalalConformityForm.certifiedSlaughterhouse    = this.certifiedSlaughterhouse;
    this.publicHalalConformityForm.halalProductTesting    = this.halalProductTesting;
    this.publicHalalConformityForm.scopeOfHalalConformity    = this.scopeOfHalalConformity;
    this.publicHalalConformityForm.authorizedHalalCertificates    = this.authorizedHalalCertificates;
    this.loader = false
  }
  setexDate(){
    let cdate =this.publicHalalConformityForm.date_of_issue;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }
  validateFile(fileEvent: any,type) {
   
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['jpg','JPEG','gif','png'];
    var ex_check = this.isInArray(file_exe,ex_type);
    var ex = (fileEvent.target.files[0].name).split('.');
  //  if(ex_check){
     if(type=="trade_license" && ex_check  == true){
       this.publicHalalConformityForm.trade_license_name = fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('trade_license',fileEvent.target.files[0]);
       this.file_validation = true;
     }else if(type=="trade_license" && ex_check  != true){
      this.file_validation = false;
    }
     else if(type=="recognized_logo3" && ex_check  == true){
       this.publicHalalConformityForm.recognized_logo3_name = fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('recognized_logo3',fileEvent.target.files[0]);
       this.file_validation4 = true;
     }else if(type=="recognized_logo3" && ex_check  != true){
      this.file_validation4 = false;
    }
     if(type=="recognized_logo2" && ex_check  == true){
       this.publicHalalConformityForm.recognized_logo2_name= fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('recognized_logo2',fileEvent.target.files[0]);
       this.file_validation3 = true;
     }else if(type=="recognized_logo2" && ex_check  != true){
      this.file_validation3 = false;
    }
     if(type=="recognized_logo1" && ex_check  == true){
       this.publicHalalConformityForm.recognized_logo1_name= fileEvent.target.files[0].name;
       this.publicHalalConformityFormTemp.append('recognized_logo1',fileEvent.target.files[0]);
       this.file_validation2 = true;
     }else if(type=="recognized_logo1" && ex_check  != true){
      this.file_validation2 = false;
    }
 
     
  //  }
  //  else{
  //   this.file_validation = false;
  //    return false;
  //  }
 }
 isInArray(value, array) {
  return array.indexOf(value) > -1;
}
 
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
  }

  onSubmit(ngForm){
    // this.publicHalalConformityForm.hcab_location = this.is_cab_location == 0 ? 0 : 1;
    // this.publicHalalConformityForm.is_hold_other_accreditation = this.is_cab_accdiations == 0 ? 0 : 1;
    
    this.authorizationStatus = true;
    this.isSubmit = true;
    this.afterSubmit = true;
    Object.keys(this.authorizationList).forEach(key => {
      if(this.authorizationList[key]==false){
        this.authorizationStatus = false;
      }
    })
    if(!this.authorizationStatus){
      this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    // if(this.checkSecurity == true)
    // {
    //   this.checkCaptchaValidation = true;
    // }else{
    //   this.checkCaptchaValidation = false;
    // }
    
    this.publicHalalConformityForm.is_bod = this.is_bod;
    this.publicHalalConformityForm.is_cab_location = this.is_cab_location;
    this.publicHalalConformityForm.is_cab_accdiations = this.is_cab_accdiations;

    this.publicHalalConformityFormTemp.append('data',JSON.stringify(this.publicHalalConformityForm));
    if(ngForm.form.valid && this.checkCaptchaValidation == true){
      this.loader = true;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.publicHalalConformityFormTemp)
      .subscribe(
        res => {
          if(res['status']==true){
            this.loader = false;
            this.afterSubmit = false;
            this.captchaRef.reset();
            this.checkCaptchaValidation = false;
            this.toastr.success(res['msg'], '');
            this.router.navigate(['application-form/service/halal_conformity']);
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
    if(typeof this.publicHalalConformityForm.search_location_name != 'undefined')
    {
      this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.publicHalalConformityForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
        .subscribe(res => {
            // //console.log(res['features']);
            this.searchCountryLists = res['features'];
          },
          error => {
          
      })
    }
  }

  getLatitudelongitude(longitude,latitude)
  {
    this.publicHalalConformityForm.location_longitude = longitude;
    this.publicHalalConformityForm.location_latitude = latitude;
  }

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
  removeRow(obj: any, index: number, type?:string){

    if(type === '' || type == undefined){
      obj.splice(index, 1);
    }    
    return true;
  }

  // openDialog(obj: any, index: number) {
  //   const dialogRef = this.dialog.open(DialogBoxComponent,{
  //     data:{
  //       message: 'Are you sure want to delete?',
  //       buttonText: {
  //         ok: 'Yes',
  //         cancel: 'No'
  //       },
  //       obj:obj,
  //       index:index,
  //     }
  //   });
  // }

}
