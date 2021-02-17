import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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
  file_validation1:boolean = true;
  file_validation2:boolean = true;
  file_validation3:boolean = true;
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
  profileComplete:any;
  headerSteps:any[] = [];
  progressValue:any = 0;

  step1DataBodyFormFile: any = new FormData();
  step2DataBodyFormFile: any = new FormData();
  step3DataBodyFormFile:any = new FormData();
  step4DataBodyFormFile:any = new FormData();
  step5DataBodyFormFile:any = new FormData();
  technicalFields:any[] = [];

  subTechnicalFields: any[] =[];

  tradeLicensedValidation1:any = false;
  tradeLicensedValidation2:any = false;
  tradeLicensedValidation3:any;
  public isAccData: any = '';
  isdDynamicsopenClose:any;
  today = new Date();
  minDate = new Date();
  titleArr:any[] = [];
  titleFind:any;
  loader:boolean = true;
  searchCountryLists:any[] = [];
  userId:any;
  criteriaList:any[] = [];
  whichForum:any[] = [{organization:'',date_from:'',date_to:''}];
  whichLanguage:any[] = [{language:'',read:0,write:0,speak:0}];
  languageArr:any = [];
  file_validation_listAuditor:boolean = true;
  modalOptions:NgbModalOptions;
  closeResult: string;

  subField: any = {}; 
  subInput: any = {};
  subInput1: any = {};
  
  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService,private modalService: NgbModal) {
    this.today.setDate(this.today.getDate());
   }


   loop(i: number) {
    return new Array(i);
}

checkInput(index: number){
    if(index != null){
      let input: any = this.subField[index]['title'];
      console.log(">> get input: ", input);
      if(input == '' || input == undefined || input == null){
          this.toastr.warning("Please Enter Field & Scoring properly",'', {timeOut:1000})
          return false;
      }
    }
}
checkInputSub(parent: number, inner: number){
  if(parent != null && inner != null){
    let input: any = this.subInput[parent][inner]['title'];
    console.log("@ get input: ", input);
    if(input == '' || input == undefined || input == null){
        this.toastr.warning("Please Enter Field & Scoring properly",'', {timeOut:1000})
        return false;
    }
  }
}
checkInputSub1(parent: number, inner: number){
  if(parent != null && inner != null){
    let input: any = this.subInput1[parent][inner]['title'];
    console.log("@ get input: ", input, " == ", this.subInput1);
    if(input == '' || input == undefined || input == null){
        this.toastr.warning("Please Enter Field & Scoring properly",'', {timeOut:1000})
        return false;
    }
  }
}

