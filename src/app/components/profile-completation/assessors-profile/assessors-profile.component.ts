import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-assessors-profile',
  templateUrl: './assessors-profile.component.html',
  styleUrls: ['./assessors-profile.component.scss']
})
export class AssessorsProfileComponent implements OnInit {

  isProfileData: boolean = true;
  assessorsProfile:any = {};
  step1Data:any = {};
  step2Data:any = {};
  step3Data:any = {};
  step4Data:any = {};
  step5Data:any = {};
  file_validation1:boolean;
  file_validation2:boolean;
  file_validation3:boolean;
  arabic:any = {};
  english:any = {};
  others:any = {};
  step3ClickObj:any = {};
  list_auditor:Array<any> = [{}]; 
  attend_accreditation:Array<any> = [{}];
  attend_accreditation2:Array<any> = [{}];
  practical_assessment_experience:Array<any> = [{}];
  schemeSlideData:any;
  flag:any = 'inspection-bodies';
  schemeMainData:any;
  userEmail:any;
  userType:any;
  isCompleteness:any;

  step2DataBodyFormFile: any = new FormData();

  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this.isCompleteness = sessionStorage.getItem('isCompleteness');

    this.step3Data.list_auditor = '1' ;
    this.step3Data.attend_accreditation = '1' ;
    this.step3Data.attend_accreditation2 = '1' ;
    this.step3Data.practical_assessment_experience = '1' ;

    this.loadknowledgeExperience();
  }

  loadknowledgeExperience() {
    this.Service.getwithoutData('https://service.eiac.gov.ae/webservice/service_page/?data=inspection-bodies')
    .subscribe(
      res => {
        this.schemeMainData = res['schemeData'];
        this.schemeSlideData = res['schemeData'];
        // //console.log(this.schemeSlideData,'schemeSlideData');
      })
  }

  profileData() {
    this.isProfileData = !this.isProfileData;
  }

  addRow(obj:any) {
    var newRow     =   {};
    obj.push(newRow);
  }

  removeRow(obj:any,index) {
    obj.splice(index, 1);
  }

  validateFile(fileEvent: any,doc_name:any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf','png'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check && doc_name == 'qualification_degree'){
      this.step2Data.qualification_degree_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('qualification_degree',fileEvent.target.files[0]);
      this.file_validation1 = true;
      return true;
    }else if(!ex_check && doc_name == 'qualification_degree'){
      this.file_validation1 = false;
      return false;
    }
    else if(ex_check && doc_name == 'education_specialization'){
      this.step2Data.education_specialization_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('education_specialization',fileEvent.target.files[0]);
      this.file_validation2 = true;
      return true;
    }else if(!ex_check && doc_name == 'education_specialization'){
      this.file_validation2 = false;
      return false;
    }else if(ex_check && doc_name == 'further_education'){
      this.step2Data.further_education_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('further_education',fileEvent.target.files[0]);
      this.file_validation3 = true;
      return true;
    }else if(!ex_check && doc_name == 'further_education'){
      this.file_validation3 = false;
      return false;
    }
    
  }

  step3Click(val:any,type:any){
    if(type == "list_auditor_click" && val == 1){
      this.step3ClickObj.list_auditor = 1 ;
    }else if(type == "list_auditor_click" && val == 0){
      this.step3ClickObj.list_auditor = 0 ;
    }else if(type == "attend_accreditation_click" && val == 1){
      this.step3ClickObj.attend_accreditation = 1 ;
    }else if(type == "attend_accreditation_click" && val == 0){
      this.step3ClickObj.attend_accreditation = 0 ;
    }else if(type == "attend_accreditation2_click" && val == 1){
      this.step3ClickObj.attend_accreditation2 = 1 ;
    }else if(type == "attend_accreditation2_click" && val == 0){
      this.step3ClickObj.attend_accreditation2 = 0 ;
    }else if(type == "practical_assessment_experience" && val == 1){
      this.step3ClickObj.practical_assessment_experience = 1 ;
    }else if(type == "practical_assessment_experience" && val == 0){
      this.step3ClickObj.practical_assessment_experience = 0 ;
    }
  }

  onSubmitStep1(ngForm1:any) {
    if(ngForm1.form.valid) {
      this.assessorsProfile.step1 = this.step1Data;
      //console.log(this.assessorsProfile);
      this.stepper.next();
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep2(ngForm2:any) {
    if(ngForm2.form.valid) {
      this.assessorsProfile = {};
      this.assessorsProfile.step2 = {};
      
      this.step2Data.arabic = this.arabic;
      this.step2Data.english = this.english;
      this.step2Data.others = this.others;

      this.assessorsProfile.step2 = this.step2Data;

      //console.log(this.assessorsProfile);
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      //console.log(this.step2DataBodyFormFile);
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep3(ngForm3:any) {
    if(ngForm3.form.valid) {
      this.assessorsProfile = {};
      this.assessorsProfile.step3 = {};
      this.assessorsProfile.step3 = this.step3Data;

      this.assessorsProfile.step3['list_auditorArr'] = [];
      this.assessorsProfile.step3['attend_accreditationArr'] = [];
      this.assessorsProfile.step3['attend_accreditation2Arr'] = [];
      this.assessorsProfile.step3['practical_assessment_experienceArr'] = [];
      
      if(this.list_auditor){
        this.assessorsProfile.step3['list_auditorArr'].push(this.list_auditor);
      }
      if(this.attend_accreditation){
        this.assessorsProfile.step3['attend_accreditationArr'].push(this.attend_accreditation);
      }
      if(this.attend_accreditation2){
        this.assessorsProfile.step3['attend_accreditation2Arr'].push(this.attend_accreditation2);
      }
      if(this.practical_assessment_experience){
        this.assessorsProfile.step3['practical_assessment_experienceArr'].push(this.practical_assessment_experience);
      }

      //console.log(this.assessorsProfile);
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep4(ngForm4:any) {
    // //console.log(this.schemeSlideData,'schemeSlideData');
    // schemeMainData
    var blankArr = {};
    this.schemeSlideData.forEach((res,key) => {
      
      if(res['knowledge_experienced'] && res['knowledge_experienced'] != ''){
        var key1 = res.id;
        var value = res['knowledge_experienced'];
        blankArr[key1] = value;
        
      }
    });
    //console.log(blankArr);

    // this.schemeSlideData.find(res => res['knowledge_experienced'] != '' );
  }

  onSubmitStep5(ngForm5:any) {
    
    if(ngForm5.form.valid) {
      if(this.step5Data.confirm_box != true){
        this.toastr.warning('Please check confirm box first','');
      }else{
        this.assessorsProfile = {};
        this.assessorsProfile.step5 = this.step5Data;
        //console.log(this.assessorsProfile);
      }
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }
}
