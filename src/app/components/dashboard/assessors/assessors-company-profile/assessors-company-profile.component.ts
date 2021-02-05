import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-asessors-company-profile',
  templateUrl: './assessors-company-profile.component.html',
  styleUrls: ['./assessors-company-profile.component.scss']
})
export class AssessorsCompanyProfileComponent implements OnInit {

  userType:any;
  userEmail:any;
  routeId:any;
  cabUserDetails:any;
  serviceDetail: any;
  cabStep1:any;
  cabStep2:any;
  tabId:any = 'personal_details'; 
  approveRejectStatus:any = '';
  loader:boolean = true;
  tradeLicenseFile:any;
  tradeLicenseText:any;
  rejectedMessageId:boolean = false;
  progressValue:number = 0;

  assessorEduDetails: any = {};
  assessorsEmployment: any = {};
  isdDynamicsopenClose:any;
  assessorsKnowledge: any = [];


  subField: any = {}; 
  subInput: any = {};
  subInput1: any = {};

  subTechnicalFields: any[] =[];


  constructor(public Service: AppService, public constant:Constants,public router: Router,public route: ActivatedRoute,public toastr: ToastrService,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.userType = localStorage.getItem('type');
    this.userEmail = localStorage.getItem('email'); 
    // this.routeId = this.route.snapshot.queryParamMap.get('id');
    // console.log(localStorage.getItem('routeId'));
    this.routeId  = localStorage.getItem('routeId');
    this.userType = localStorage.getItem('type');

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


    // if(this.userType != 'operations')
    // {
    //   var landUrl = '/dashboard'+this.userType+'/home'
    //   this.router.navigateByUrl(landUrl);
    // }
    //alert(">>>>>"); 
    this.loadData()
  }

  loop(i: number) {
    return new Array(i);
  }

  dynamicsopenClose(id,status)
  {
    if(status == 'open')
    {
      this.isdDynamicsopenClose = id;
    }else if(status == 'close'){
      this.isdDynamicsopenClose = '0';
    }
    console.log(this.isdDynamicsopenClose);
    console.log(status);
  }

  getFile(file: string){
    let fname: string = file.split('/')[4].split('.')[0];
    console.log(fname);
    return fname;
  }