updateInput(theEvt: any, parent: number, inner: number){
    let inpValue: string;
    inpValue = theEvt.target.value;
    console.log("@Input: ", inpValue, " -- ", this.subInput[parent], " :: ", this.subInput[parent][inner]);
    if(this.subInput[parent][inner] != null && this.subInput[parent][inner]['title'] != null){
      this.subInput[parent][inner]['title'] = inpValue;
        console.log("@value assign....");
    }
}
updateInput1(theEvt: any, parent: number, inner: number){
  let inpValue: string;
  inpValue = theEvt.target.value;
  console.log("@Input: ", inpValue, " -- ", this.subInput1[parent], " :: ", this.subInput1[parent][inner]);
  if(this.subInput1[parent][inner] != null && this.subInput1[parent][inner]['title'] != null){
    this.subInput1[parent][inner]['title'] = inpValue;
      console.log("@value assign....");
  }
}


  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    this.userType = localStorage.getItem('type');
    this.isCompleteness = localStorage.getItem('isCompleteness');
    this.profileComplete = localStorage.getItem('profileComplete');
    this.userId = localStorage.getItem('userId');

    //this.subField['title'] = '';
    for(let i=0; i<8; i++){
      this.subField[i] = {};
      this.subField[i]['title'] = '';
      this.subField[i]['checked'] = '';
    }
    for(let i=0; i<4; i++){
      this.subInput[i] = {};
      for(let k=0; k<4; k++){
        this.subInput[i][k] = {};
        this.subInput[i][k]['title'] = '';
        this.subInput[i][k]['checked'] = '';
      }
    }
    for(let i=0; i<5; i++){
      this.subInput1[i] = {};
      for(let k=0; k<5; k++){
        this.subInput1[i][k] = {};
        this.subInput1[i][k]['title'] = '';
        this.subInput1[i][k]['checked'] = '';
      }
    }

    console.log(this.subField, " -- ", this.subInput, " == ", this.subInput1);


    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      },
      {
      title:'educational_information', desc:'2. Educational <br> Information', activeStep:false, stepComp:false, icon:'icon-book', activeClass:''
      },
      {
      title:'employment', desc:'3. Employment', activeStep:false, stepComp:false, icon:'icon-work', activeClass:''
      },
      {
      title:'knowledge_experience', desc:'4. Knowledge <br> And Experience', activeStep:false, stepComp:false, icon:'icon-google-doc', activeClass:''
      },
      {
      title:'applicant_trainer', desc:'5. Applicant <br> Assessor', activeStep:false, stepComp:false, icon:'icon-doc-edit', activeClass:''
      }
    );
    this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];
    this.step3Data.list_auditor = '1' ;
    this.step3Data.attend_accreditation = '1' ;
    this.step3Data.attend_accreditation2 = '1' ;
    this.step3Data.practical_assessment_experience = '1' ;
    // this.languageArr = this.Service.getLanguages();

    // this.loadknowledgeExperience();
    this.loadStepsData();
    this.stepDefaultValue();
    this.loadLanguages();

    this.subTechnicalFields.push({
      title: 'Proficiency Testing Providers',
      id: 100,
      isChild: false,
      technicalFields: [
        {field_title: {} , entryRow: 8, knowledge_sub_experienced:''}
      ]
    },
    {
      title: 'Reference Material Producers',
      id: 101,
      isChild: true,
      isLabel: 'reference',
      technicalFields: [
        {
          subTitle: 'Testing',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Calibration',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Medical',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Inspection',
          subInput: {title: ''},
          entryRow: 4,
        },
      ]
    },
    {
      title: 'Validation and Verification Bodies',
      id: 102,
      isChild: true,
      isLabel: 'validation',
      technicalFields: [
        {
          subTitle: 'Testing',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Calibration',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Medical',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Inspection',
          subInput: {title: ''},
          entryRow: 4,
        },
        {
          subTitle: 'Certification Body',
          subInput: {title: ''},
          entryRow: 4,
        },
      ]
    },
    )

    window.console.log("#Sub fields: ", this.subTechnicalFields);

  }

  loadLanguages = async() => {
    let countryList =  this.Service.getLanguages();
    await countryList.subscribe(record => {
      // console.log(record,'record');
      this.languageArr = record['languages'];
    });
    
  }

  getPlaceName(data)
    {
      if(typeof this.step5Data.place != 'undefined')
      {
        this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.step5Data.place+'.json?access_token='+this.Service.mapboxToken+'','')
          .subscribe(res => {
              // //console.log(res['features']);
              this.searchCountryLists = res['features'];
            },
            error => {
            
        })
      }
    }
  stepDefaultValue() {
    this.step1Data.first_name = '';
    this.step1Data.last_name = '';
    this.step1Data.personal_email = '';
    this.step1Data.phone_with_area = '';
    this.step1Data.office_email = '';
    this.step1Data.date_of_birth = '';
    this.step1Data.mailing_address = '';
    this.step1Data.fax_with_area = '';
    this.step1Data.office_institution = '';
    this.step1Data.designation = '';
    this.step1Data.office_address = '';
    this.step1Data.officephone_with_area = '';
    this.step1Data.officefax_with_area = '';
    this.step1Data.nationality = '';
    this.step2Data.which = '';
    this.step2Data.completeProfileFrom = '';
    this.step2Data.completeProfileTill = '';
    this.step2Data.qualification_degree = '';
    this.step2Data.university_college = '';
    this.step2Data.education_specialization = '';
    this.step2Data.further_education = '';
    this.step2Data.others_education = '';

    this.english = {
      read:0,
      write:0,
      speak:0
    };
    this.arabic = {
      read:0,
      write:0,
      speak:0
    };
    this.others = {
      read:0,
      write:0,
      speak:0
    };

    this.list_auditor = [{
      detail:'',
      organization:'',
      date_to:'',
    }];
    this.attend_accreditation = [{
      detail:'',
      date_from:'',
      date_to:'',
      organization:'',
    }];
    this.attend_accreditation2 = [{
      organization:'',
      date_from:'',
      date_to:'',
    }];
    this.practical_assessment_experience = [{
      date_to:'',
      standard:'',
      technical:'',
      role:'',
      commissioned_by:'',
      assessment_type:'',
      accreditation_activity:'',
    }];

    this.assessorsProfile.step4 = {};
    this.assessorsProfile.step4['technical_experience'] = [];
    this.step5Data.confirm_box = '';
    this.step5Data.place = '';
    this.step5Data.digital_signature = '';
    this.step5Data.date = '';
  }
  // setexDate(){
  //   let cdate =this.assessorsProfile.date_of_birth;
  //   this.minDate = new Date(cdate  + (60*60*24*1000));
  // }
  
  isTableAcc(id) {
    this.isAccData = id;
    //console.log(this.isAccData);
  }
  isTableClose() {
    this.isAccData = '';
    //console.log(this.isAccData,'jhhjhjgghjgh');
  }

  setexDate(date){
    let cdate = date;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }

  loadStepsData() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail+'&id='+this.userId)
    .subscribe(
      res => {
        console.log(res['data'],'data');
        if(res['status'] == true) {
          this.loader = true;
          this.criteriaList = res['data']['criteriaList'];
          var first_nameData = res['data']['user_data'][0].first_name.split(' ');
          
          this.titleArr.forEach((res2,key) => {
            if(res2 == first_nameData[0]){
              this.titleFind = first_nameData[0];
              // this.firstName = first_nameData[1];
            }
          })
          
          this.step1Data.title = this.titleFind;
          this.step1Data.first_name = this.titleFind != '' && this.titleFind != undefined ? first_nameData[1] : first_nameData[0];
          this.step1Data.last_name = res['data']['user_data'][0].last_name;
          this.step1Data.personal_email = res['data']['user_data'][0].email;
          this.step1Data.phone_with_area = res['data']['user_data'][0].contact;

          this.technicalFields = res['data'].technical_field;
            this.technicalFields.forEach((item, tind) => {
              if(item.title === 'Management Certification Bodies'){
                item.title = 'Certification Bodies';
              }
            });

          if(res['data'].step1 != '' && res['data'].step1[0] && res['data']['user_data'][0].first_name != "" && res['data'].step1[0].office_email != "" && res['data'].step1[0].dob != null && res['data'].step1[0].mailing_address != "" && res['data'].step1[0].office != "" && res['data'].step1[0].designation != "" && res['data'].step1[0].office_address != "" && res['data'].step1[0].office_tel_no != "" && res['data'].step1[0].nationality != null) {
            this.progressValue = 22;
            this.Service.moveSteps('personal_details','educational_information', this.headerSteps);
          }
          if(res['data'].step2 != '' && res['data'].step2['education'] && res['data'].step2['education'][0].qualification_file != null && res['data'].step2['education'][0].detail && res['data'].step2['education'][0].organization && res['data'].step2['education'][0].specialization && res['data'].step2['language'].length > 0 && res['data'].step2['which_forum'].length > 0) {
            this.progressValue = 44;
            this.Service.moveSteps('educational_information','employment', this.headerSteps);
          }
          if(res['data'].step3 != '' && res['data'].step3.experience_1 != '' && res['data'].step3.experience_2 != '' && res['data'].step3.experience_3 != '' && res['data'].step3.experience_4 != '') {

            var experience1_detail = 0;var experience1_organization = 0;var experience1_date_to = 0;
            var experience2_detail = 0;var experience2_date_from = 0;var experience2_date_to = 0;var experience2_organization = 0;
            var experience3_organization = 0;var experience3_date_from = 0;var experience3_date_to = 0;
            var experience4_date_to = 0;var experience4_standard = 0;var experience4_technical = 0;var experience4_role = 0;var experience4_commissioned_by = 0;var experience4_assessment_type = 0;var experience4_accreditation_activity = 0;

            var experience_1 = res['data'].step3.experience_1;
            var experience_2 = res['data'].step3.experience_2;
            var experience_3 = res['data'].step3.experience_3;
            var experience_4 = res['data'].step3.experience_4;

            if(experience_1 != '') {
              for(var key in experience_1) {
                if(experience_1[key].detail != "") {
                  experience1_detail = 1;
                }else{
                  experience1_detail = 0;
                }
                if(experience_1[key].organization != "") {
                  experience1_organization = 1
                }else{
                  experience1_organization = 0;
                }
                if(experience_1[key].date_to != null) {
                  experience1_date_to = 1
                }else{
                  experience1_date_to = 0;
                }
              }
            }
            if(experience_2 != '') {
              for(var key in experience_2) {
                if(experience_2[key].detail != "") {
                  experience2_detail = 1;
                }else{
                  experience2_detail = 0;
                }
                if(experience_2[key].date_from != "") {
                  experience2_date_from = 1
                }else{
                  experience2_date_from = 0;
                }
                if(experience_2[key].date_to != null) {
                  experience2_date_to = 1
                }else{
                  experience2_date_to = 0;
                }
                if(experience_2[key].organization != null) {
                  experience2_organization = 1
                }else{
                  experience2_organization = 0;
                }
              }
            }
            if(experience_3 != '') {
              for(var key in experience_3) {
                if(experience_3[key].organization != "") {
                  experience3_organization = 1;
                }else{
                  experience3_organization = 0;
                }
                if(experience_3[key].date_from != "") {
                  experience3_date_from = 1
                }else{
                  experience3_date_from = 0;
                }
                if(experience_3[key].date_to != null) {
                  experience3_date_to = 1
                }else{
                  experience3_date_to = 0;
                }
              }
            }
            if(experience_4 != '') {
              for(var key in experience_4) {
                if(experience_4[key].date_to != "") {
                  experience4_date_to = 1;
                }else{
                  experience4_date_to = 0;
                }
                if(experience_4[key].standard != "") {
                  experience4_standard = 1
                }else{
                  experience4_standard = 0;
                }
                if(experience_4[key].technical != null) {
                  experience4_technical = 1
                }else{
                  experience4_technical = 0;
                }
                if(experience_4[key].role != null) {
                  experience4_role = 1
                }else{
                  experience4_role = 0;
                }
                if(experience_4[key].commissioned_by != null) {
                  experience4_commissioned_by = 1
                }else{
                  experience4_commissioned_by = 0;
                }
                if(experience_4[key].assessment_type != null) {
                  experience4_assessment_type = 1
                }else{
                  experience4_assessment_type = 0;
                }
                if(experience_4[key].accreditation_activity != null) {
                  experience4_accreditation_activity = 1
                }else{
                  experience4_accreditation_activity = 0;
                }
              }
            }

            if(experience1_detail == 1 && experience1_organization == 1 && experience1_date_to == 1 && experience2_detail == 1 && experience2_date_from == 1 && experience2_date_to == 1 && experience2_organization == 1 && experience3_organization == 1 && experience3_date_from == 1 && experience3_date_to == 1 && experience4_date_to == 1 && experience4_standard == 1 && experience4_technical == 1 && experience4_role == 1 && experience4_commissioned_by == 1 && experience4_assessment_type == 1 && experience4_accreditation_activity == 1){
              // this.exp1_result = 1;
              this.progressValue = 66;
              this.Service.moveSteps('employment','knowledge_experience', this.headerSteps);
            }
            
          }
          if(res['data'].step4 && res['data'].step4 != '' && res['data'].step4['technical_experience'] && res['data'].step4['technical_experience'] != '') {
            this.progressValue = 88;
            this.Service.moveSteps('knowledge_experience','applicant_trainer', this.headerSteps);
          }

          if(res['data'].step4 && res['data'].step4['technical_experience_custom'] != undefined && res['data'].step4['technical_experience_custom'] != '') {
                
              let filterData: any;
              let customData: any[] = res['data'].step4['technical_experience_custom'];
              
              filterData = customData.filter(item => (item.free_text != null && item.free_text != ''));
              console.log("@Filter Custom: ", filterData, " -- ", customData);

              //Participants Data show.
              let Ptpdata: any = filterData.filter(item => item.free_text_type == 1);
              console.log("@PTP Data: ", Ptpdata)
              if(Ptpdata){
                Ptpdata.forEach((item, key) => {
                  this.subField[key]['title'] = item.free_text;
                  this.subField[key]['checked'] = item.experience;
                })
              } 
              console.log("@GET PTP Daata: ", Ptpdata, " :: ", this.subField, " --- ", this.subTechnicalFields);

              //Reference
              let RefDataTesting: any = filterData.filter(item => item.free_text_type == 2);
              let RefDataCalibration: any = filterData.filter(item => item.free_text_type == 3);
              let RefDataMedical: any = filterData.filter(item => item.free_text_type == 4);
              let RefDataInspection: any = filterData.filter(item => item.free_text_type == 5);

              //Validation section
              let ValDataTesting: any     = filterData.filter(item => item.free_text_type == 6);
              let ValDataCalibration: any = filterData.filter(item => item.free_text_type == 7);
              let ValDataMedical: any     = filterData.filter(item => item.free_text_type == 8);
              let ValDataInspection: any  = filterData.filter(item => item.free_text_type == 9);
              let ValDataCB: any          = filterData.filter(item => item.free_text_type == 10);

              console.log("@@@Defore ", this.technicalFields, " -- ", this.subTechnicalFields);
              this.subTechnicalFields.forEach((item, tind) => {

                //For - Reference
                if(item.isLabel === 'reference' && item.technicalFields.length){
                  item.technicalFields.forEach((data,pind) => {
                        console.log(data.subTitle, " -- ", data.entryRow," -- ", RefDataTesting)
                        if(data.subTitle != '' && data.subTitle =='Testing'){
                          RefDataTesting.forEach((rec, key) => {
                            this.subInput[pind][key]['title']     = rec.free_text;
                            this.subInput[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Calibration'){
                          RefDataCalibration.forEach((rec, key) => {
                            this.subInput[pind][key]['title']     = rec.free_text;
                            this.subInput[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Medical'){
                          RefDataMedical.forEach((rec, key) => {
                            this.subInput[pind][key]['title']     = rec.free_text;
                            this.subInput[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Inspection'){
                          RefDataInspection.forEach((rec, key) => {
                            this.subInput[pind][key]['title']     = rec.free_text;
                            this.subInput[pind][key]['checked']   = rec.experience;
                          })
                        }
                  })
                }
                //For validators
                if(item.isLabel === 'validation' && item.technicalFields.length){
                  item.technicalFields.forEach((data,pind) => {
                        console.log(data.subTitle, " -- ", data.entryRow," -- ", RefDataTesting)
                        if(data.subTitle != '' && data.subTitle =='Testing'){
                          ValDataTesting.forEach((rec, key) => {
                            this.subInput1[pind][key]['title']     = rec.free_text;
                            this.subInput1[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Calibration'){
                          ValDataCalibration.forEach((rec, key) => {
                            this.subInput1[pind][key]['title']     = rec.free_text;
                            this.subInput1[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Medical'){
                          ValDataMedical.forEach((rec, key) => {
                            this.subInput1[pind][key]['title']     = rec.free_text;
                            this.subInput1[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Inspection'){
                          ValDataInspection.forEach((rec, key) => {
                            this.subInput1[pind][key]['title']     = rec.free_text;
                            this.subInput1[pind][key]['checked']   = rec.experience;
                          })
                        }
                        if(data.subTitle != '' && data.subTitle =='Certification Body'){
                          ValDataCB.forEach((rec, key) => {
                            this.subInput1[pind][key]['title']     = rec.free_text;
                            this.subInput1[pind][key]['checked']   = rec.experience;
                          })
                        }
                  })
                }
              })
              console.log("Updated subinput for testing: ", this.subInput, " :: ", this.subInput1);

          }          

          if(res['data'].step1 != '' && res['data'].step1[0]) {
            var step1 = res['data'].step1[0];
            this.step1Data.office_email = step1.office_email;
            this.step1Data.date_of_birth = step1.dob;
            this.step1Data.mailing_address = step1.mailing_address;
            // this.step1Data.phone_with_area = step1.first_name;
            this.step1Data.fax_with_area = step1.fax_no;
            this.step1Data.office_institution = step1.office;
            this.step1Data.designation = step1.designation;
            this.step1Data.office_address = step1.office_address;
            this.step1Data.officephone_with_area = step1.office_tel_no;
            // this.step1Data.officefax_with_area = step1.office_fax_no;
            this.step1Data.nationality = step1.nationality;
          }
          if(res['data'].step2 != '') {
            var step2 = res['data'].step2;

            // console.log(step2.language.length,'language')
            this.whichLanguage = step2.language.length > 0 ? step2.language : [{}];
            this.whichForum = step2.which_forum.length > 0 ? step2.which_forum : [{}];

            // var language = step2['language'];
            // if(language != null) {
            //   for(let key in language)
            //   {
            //     if(language[key].language == 'arabic')
            //     {
            //       this.arabic = language[key];
            //     }
            //     if(language[key].language == 'english')
            //     {
            //       this.english = language[key];
            //     }
            //     if(language[key].language == 'others')
            //     {
            //       this.others = language[key];
            //     }
            //   }
            // }

            if(step2['education'] != null && step2['education'][0]) {
              this.step2Data.qualification_degree = step2['education'] && step2['education'][0].detail ? step2['education'][0].detail : '';
              this.step2Data.university_college = step2['education'] && step2['education'][0].organization ? step2['education'][0].organization : '';
              this.step2Data.education_specialization = step2['education'] && step2['education'][0].specialization ? step2['education'][0].specialization : '';
              this.step2Data.further_education = step2['further_education'] && step2['further_education'][0].detail ? step2['further_education'][0].detail : '';
              this.step2Data.others_education = step2['others_education'] && step2['others_education'][0].detail ? step2['others_education'][0].detail : '';
              // this.step2Data.which = step2['which_forum'] && step2['which_forum'][0].organization ? step2['which_forum'][0].organization : '';
              // this.step2Data.completeProfileFrom = step2['which_forum'] && step2['which_forum'][0].date_from ? new Date(step2['which_forum'][0].date_from) : '';
              // this.step2Data.completeProfileTill = step2['which_forum'] && step2['which_forum'][0].date_to ? new Date(step2['which_forum'][0].date_to) : '';

              this.tradeLicensedValidation1 = step2['education'] && step2['education'][0].qualification_file != null ? this.constant.mediaPath+step2['education'][0].qualification_file : '';
              this.tradeLicensedValidation2 = step2['education'] && step2['education'][0].specialization_file != null ? this.constant.mediaPath+step2['education'][0].specialization_file : '';
              this.tradeLicensedValidation3 = step2['further_education'] && step2['further_education'][0].qualification_file != null ? this.constant.mediaPath+step2['further_education'][0].qualification_file : '';
            }
          }
          if(res['data'].step3 != '') {
            var step3 = res['data'].step3;
            this.step3Data.list_auditor = step3.experience_1 != '' ? '1' : '0';
            this.list_auditor = step3.experience_1;
            // console.log(step3.experience_1,'experience_1');

            this.step3Data.attend_accreditation = step3.experience_2 != '' ? '1' : '0';
            this.attend_accreditation = step3.experience_2;

            this.step3Data.attend_accreditation2 = step3.experience_3 != '' ? '1' : '0';
            this.attend_accreditation2 = step3.experience_3;

            this.step3Data.practical_assessment_experience = step3.experience_4 != '' ? '1' : '0';
            this.practical_assessment_experience = step3.experience_4;
          }
          if(res['data'].step4 != '') {
            // console.log(res['data'].technical_field);
            var step4 = res['data'].step4;
            // console.log(step4['technical_experience'],'step5');
            for(let key in step4['technical_experience']) {
              this.technicalFields.forEach(res => {
                for(let nxtkey in res['technical_fields']) {
                  if(key == res['technical_fields'][nxtkey].field_mgmt) {
                    res['technical_fields'][nxtkey].knowledge_experienced = step4['technical_experience'][key];
                  }
                }
              });
            }
            // console.log(this.technicalFields,'step5');
          }
          if(res['data'].step5 != '' && res['data'].step5[0]) {
            var step5 = res['data'].step5[0];
            this.step5Data.confirm_box = step5.status;
            this.step5Data.place = step5.place;
            this.step5Data.digital_signature = step5.signature;
            this.step5Data.date = new Date(step5.registration_date);
          }


        }
      });
  }

  dynamicsopenClose(id,status)
  {
    if(status == 'open')
    {
      this.isdDynamicsopenClose = id;
    }else if(status == 'close'){
      this.isdDynamicsopenClose = '0';
    }
    //console.log(this.isdDynamicsopenClose);
    //console.log(status);
  }

  // loadknowledgeExperience() {
  //   this.Service.getwithoutData('https://service.eiac.gov.ae/webservice/service_page/?data=inspection-bodies')
  //   .subscribe(
  //     res => {
  //       this.schemeMainData = res['schemeData'];
  //       this.schemeSlideData = res['schemeData'];
  //       // //console.log(this.schemeSlideData,'schemeSlideData');
  //     })
  // }

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
    var ex_type = ['pdf','png','jpg','jpeg','JPEG'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check && doc_name == 'qualification_degree'){
      // this.step2Data.qualification_degree_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('qualification_degree_file',fileEvent.target.files[0]);
      this.file_validation1 = true;
      this.tradeLicensedValidation1 = true;
      return true;
    }else if(!ex_check && doc_name == 'qualification_degree'){
      this.file_validation1 = false;
      this.tradeLicensedValidation1 = false;
      return false;
    }
    else if(ex_check && doc_name == 'education_specialization'){
      // this.step2Data.education_specialization_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('education_specialization_file',fileEvent.target.files[0]);
      this.file_validation2 = true;
      this.tradeLicensedValidation2 = true;
      return true;
    }else if(!ex_check && doc_name == 'education_specialization'){
      this.file_validation2 = false;
      this.tradeLicensedValidation2 = false;
      return false;
    }else if(ex_check && doc_name == 'further_education'){
      // this.step2Data.further_education_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('further_education_file',fileEvent.target.files[0]);
      this.file_validation3 = true;
      return true;
    }else if(!ex_check && doc_name == 'further_education'){
      this.file_validation3 = false;
      return false;
    }
    
  }

  validateFileDynamics(fileEvent: any,key:any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf','png','jpg','jpeg','JPEG'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check) {
      this.list_auditor[key].upload_file = fileEvent.target.files[0].name;
      this.step2DataBodyFormFile.append('qualification_file_'+key,fileEvent.target.files[0]);
    }
  }

  filePathVreateDynamics(filePath) {
    return this.constant.mediaPath+filePath;
  }

  listAuditorFile(fileEvent: any,key:any,id?: any) {
    // this.file_validation_listAuditor = ;
    if(id && id != ''){
      var file_name = fileEvent.target.files[0].name;
      var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
      var ex_type = ['pdf'];
      var ex_check = this.Service.isInArray(file_exe,ex_type);
      if(ex_check) {
        this.list_auditor[key].list_auditor_upload = fileEvent.target.files[0].name;
        this.step3DataBodyFormFile.append('qualification_file_exist_'+id,fileEvent.target.files[0]);
        this.file_validation_listAuditor = true;
      }else{
        this.file_validation_listAuditor = false;
      }
    }else{
      var file_name = fileEvent.target.files[0].name;
      var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
      var ex_type = ['pdf'];
      var ex_check = this.Service.isInArray(file_exe,ex_type);
      if(ex_check) {
        this.list_auditor[key].list_auditor_upload = fileEvent.target.files[0].name;
        this.step3DataBodyFormFile.append('qualification_file_'+key,fileEvent.target.files[0]);
        this.file_validation_listAuditor = true;
      }else{
        this.file_validation_listAuditor = false;
      }
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
      this.assessorsProfile = {};
      this.assessorsProfile.step1 = {};
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.step1Data.officefax_with_area = 34352535;
      this.assessorsProfile.step1 = this.step1Data;
      //console.log(this.assessorsProfile);
      this.loader = false;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            // this.toastr.success(res['msg'], '');
            this.progressValue == 0 || this.progressValue < 22 ? this.progressValue = 22 : this.progressValue = this.progressValue ;
            // this.Service.headerStepMove('educational_information',this.headerSteps,'personal_details');
            // this.router.navigateByUrl('/sign-in');
            this.Service.moveSteps('personal_details','educational_information', this.headerSteps);
          }
          this.loader = true;
        });
      // this.stepper.next();
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep2(ngForm2:any) {
    if(this.tradeLicensedValidation1 == false)
      {
        this.file_validation1 = false;
        this.toastr.warning('Please Fill required field','');
      }
      // else if(this.tradeLicensedValidation2 == false)
      // {
      //   this.file_validation2 = false;
      //   this.toastr.warning('Please Fill required field','');
      // }
      else if(ngForm2.form.valid) {
        this.assessorsProfile = {};
        this.assessorsProfile.step2 = {};
        this.assessorsProfile.step2 = this.step2Data;
        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;
        this.assessorsProfile.step2['whichLanguage'] = [];
        this.assessorsProfile.step2['whichForum'] = [];
        // this.step2Data.arabic = this.arabic;
        // this.step2Data.english = this.english;
        // this.step2Data.others = this.others;
        if(this.whichLanguage){
          this.assessorsProfile.step2['whichLanguage'] = this.whichLanguage;
        }
        if(this.whichForum){
          this.assessorsProfile.step2['whichForum'] = this.whichForum;
        }
        this.loader = false;
        //console.log(this.assessorsProfile);
        this.step2DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
        //console.log(this.step2DataBodyFormFile);
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              // this.toastr.success(res['msg'], '');
              // this.router.navigateByUrl('/sign-in');
              this.progressValue == 22 || this.progressValue < 44 ? this.progressValue = 44 : this.progressValue = this.progressValue ;
              // this.Service.headerStepMove('employment',this.headerSteps,'educational_information');
              this.Service.moveSteps('educational_information','employment', this.headerSteps);
            }
            this.loader = true;
          });
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep3(ngForm3:any) {
    if(ngForm3.form.valid) {
      this.assessorsProfile = {};
      this.assessorsProfile.step3 = {};
      this.assessorsProfile.step3 = this.step3Data;
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;

      this.assessorsProfile.step3['list_auditorArr'] = [];
      this.assessorsProfile.step3['attend_accreditationArr'] = [];
      this.assessorsProfile.step3['attend_accreditation2Arr'] = [];
      this.assessorsProfile.step3['practical_assessment_experienceArr'] = [];
      
      if(this.list_auditor){
        this.assessorsProfile.step3['list_auditorArr'] = this.list_auditor;
      }
      if(this.attend_accreditation){
        this.assessorsProfile.step3['attend_accreditationArr'] = this.attend_accreditation;
      }
      if(this.attend_accreditation2){
        this.assessorsProfile.step3['attend_accreditation2Arr'] = this.attend_accreditation2;
      }
      if(this.practical_assessment_experience){
        this.assessorsProfile.step3['practical_assessment_experienceArr'] = this.practical_assessment_experience;
      }
      this.loader = false;

      this.step3DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      //console.log(this.step2DataBodyFormFile);
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            // this.toastr.success(res['msg'], '');
            // this.router.navigateByUrl('/sign-in');
            this.progressValue == 44 || this.progressValue < 66 ? this.progressValue = 66 : this.progressValue = this.progressValue ;
            // this.Service.headerStepMove('knowledge_experience',this.headerSteps,'employment');
            this.Service.moveSteps('employment','knowledge_experience', this.headerSteps);
          }
          this.loader = true;
        });
      //console.log(this.assessorsProfile);
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  onSubmitStep4(ngForm4:any) {
    // //console.log(this.schemeSlideData,'schemeSlideData');
    // schemeMainData
    let freetextInput: boolean = false;
    let freetextInput1: boolean = false;
    let freefieldInput: boolean = false;
    //console.log("@Form submit: ", ngForm4.form.valid);
    //console.log(this.subInput, " :: ", this.subInput1, this.subField, " == ");

    //subinput
    for(let k in this.subInput){
        if(typeof this.subInput[k] === 'object'){
          for(let p in this.subInput[k]){
            if(typeof this.subInput[k][p] === 'object' && (this.subInput[k][p]['title'] != '' && this.subInput[k][p]['checked'] === '')
                          || (this.subInput[k][p]['title'] === '' && this.subInput[k][p]['checked'] != '')){
              freetextInput = true;
              console.log("@Empty...Reference free text: ", k," :: ", p);
              this.toastr.warning('Please Enter Field & Scoring properly','', {timeOut:1000});
              return false;
            }
          }
        }
    }
    for(let k in this.subInput1){
      if(typeof this.subInput1[k] === 'object'){
        for(let p in this.subInput1[k]){
          if(typeof this.subInput1[k][p] === 'object' && (this.subInput1[k][p]['title'] != '' && this.subInput1[k][p]['checked'] === '')
                    || (this.subInput1[k][p]['title'] === '' && this.subInput1[k][p]['checked'] != '')){
            freetextInput1 = true;
            console.log("@Empty...Validation free text: ", k," :: ", p);
            this.toastr.warning('Please Enter Field & Scoring properly','');
            return false;
          }
        }
      }
  }
    //subfield
    for(let k in this.subField){
      if(typeof this.subField[k] === 'object'){
          if(typeof this.subField[k] === 'object' && (this.subField[k]['title'] != '' && this.subField[k]['checked'] === '')
                || (this.subField[k]['title'] === '' && this.subField[k]['checked'] != '')){
            console.log("@Empty...proficiency free text: ", k);
            freefieldInput = true;
            this.toastr.warning('Please Enter Field & Scoring properly','');
            return false;
          }
      }
    }

    /**********************************************************************************
    //Saving structure
    //technical_experience_custom
    //technical_experience_custom:{'Freetext Value' : {'free_text_type':'1', 'experience': '3'} ,  'Freetext Value' : {'free_text_type':'1', 'experience': '3'}   }
    'Freetext Value' : {'free_text_type':'1', 'experience': '3'} ,  'Freetext Value' : {'free_text_type':'1', 'experience': '3'} 
    #Free text type: 
    1   =   Proficiency_Testing_Providers
    2   =   Reference_Material_Producers_Testing
    3   =   Reference_Material_Producers_Calibration
    4   =   Reference_Material_Producers_Medical
    5   =   Reference_Material_Producers_Inspection
    6   =   Validation_and_Verification_Bodies_Testing
    7   =   Validation_and_Verification_Bodies_Calibration
    8   =   Validation_and_Verification_Bodies_Medical
    9   =   Validation_and_Verification_Bodies_Inspection
    */




    //return;

    let customFreeText: any = {};
    let cnt = 0;
    let subFiledLen: any = this.Service.getObjectLength(this.subField);
    let postObj: any = {};
    postObj['technical_experience_custom'] = {};
    window.console.log("@Subfiled Len: ", subFiledLen);
    for(let key in this.subField){
      let tempObj: any            = {};
      tempObj['free_text_type']   = 1;
      tempObj['experience']       = this.subField[key].checked;
      if(this.subField[key].title != undefined){
        customFreeText[this.subField[key].title.toString()] = tempObj;
      }
    }
    this.subTechnicalFields.forEach((item, tind) => {
            //For - Reference
            if(item.isLabel === 'reference' && item.technicalFields.length){
              item.technicalFields.forEach((data,pind) => {
                    console.log(data.subTitle, " -- ", data.entryRow)
                    if(data.subTitle != '' && data.subTitle =='Testing'){
                      for(let key in this.subInput[pind]){
                        console.log(">>> Testing: ", pind, " == ", key);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 2;
                        tempObj['experience']       = this.subInput[pind][key].checked;
                        if(this.subInput[pind][key].title != undefined){
                          customFreeText[this.subInput[pind][key].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Calibration'){
                      for(let key1 in this.subInput[pind]){
                        console.log(">>> Calibration: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 3;
                        tempObj['experience']       = this.subInput[pind][key1].checked;
                        if(this.subInput[pind][key1].title != undefined){
                          customFreeText[this.subInput[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Medical'){
                      for(let key1 in this.subInput[pind]){
                        console.log(">>> Medical: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 4;
                        tempObj['experience']       = this.subInput[pind][key1].checked;
                        if(this.subInput[pind][key1].title != undefined){
                          customFreeText[this.subInput[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Inspection'){
                      for(let key1 in this.subInput[pind]){
                        console.log(">>> Inspection: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 5;
                        tempObj['experience']       = this.subInput[pind][key1].checked;
                        if(this.subInput[pind][key1].title != undefined){
                          customFreeText[this.subInput[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
              })
            }
            //For - Validation
            console.log("@ subinput: ", this.subInput1);
            if(item.isLabel === 'validation' && item.technicalFields.length){
              item.technicalFields.forEach((data,pind) => {
                    console.log(data.subTitle, " -- ", data.entryRow)
                    if(data.subTitle != '' && data.subTitle =='Testing'){
                      for(let key in this.subInput1[pind]){
                        console.log(">>> Testing: ", pind, " == ", key);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 6;
                        tempObj['experience']       = this.subInput1[pind][key].checked;
                        if(this.subInput1[pind][key].title != undefined){
                          customFreeText[this.subInput1[pind][key].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Calibration'){
                      for(let key1 in this.subInput1[pind]){
                        console.log(">>> Calibration: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 7;
                        tempObj['experience']       = this.subInput1[pind][key1].checked;
                        if(this.subInput1[pind][key1].title != undefined){
                          customFreeText[this.subInput1[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Medical'){
                      for(let key1 in this.subInput1[pind]){
                        console.log(">>> Medical: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 8;
                        tempObj['experience']       = this.subInput1[pind][key1].checked;
                        if(this.subInput1[pind][key1].title != undefined){
                          customFreeText[this.subInput1[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Inspection'){
                      for(let key1 in this.subInput1[pind]){
                        console.log(">>> Inspection: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 9;
                        tempObj['experience']       = this.subInput1[pind][key1].checked;
                        if(this.subInput1[pind][key1].title != undefined){
                          customFreeText[this.subInput1[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
                    if(data.subTitle != '' && data.subTitle =='Certification Body'){
                      for(let key1 in this.subInput1[pind]){
                        console.log(">>> Inspection: ", pind, " == ", key1);
                        let tempObj: any            = {};
                        tempObj['free_text_type']   = 10;
                        tempObj['experience']       = this.subInput1[pind][key1].checked;
                        if(this.subInput1[pind][key1].title != undefined){
                          customFreeText[this.subInput1[pind][key1].title.toString()] = tempObj;
                        }
                      }
                    }
              })
            }
    })

    //Redefine objects
    let tempObj: any = {};
    for(var key in customFreeText){
          if(key != ''){
            tempObj[key] = customFreeText[key];
          }
    }
    customFreeText = {...tempObj};
    //console.log("Filter custom...", tempObj, " === ", customFreeText);
    postObj['technical_experience_custom'] = customFreeText;
    //Reference_Material_Producers_Testing
    //console.log(">>>> Free text: ", customFreeText, " -- ", postObj)
    //return;
    //&& freetextInput && freefieldInput && freetextInput1
    if(ngForm4.form.valid ) {

        this.assessorsProfile = {};
        this.assessorsProfile.step4 = {};
        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;

        this.assessorsProfile.step4['technical_experience']         = [];
        this.assessorsProfile.step4['technical_experience_custom']  = {};
        this.assessorsProfile.step4['technical_experience_custom']  = customFreeText;
        var blankArr = {};
        // primaryJson['course'] = [];
        this.technicalFields.forEach((res,key) => {
          for(let key2 in res['technical_fields']){
            // console.log(res['technical_fields'][key2],'knowledge_experienced');
            if(res['technical_fields'][key2].knowledge_experienced && res['technical_fields'][key2].knowledge_experienced != ''){
              var key1 = res['technical_fields'][key2].field_mgmt;
              var value = res['technical_fields'][key2]['knowledge_experienced'];
              
              blankArr[key1] = value;              
            }
            this.assessorsProfile.step4['technical_experience'] = blankArr;            
          }
        });
        console.log(this.assessorsProfile,'@ Assessor profile post');
        this.loader = false;
        this.step4DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
        //console.log(this.step2DataBodyFormFile);
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step4DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              // this.toastr.success(res['msg'], '');
              // this.router.navigateByUrl('/sign-in');
              this.progressValue == 66 || this.progressValue < 88 ? this.progressValue = 88 : this.progressValue = this.progressValue ;
              // this.Service.headerStepMove('applicant_trainer',this.headerSteps,'knowledge_experience');
              this.Service.moveSteps('knowledge_experience','applicant_trainer', this.headerSteps);
            }
            this.loader = true;
          });
        // this.Service.headerStepMove('knowledge_experience',this.headerSteps,'applicant_trainer');
        
      }else{
        this.toastr.warning('Please Fill required field','');
      }

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
        this.loader = false;
        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;
        this.step5DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
        this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step5DataBodyFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 88 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
              // this.router.navigateByUrl('/sign-in');

              if(localStorage.getItem('profileComplete') == '0') {
                setTimeout(()=>{
                  let elem = document.getElementById('openAppDialog');
                  //console.log("App dialog hash....", elem);
                  if(elem){
                    elem.click();
                  }
                }, 100)
              }
            }else{
              this.toastr.warning(res['msg'], '');
            }
            this.loader = true;
          });
      }
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  openView(content, type:string) {
    
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //////console.log("Closed: ", this.closeResult);
      //this.courseViewData['courseDuration'] = '';
      //this.courseViewData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeChecklistDialog(){
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //////console.log("Closed with ESC ");
      
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //////console.log("Closed with CLOSE ICON ");
     
      return 'by clicking on a backdrop';
    } else {
      //////console.log("Closed ",`with: ${reason}`);
      
      return  `with: ${reason}`;
    }
  }

  savedraftStep(stepCount) {
    if(stepCount == 'step1') {
      this.assessorsProfile = {};
      this.assessorsProfile.step1 = {};
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;
      this.step1Data.first_name = this.step1Data.title+' '+this.step1Data.first_name;
      this.assessorsProfile.step1 = this.step1Data;
      this.assessorsProfile.isDraft = 1;
      this.loader = false;
      this.step1DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step1DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }else if(stepCount == 'step2') {
        this.assessorsProfile = {};
        this.assessorsProfile.step2 = {};
        this.assessorsProfile.step2 = this.step2Data;
        this.assessorsProfile.email = this.userEmail;
        this.assessorsProfile.userType = this.userType;
        this.assessorsProfile.isDraft = 1;
        this.assessorsProfile.step2['whichLanguage'] = [];
        this.assessorsProfile.step2['whichForum'] = [];
        // this.step2Data.arabic = this.arabic;
        // this.step2Data.english = this.english;
        // this.step2Data.others = this.others;
        if(this.whichLanguage){
          this.assessorsProfile.step2['whichLanguage'] = this.whichLanguage;
        }
        if(this.whichForum){
          this.assessorsProfile.step2['whichForum'] = this.whichForum;
        }
      this.loader = false;
      this.step2DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step2DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }else if(stepCount == 'step3') {
      this.assessorsProfile = {};
      this.assessorsProfile.step3 = {};
      this.assessorsProfile.step3 = this.step3Data;
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;
      this.assessorsProfile.isDraft = 1;

      this.assessorsProfile.step3['list_auditorArr'] = [];
      this.assessorsProfile.step3['attend_accreditationArr'] = [];
      this.assessorsProfile.step3['attend_accreditation2Arr'] = [];
      this.assessorsProfile.step3['practical_assessment_experienceArr'] = [];
      
      if(this.list_auditor){
        this.assessorsProfile.step3['list_auditorArr'] = this.list_auditor;
      }
      if(this.attend_accreditation){
        this.assessorsProfile.step3['attend_accreditationArr'] = this.attend_accreditation;
      }
      if(this.attend_accreditation2){
        this.assessorsProfile.step3['attend_accreditation2Arr'] = this.attend_accreditation2;
      }
      if(this.practical_assessment_experience){
        this.assessorsProfile.step3['practical_assessment_experienceArr'] = this.practical_assessment_experience;
      }
      this.loader = false;
      this.step3DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step3DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }else if(stepCount == 'step4') {
      this.assessorsProfile = {};
      this.assessorsProfile.step4 = {};
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;
      this.assessorsProfile.isDraft = 1;
      this.loader = false;
      this.assessorsProfile.step4['technical_experience'] = [];
      var blankArr = {};
      this.technicalFields.forEach((res,key) => {
        for(let key2 in res['technical_fields']){
          if(res['technical_fields'][key2].knowledge_experienced && res['technical_fields'][key2].knowledge_experienced != ''){
            var key1 = res['technical_fields'][key2].field_mgmt;
            var value = res['technical_fields'][key2]['knowledge_experienced'];
            
            blankArr[key1] = value;
            
          }
          this.assessorsProfile.step4['technical_experience'] = blankArr;
          
        }
      });
      this.step4DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step4DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }else if(stepCount == 'step5') {
      this.assessorsProfile = {};
      this.assessorsProfile.step5 = this.step5Data;
      this.loader = false;
      this.assessorsProfile.email = this.userEmail;
      this.assessorsProfile.userType = this.userType;
      this.assessorsProfile.isDraft = 1;
      this.step5DataBodyFormFile.append('data',JSON.stringify(this.assessorsProfile));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.step5DataBodyFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    } 
  }
}
