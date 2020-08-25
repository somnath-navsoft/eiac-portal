import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-no-objection-form',
  templateUrl: './no-objection-form.component.html',
  styleUrls: ['./no-objection-form.component.scss']
})
export class NoObjectionFormComponent implements OnInit {

  @ViewChild('fileInput' , {static: true}) fileInput;
  @ViewChild('reCaptcha' , {static: true}) reCaptcha;

  public newRow: any = {};
  //public healthCareForm: any = {};
  public noObjectionForm: any = {};
  public testingLabJson: Array<any> = [];
  public calibrationLabJson: Array<any> = [];
  public instrumentEqipmentJson: Array<any> = [];
  public staffJson: Array<any> = [];
  public inspectionBodyJson: Array<any> = [];
  public medicalLabData:any={}
  public orgMembToggle: boolean = false;
  selectedFood1: string;
  selectedFood2: string;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public loader:boolean=true;
  public banner:any=[];
  other_description = [false,false,false,false,false];
  public cab_type: Array<any> = [];

  laboratory:string = '';
  inspection_body:string = '';
  certification_body:string = '';
  halal_cab:string = '';
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = true;
  testimony_date:boolean = false;
  //Obj:any = {};
  Obj:any = {              
      laboratory: '', 
      inspection_body: '',
      certification_body: '',
      halal_cab: '',
  };

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() { 
    //this.meta.addTag({name: 'title', content: 'Angular Project, Create Angular Project'});
    this.loadFormDynamicTable();
    this.checkCaptchaValidation = true;
    //this.loadData();
    // this.loadService();
    
  }
  // loadService(){
  //   this.Service.get(this.constant.API.get_banner,'no_objection_certificate')
  //   .subscribe(
  //     res => {
  //       //console.log(res)
  //       if(res['banner'].length>0){
  //         this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
  //       }
  //       this.loader = false;

  //     },
  //     error => {
      
  // })
  // }
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  loadFormDynamicTable(){
    this.testingLabJson  =   [{}];
    this.inspectionBodyJson  =   [{}];
    this.calibrationLabJson  =   [{}];
    this.instrumentEqipmentJson  =   [{}];
    this.staffJson =  [{}];
    this.cab_type =  [{}];
    
    this.noObjectionForm.testingLabJson          = this.testingLabJson;
    this.noObjectionForm.inspectionBodyJson          = this.inspectionBodyJson;
    this.noObjectionForm.calibrationLabJson            = this.calibrationLabJson;
    this.noObjectionForm.instrumentEqipmentJson      = this.instrumentEqipmentJson;
    this.noObjectionForm.staffJson            = this.staffJson;
    this.authorizationList = {authorization_confirm1:false};

    //this.noObjectionForm.cab_type            = this.noObjectionForm.laboratory;

  }
  //organizationArray
  addRow(obj: any = [],type?: string){
    if(type != '' && type != undefined){
      //console.log('1st')
      let getIndex    =   obj.findIndex(rec => rec.type == type);
      this.newRow     =   {};
      obj[getIndex].data.push(this.newRow);
    }
    if(type === '' || type == undefined){
      //console.log('2nd')
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

  onSubmit(ngForm){
    ////console.log(this.noObjectionForm.cab_type);
    this.authorizationStatus = true;
    this.isSubmit = true;
    Object.keys(this.authorizationList).forEach(key => {
      if(this.authorizationList[key]==false){
        this.authorizationStatus = false;
      }
    })
    if(!this.authorizationStatus){
      this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    if(!this.Service.checkInput('email',this.noObjectionForm.email_address)){
      this.isSubmit = false;
      //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    if(this.checkSecurity == true)
    {
      this.checkCaptchaValidation = true;
    }else{
      this.checkCaptchaValidation = false;
    }
    if(ngForm.form.valid && this.isSubmit)
    {
        this.Obj.laboratory = ((this.noObjectionForm.laboratory != '') ?  this.noObjectionForm.laboratory : '');
        this.Obj.inspection_body = ((this.noObjectionForm.inspection_body != '') ?  this.noObjectionForm.inspection_body : '');
        this.Obj.certification_body = ((this.noObjectionForm.for_certification_body != '') ?  this.noObjectionForm.for_certification_body : '');
        this.Obj.halal_cab = ((this.noObjectionForm.halal_cab != '') ?  this.noObjectionForm.halal_cab : '');
        this.noObjectionForm.cab_type = this.Obj;
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.noObjectionForm)
        .subscribe(
          res => {
          ////console.log(res)
          if(res['status']==true){
            this.toastr.success(res['msg'], '');
            this.router.navigateByUrl('/application-form/service/no_objection_certificate');
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

  cabType(value)
  {
    if(value == "testing_laboratory" || value == "calibration_laboratory")
    {
      this.laboratory = value;
    }
    if(value == "inspection_body")
    {
      this.inspection_body = value;
    }
    if(value == "certification_body")
    {
      this.certification_body = value;
    }
    if(value == "halal_cab")
    {
      this.halal_cab = value;
    }
  }

}