  loadData() {
    this.loader = false;
    let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    console.log(">>> Profile: ", url);
    //this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?id='+this.routeId)
    this.Service.getwithoutData(url)
    .subscribe(
      res => {
          console.log("Dta: ", res);
        let getData: any = res['data'];
        this.loader = true;
        this.serviceDetail = res['data'];
        this.cabUserDetails = res['data']['user_data'][0];
        this.approveRejectStatus = res['data']['user_data'][0].approved;
        this.cabStep1 = res['data']['step1'][0];
        this.cabStep2 = res['data']['step2'];

        console.log("cabUserDetails", this.cabUserDetails);

        //Calculate progression
        /*if(res['data'].step1 !='' && res['data'].step1[0] && res['data'].step1[0].dob != null && res['data'].step1[0].official_email !='' && res['data'].step1[0].office_tel_no !='' && res['data'].step1[0].designation !='' && res['data'].step1[0].nationality != null && res['data'].step1[0].mailing_address !='' && res['data'].step1[0].office !='' && res['data'].step1[0].tel_no !='' && res['data'].step1[0].office_address !='') {
          this.progressValue = 50; 
        }if(res['data'].step2 !='' && res['data'].step2 && res['data'].step1[0].trade_license_number !='' && res['data'].step1[0].applicant_location !='' && res['data'].step1[0].applicant_address !='' && res['data'].step1[0].applicant_tel_no !='' && res['data'].step1[0].applicant_email !='' && res['data'].step1[0].applicant_website !='' && res['data'].step1[0].date_of_issue != null && res['data'].step1[0].date_of_expiry != null && res['data'].step1[0].cab_name !='' && res['data'].step1[0].po_box !='' && res['data'].step1[0].country !='' && res['data'].step1[0].state !='' && res['data'].step1[0].city !='' && res['data'].step2.cabOwnerData != '' && res['data'].step2.cabBodData != '') {
          this.progressValue = 100;
        }*/

        ///Profile progress

        if(res['data'].step1 != '' && res['data'].step1[0] && res['data']['user_data'][0].first_name != "" && res['data'].step1[0].office_email != "" && res['data'].step1[0].dob != null && res['data'].step1[0].mailing_address != "" && res['data'].step1[0].office != "" && res['data'].step1[0].designation != "" && res['data'].step1[0].office_address != "" && res['data'].step1[0].office_tel_no != "" && res['data'].step1[0].nationality != null) {
          this.progressValue = 22;
        }
        if(res['data'].step2 != '' && res['data'].step2['education'] && res['data'].step2['education'][0].qualification_file != null && res['data'].step2['education'][0].detail && res['data'].step2['education'][0].organization && res['data'].step2['education'][0].specialization && res['data'].step2['language'].length > 0 && res['data'].step2['which_forum'].length > 0) {
          this.progressValue = 44;
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
          }
          
        }
        if(res['data'].step4 && res['data'].step4 != '' && res['data'].step4['technical_experience'] && res['data'].step4['technical_experience'] != '') {
          this.progressValue = 88;
        }

        if(res['data'].step5 && res['data'].step5 != '' && res['data'].step5[0].place && res['data'].step5[0].place != null && res['data'].step5[0].registration_date != null && res['data'].step5[0].signature != null) {
          this.progressValue = 100;
        }

        //profile progress



        //Education information
        if(getData.step2 != undefined){
          if(getData.step2.education != undefined && getData.step2.education.length > 0){
            this.assessorEduDetails['education'] = {};
            this.assessorEduDetails['education'] = getData.step2.education[0];
          }
          if(getData.step2.further_education != undefined && getData.step2.further_education.length > 0){
            this.assessorEduDetails['further_education'] = {};
            this.assessorEduDetails['further_education'] = getData.step2.further_education[0];
          }
          if(getData.step2.which_forum != undefined && getData.step2.which_forum.length > 0){
            this.assessorEduDetails['which_forum'] = [];
            this.assessorEduDetails['which_forum'] = getData.step2.which_forum;
          }
          if(getData.step2.language != undefined && getData.step2.language.length > 0){
            this.assessorEduDetails['language'] = [];
            this.assessorEduDetails['language'] = getData.step2.language;
          }
          if(getData.step2.others_education != undefined && getData.step2.others_education.length > 0){
            this.assessorEduDetails['others_education'] = {};
            this.assessorEduDetails['others_education'] = getData.step2.others_education[0];
          }
        }
        if(getData.step3 != undefined){
          if(getData.step3.experience_1 != undefined && getData.step3.experience_1.length > 0){
            this.assessorsEmployment['experience_1'] = [];
            this.assessorsEmployment['experience_1'] = getData.step3.experience_1;
          }
          if(getData.step3.experience_2 != undefined && getData.step3.experience_2.length > 0){
            this.assessorsEmployment['experience_2'] = [];
            this.assessorsEmployment['experience_2'] = getData.step3.experience_2;
          }
          if(getData.step3.experience_3 != undefined && getData.step3.experience_3.length > 0){
            this.assessorsEmployment['experience_3'] = [];
            this.assessorsEmployment['experience_3'] = getData.step3.experience_3;
          }
          if(getData.step3.experience_4 != undefined && getData.step3.experience_4.length > 0){
            this.assessorsEmployment['experience_4'] = [];
            this.assessorsEmployment['experience_4'] = getData.step3.experience_4;
          }
        }

        if(getData.technical_field != undefined && getData.technical_field.length > 0){
          this.assessorsKnowledge = getData.technical_field.filter(item => item.technical_fields.length > 0);
          this.assessorsKnowledge.forEach((item, key) => {
                if(item.title == 'Management Certification Bodies'){
                  this.assessorsKnowledge[key]['title'] = 'Certification Bodies';
                }
          })
        }
        if(getData.step4 != undefined){
            let step4Data: any = getData.step4;
            for(let key in step4Data['technical_experience']) {
              getData.technical_field.forEach(rec => {
                for(let nxtkey in rec['technical_fields']) {
                  if(key == rec['technical_fields'][nxtkey].field_mgmt) {
                    rec['technical_fields'][nxtkey].knowledge_experienced = step4Data['technical_experience'][key];
                  }
                }
              });
            }

            //Custom experience
            if(step4Data['technical_experience_custom'] != undefined && step4Data['technical_experience_custom'] != '') {
              let filterData: any;
              let customData: any[] = step4Data['technical_experience_custom'];
              
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
              console.log("@GET PTP Daata: ", Ptpdata, " :: ", this.subField, " --- ");

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

              console.log("@@@Defore ", this.assessorsKnowledge);
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
            console.log(">>>Technical...", this.assessorsKnowledge);
        }



        // this.tradeLicenseFile = this.constant.mediaPath+this.cabStep1.trade_license
        // var tradeLicenseField = this.cabStep1.trade_license != null ? this.cabStep1.trade_license.split('/') : '';
        // this.tradeLicenseText = tradeLicenseField[4];
    });
  }

  tabClick(id) {
    this.tabId = id;
    if(this.tabId == 'application_info') {
      var element = document.querySelector('#'+this.tabId);
      element.classList.remove("tab-active");
      

      var element2 = document.querySelector('#personal_details');
      element2.classList.add("tab-active");
    }else if(this.tabId == 'personal_details') {
      var element = document.querySelector('#'+this.tabId);
      element.classList.remove("tab-active");

      var element2 = document.querySelector('#application_info');
      element2.classList.add("tab-active");
    }
  }

  approveOrReject(status) {
    if(status == 'approve') {
      this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileApproval+'?id='+this.routeId+'&status=1')
      .subscribe(
        res => {
          this.approveRejectStatus = '1';
      });
      
    }
  }

  openRejectedPop() {
    this.rejectedMessageId = true;
  }

  getAllData(event) {
    // console.log(event);
    if(event.rejectId == 2) {
      this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileApproval+'?id='+this.routeId+'&status=2'+'&message='+event.message)
      .subscribe(
        res => {
          this.toastr.success('Message sent successfully', '');
          this.approveRejectStatus = '2';
      });
      
    }
  }

}
