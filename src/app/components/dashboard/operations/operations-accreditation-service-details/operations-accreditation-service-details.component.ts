import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';
import  { UiDialogService } from  'src/app/services/uiDialog.service';

@Component({
  selector: 'app-operations-accreditation-service-details',
  templateUrl: './operations-accreditation-service-details.component.html', 
  styleUrls: ['./operations-accreditation-service-details.component.scss'],
  providers: [CustomModalComponent, ToastrService, Overlay, OverlayContainer]
})
export class OperationsAccreditationServiceDetailsComponent implements OnInit, OnDestroy {

  loader:boolean = false; 
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  public errorLoader: boolean = false;
  subscriptions: Subscription[] = [];
  routeId:any;
  serviceDetail:any;
  ownershipOfOrg:any;
  ownOrgMembInfo:any;
  otherAccr:any;
  other_accr_model:any;
  Object = Object;
  ptParticipation:any[] = [];
  technicalManager:any;
  managementManager:any;
  qualityManager:any;
  islamicAffairExpert:any;
  paymentDetails:any;
  applicantInfo:any;
  scopeDetailsHeading:any;
  scopeDetailvalues:any;

  accredAgreemFile: string  = '';
  checklistDocFile: string  = '';
  ILAAgreement: string      = '';
  modalOptions:NgbModalOptions;
  closeResult: string;
  pathPDF: any;
  recommVisit: string;

  userEmail:string='';
  userType:any;
  applicantDetails: any;
  countryList: any;
  appCountry: string = '';
  voucherSentData: any = {};
  selectCourseData: any = [];
  courseViewData: any = {};
  selectDeleteID: number = 0;
  voucherFile:any = new FormData();
  paymentReceiptValidation: boolean = true;
  criteriaMaster:any[] = [];
  public inspectionBodyScopeFields:Array<any>=[];
  public labTypeList:Array<any>=[];
  public fullScope:any[]=[];
  criteriaList: any = [];
  step1Data:any = {};
  editScopeData:any;
  subTypeMaster:any[] = [];
  ilauUdertakingConfirm:any;
  recommendVisit:any;
  authorizationList:any;
  ilaMraCheck:boolean = false;
  cbsOtherActivity: any[] = [{}];
  otherStandards: any[] = [{}];
  nameOfCountry: any[] = [{}];
  hcabOtherLocation:any[] = [];
  accreditationInfo:any[] = [];
  hcabOthers:any = {};
  doesHcab:any = {};
  aboutSubContractors:any[] = [];

  cbOtherStandards: any[] = [];
  cbnameOfCountry: any[] = [{}];
  termsGeneral: any;
  getFamilyName: boolean = false;
  findFamily: any;
  loadTCScheme: boolean = false;
  TCSchmeData: any;
  getFamilyTitles: any = {};
  getSchemeTitles: any = {};
  summaryDetails:any[] = [{}];
  newSummaryDetails:any[] = [];

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, public sanitizer: DomSanitizer,private modalService: NgbModal,public uiDialog: UiDialogService) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('routeId');

    this.userType = sessionStorage.getItem('type');
    this.step1Data['cab_type'] = '';
    this.accredAgreemFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Accreditation%20Agreement.pdf');
    this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/publication/files/Document%20review%20Checklist-%20ISO%2017020-%202012_Inspection%20Bodies.pdf');
    this.ILAAgreement     = ('https://uat-service.eiac.gov.ae/media/publication/files/EIAC%20ILAC%20MRA%20Mark%20Agreement%20with%20CAB.pdf');;
    this.loadAppInfo();
    this.loadData();
    
  }
  onError(error: any) {
    // do anything
    ////console.log('PDF Error: ', error)
    this.errorLoader = true;
  }

  completeLoadPDF(pdfLoad: PDFDocumentProxy){
    ////console.log("Completed Load PDF :: ", pdfLoad);
    this.loaderPdf = false;
    this.completeLoaded = true;
  }

  onProgress(progressData: PDFProgressData){
   ////console.log("Loding Pdf :: ", progressData);
    this.loaderPdf = true;
  }
  getSantizeUrl(url : string) { 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
  }

  closeDialog(){
    this.modalService.dismissAll();
  }
  openView(content, type:string) {
      let pathData: any;
      //console.log(">>>pop up...", content);
      if(type != undefined && type == 'agreement'){
        pathData = this.getSantizeUrl(this.accredAgreemFile);
        this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
      }
      if(type != undefined && type == 'checklist'){
        pathData = this.getSantizeUrl(this.checklistDocFile);
        this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
      }
      if(type != undefined && type == 'ILA'){
        pathData = this.getSantizeUrl(this.ILAAgreement);
        this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
      }
  
      //console.log(">>> open view", this.pathPDF, " -- ",  this.pathPDF);
  
      this.modalService.open(content, this.modalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        ////console.log("Closed: ", this.closeResult);
        //this.courseViewData['courseDuration'] = '';
        //this.courseViewData['courseFees'] = '';
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  downloadApplication(file:any) {
    var fullPAth = this._constant.mediaPath+file;
    let pathData: any;

    pathData = this.getSantizeUrl(fullPAth);
    this.pathPDF = pathData.changingThisBreaksApplicationSecurity;
  }
  
  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        ////console.log("Closed with ESC ");
        
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        ////console.log("Closed with CLOSE ICON ");
        
        return 'by clicking on a backdrop';
      } else {
        ////console.log("Closed ",`with: ${reason}`);
        
        return  `with: ${reason}`;
      }
  }

  jsonParse(data) {
    // console.log(data);
    // console.log(JSON.parse(data.toString()));
    // return JSON.parse(data.toString());
    // var obj = "{'include':true,'fn':'1-12'}"; //Assuming double quotes outside
    if(data) {
      var obj1 = data.replace(/'/g, "\""); //Replace single quotes with double quotes
      // console.log(typeof obj1); // string

      // var myjsonobj = JSON.parse(obj1); //convert to JSON
      return Array(JSON.parse(obj1));
    }
  }

  jsonParseKeyvalue(data) {
    if(data) {
      var obj1 = data.replace(/'/g, "\"");
      return JSON.parse(obj1);
    }
  }

  jsonParsevalue(data) {
    if(data) {
      return JSON.parse(data);
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
 }

 loadAppInfo(){
  //let url = this.Service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    //this.userEmail = sessionStorage.getItem('email');
    //this.userType = sessionStorage.getItem('type');
    
    // let url = this._service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    // this._service.getwithoutData(url)
    // .subscribe(
    //   res => { 
    //     console.log(res, "applicant Info: ");
    //     //this.applicantInfo = res['data']['step1'][0];
    //   })
    this._service.getCountry().subscribe(rec => {
        this.countryList = rec;
        // console.log(">>>cccc ", this.countryList);
    })

    this.loadTermsConditions(2);
 }

//  removePlusItem(data) {
//    return this._service.removePlus(data);
//  }

 loadTermsConditions(pageId: number){
  let post: any = {};
  post['service_page_id'] = pageId; 
  this._service.post(this._service.apiServerUrl+"/" + 'terms-and-conditions/', post)
    .subscribe(
      res => {
        console.log(res,'Terms data');
        let getData: any = res;
        if(getData){
          this.termsGeneral = getData.data[0].content;
          //this.termsIAF     = getData.data[1];

        }        
      });
}

loadSchmePTP(){
  this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.pt_provider)
      .subscribe( 
        res => {
          console.log("@Load Accreditation criteria PTP....", res);         
          this.criteriaMaster = res['data']['schemes'];  
        },
        error => {
        
    })

}

 getSchme(sid: number){
  let getSchemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
  console.log("data: ", getSchemeData, " -- ", this.criteriaMaster);
  if(getSchemeData){
    return getSchemeData.title; 
  }
}
getSchmeHalal(sid: number, typeId: number){
  let typeData: any;
  let getSchemeData: any;
  if(typeId){
     typeData = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
  }
  if(typeData && typeData.scheme_list != undefined){
    getSchemeData = typeData.scheme_list.find(item => item.scope_accridiation.id == sid);
  }
  if(getSchemeData){
    return 'Accreditation Scope for ' + getSchemeData.title;
  }
}

getSchmeTC(sid: number){

  if(!this.loadTCScheme){
    this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.testingCalibration)
        .subscribe(
          async res => {
            console.log("@Load scheme....", res);
            //////console.log(">>sele schme Type: ", this.step1Data.cab_type);
            this.getSchemeTitles[sid] = [];
            let schemeData: any = res['data']['schemes']
            let schemeMaster: any;
            if(typeof schemeData === 'object'){
                schemeMaster = schemeData;
                console.log(">>>schemee ", schemeMaster, " -- ", this.step1Data.cab_type, " -- ", this.step1Data.cab_type);
                //this.criteriaMaster = schemeMaster;
                if(this.step1Data.cab_type != undefined && this.step1Data.cab_type === 'testing_laboratory'){
                  this.criteriaMaster = schemeData['testing_laboratory'];
                }
                if(this.step1Data.cab_type != undefined && this.step1Data.cab_type === 'calibration_laboratories'){
                  console.log(">>> found calibration....");
                  this.criteriaMaster = schemeData['calibration_laboratory'];
                }

                //create type family data storage
                if(this.criteriaMaster.length){
                  let getSchemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
                console.log("data: ", getSchemeData, " -- ");
                this.getSchemeTitles[sid].push({title: getSchemeData.title});
                if(getSchemeData){
                  console.log('reteteete.')
                  this.loadTCScheme = true;
                  this.TCSchmeData = getSchemeData;
                  //return '<strong>Accreditation Scope for ' + getSchemeData.title+'</strong>';
                }
                }
                
                
            }
            console.log(">>>schcriteria master ", this.criteriaMaster, " -- ", this.getSchemeTitles);
          },
          error => {      
      })
  }
        


  // let getSchemeData: any = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
  // console.log("data: ", getSchemeData, " -- ");
  // if(getSchemeData){
  //   return '<strong>Accreditation Scope for ' + getSchemeData.title+'</strong>';
  // }
}
getFamilySchmeTC = (sid: number, fid: number) =>{
  //console.log(">>> Family Data: ", sid," :: ", fid, " -- ", familyData)
  if(fid > 0){
    //let getFamilydata: any;
    //let getTypeData = this.fullTypeFamily.find(item => item.id == sid);
    if(!this.getFamilyName){
      let apiURL = this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.testing_cal_form_basic_data+"?scheme="+sid;
        this._service.getwithoutData(apiURL).subscribe(
          async record => {
          console.log('Fullscope: ', record, " -- ");
          let data: any = record;
          if(data && data.data.scopeFamily != undefined && data.data.scopeFamily.length > 0){
            this.findFamily = data.data.scopeFamily.find(item => item.scope_family == fid);
            //console.log(">>> family: 1 ", this.findFamily);
            if(this.findFamily){
              console.log(">>> family namem: ", this.findFamily);
              this.getFamilyName = true;
              return;
              //return 'Accreditation Family Scope for ' + findFamily.title;
            }
          }
        });
    }
  }else{
    ////console.log("NO family...");
    return '';
  }
}
loadSchemeMasterTC = async(cabType: any) => {
//   this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.testingCalibration)
//   .subscribe(
//     async res => {
//       console.log("@Load scheme....", res);
//       //////console.log(">>sele schme Type: ", this.step1Data.cab_type);

//       let schemeData: any = res['data']['schemes']
//       let schemeMaster: any;
//       if(typeof schemeData === 'object'){
//         schemeMaster = schemeData;
//           console.log(">>>schemee ", schemeMaster, " -- ", this.step1Data.cab_type, " -- ", cabType);
//           //this.criteriaMaster = schemeMaster;
//           if(this.step1Data.cab_type != undefined && this.step1Data.cab_type === 'testing_laboratory'){
//             this.criteriaMaster = schemeData['testing_laboratory'];
//           }
//           if(this.step1Data.cab_type != undefined && this.step1Data.cab_type === 'calibration_laboratories'){
//             console.log(">>> found calibration....");
//             this.criteriaMaster = schemeData['calibration_laboratory'];
//           }

//           //create type family data storage
          
//       }
//       console.log(">>>schcriteria master ", this.criteriaMaster);
//     },
//     error => {      
// })
}

getSchmeCb(sid: number, typeId: number){
  let typeData: any;
  let getSchemeData: any;
  if(typeId){
     typeData = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
  }
  ////console.log(">>> Type data: ", typeData, " -- ", this.subTypeMaster);
  if(typeData && typeData.scheme_list != undefined){
    getSchemeData = typeData.scheme_list.find(item => item.scope_accridiation.id == sid);
  }
  //getSchemeData = this.criteriaMaster.find(item => item.scope_accridiation.id == sid);
  ////console.log("data: schem get ", getSchemeData);
  //return;
  if(getSchemeData){
    return 'Accreditation Scope for ' + getSchemeData.title;
  }
}

getSubType(typeId: number){
  if(typeId){
    let typeData: any = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
    if(typeData){
      return 'Accreditation SubType For: ' + typeData.title;
    }
  }
}

getSubTypeHalal = (typeId: number) =>{
  if(typeId){
    let typeData: any = this.subTypeMaster.find(rec => rec.service_page.id == typeId);
    console.log(">>>> ", typeData);
    if(typeData){
      console.log(">>>>... ", typeData.title);
      return 'Accreditation SubType For: ' + typeData.title;
    }
  }
}

loadScopeDataHalal(){
  this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.halalConfirmity)
   .subscribe( 
     res => {
       let record: any = res['data'];
       console.log("@Load subtype Master....", record);
       if(record){
         this.subTypeMaster = record.serviceList;
         console.log("@Load Type....", this.subTypeMaster);
       }

     },
     error => {
     
 })
}

  loadData() {
    this.loader = false;
    this.subscriptions.push(this._trainerService.trainerAccredDetailsServtrainerAccredDetailsServ(this.routeId)
      .subscribe(
        result => {
          console.log(result, "@Get Data");
          //return;
          this.loader = true;
          let getData: any = result;
          this.serviceDetail = result['data'];
          // var ilaCheckbox = this.serviceDetail.authorization_list;
          // var parseIlaCheckbox = JSON.parse(ilaCheckbox);
          // this.ilauUdertakingConfirm = parseIlaCheckbox.undertaking_confirmTop3;
          // let getC: any = this.countryList.countries.find(item => item.id == this.serviceDetail.country)
          // console.log("cc>> ", getC);
          // if(getC){
          //   this.appCountry = getC.name;
          // }
          //
          // console.log(this.serviceDetail.is_main_activity,'is_main_activity');
          
          this.step1Data.cab_type = getData.data.cab_type;
          //alert(this.step1Data.cab_type + " -- "+ getData.data.cab_type);
          if(getData.data.form_meta == 'halal_conformity_bodies'){
            console.log(">>> Load halal types......");
            this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/checklists/Document%20Review%20Checklist%20Halal%20Certification%20UAE.S%202055-2.pdf');
            this.loadScopeDataHalal();
          }
          if(getData.data.form_meta == 'pt_providers'){
            this.checklistDocFile = ('https://uat-service.eiac.gov.ae/media/checklists/Document%20review%20checklist%20for%20ISO%2022870-%20Point%20of%20Care%20Testing.pdf');
          }
          if(this.serviceDetail.onBehalfApplicantDetails ){
            this.applicantDetails = this.serviceDetail.onBehalfApplicantDetails;
          }
          this.ownershipOfOrg = result['data']['ownershipOfOrg']
          this.ownOrgMembInfo = result['data']['bodMember'];
          this.otherAccr = result['data']['otherAccr'];
          this.other_accr_model = result['data']['otherAccr'] != '' && result['data']['otherAccr'] != null ? '1' : '0' ;
          this.ptParticipation = result['data']['ptParticipation'];
          this.technicalManager = result['data']['technicalManager'] ? result['data']['technicalManager'][0] : '';
          this.managementManager = result['data']['managementManager'] ? result['data']['managementManager'][0] : '';
          this.qualityManager = result['data']['qualityManager'] ? result['data']['qualityManager'][0] : '';
          this.islamicAffairExpert = result['data']['islamicAffairExpert'] ? result['data']['islamicAffairExpert'][0] : '';
          this.paymentDetails = result['data'].paymentDetails;
          this.editScopeData = result['data']['scopeDetails'];
          this.aboutSubContractors = result['data']['aboutSubContractors'];

          if(result['data'].summaryOfPersonnel != undefined && result['data'].summaryOfPersonnel.length > 0){
            // console.log(result['data'].summaryOfPersonnel);
            this.summaryDetails = result['data'].summaryOfPersonnel;
            console.log(this.summaryDetails,'summaryOfPersonnel');

            

            this.summaryDetails.forEach((item,key) => {
              var newArr = {};
            
              if(this.summaryDetails[key].total_no != "") {
                newArr['position'] = this.summaryDetails[key].position;
                newArr['total_no'] = this.summaryDetails[key].total_no;
                if(this.summaryDetails[key].fulltime_emp_name != undefined && typeof this.summaryDetails[key].fulltime_emp_name == 'string'){
                  let fulltimeAr = JSON.parse(this.summaryDetails[key].fulltime_emp_name);
                  // console.log(fulltimeAr, " -- ", fulltimeAr.length);
                  newArr['fulltime_emp_name'] = fulltimeAr;
                }
                if(this.summaryDetails[key].parttime_emp_name != undefined && typeof this.summaryDetails[key].parttime_emp_name == 'string'){
                  let parttimeAr = JSON.parse(this.summaryDetails[key].parttime_emp_name);
                  // console.log(parttimeAr, " -- ", parttimeAr.length);
                  newArr['parttime_emp_name'] = parttimeAr;
                }
                this.newSummaryDetails.push(newArr);
              }
              // console.log(this.summaryDetails,'summaryDetails');

            });
            // console.log(">>>Updated dafa: ", this.newSummaryDetails);
          }

          if(result['data'].otherActivityLocations) {
            let getActivity: any =  result['data'].otherActivityLocations;
            // console.log(">>> other activity: ", getActivity);
            if(getActivity != null){
              let tempAct: any =[];
            for(var k in getActivity){
              // console.log(">>>> ", getActivity[k]['value'], " -- ", typeof getActivity[k]['value']);
              let tempObj: any = (getActivity[k]['value']);
              tempAct.push(tempObj);
              // console.log(">>> ", k , " :: ", tempAct);
            }
            this.cbsOtherActivity = tempAct;
            }
          }


          if(result['data'].scopeDetails != undefined && !this._service.isObjectEmpty(result['data'].scopeDetails)){
                
            let jsonObject = result['data'].scopeDetails;//JSON.parse(jsonStrting);
            this.editScopeData = jsonObject; 
            let otherCopy: any=[];
            //console.log(">>>Edit scope: ", this.editScopeData);
            if(this.editScopeData.others != undefined && typeof this.editScopeData.others == 'object'){
                  let colheader: any = ['category', 'standard', 'scopeScheme'];
                  let otherData: any = this.editScopeData['others']['others']['scope_value'];
                  otherData.forEach((rec, key) => {
                    //console.log(">>> other values: ", rec, " -- ", key);
                    let tmpObj: any ={};
                        for(var p in rec){
                          //console.log(">>>col.. ", colheader[p], " == ",  rec[p]);
                          tmpObj[colheader[p].toString()] = rec[p];

                        }
                        otherCopy.push(tmpObj);
                  })
            }
            if(this.editScopeData.null != undefined && typeof this.editScopeData.null == 'object'){
              //console.log(">>> null key found and deleting...");
              delete this.editScopeData['null'];
            }
            if(otherCopy.length > 0){
              this.otherStandards = otherCopy;
              delete this.editScopeData['others'];
            }

            if(result['data'].form_meta == 'pt_providers'){
              console.log("@PTP scheme loading....");
              this.loadSchmePTP();
            }

            if(result['data'].form_meta == 'testing_calibration'){
              console.log("@TCL found.....");
              for(let key in this.editScopeData){
                console.log(">>> scheme: ", key);
                //get scheme data;:

                this.getSchmeTC(parseInt(key));

                if(typeof this.editScopeData[key] === 'object'){
                  for(let key1 in this.editScopeData[key]){
                    console.log(">>> family: ", key1);
                    let fid: number = parseInt(key1);
                    this.getFamilyTitles[key] = {};
                    this.getFamilyTitles[key][key1] = [];
                    if(fid > 0){
                      let apiURL = this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.testing_cal_form_basic_data+"?scheme="+key;
                      this._service.getwithoutData(apiURL).subscribe(
                        async record => {
                        ////console.log('Fullscope: ', record, " -- ");
                        let data: any = record;
                        if(data && data.data.scopeFamily != undefined && data.data.scopeFamily.length > 0){
                          let getFamilydata = data.data.scopeFamily.find(item => item.scope_family == key1);
                          //console.log(">>> family: 1 ", this.findFamily);
                          if(getFamilydata){
                            console.log(">>> family namem: ", getFamilydata.title);
                            this.getFamilyTitles[key][key1].push({title: getFamilydata.title});
                          }
                        }
                      });
                    }                         

                  }
                }
            }
            console.log(">>> Family Name data: ", this.getFamilyTitles);

            }

            if(result['data'].form_meta == 'testing_calibration'){

            }

            
            //
            //console.log(">>> scope entry: ", this.editScopeData, " == ", otherCopy);
          }

          if(result['data'].otherActivityLocations != null){
            this.step1Data.hcab_other_location = '1';
            var hcab_location = result['data'].otherActivityLocations
            var newLoaction = [];
            for(let key in hcab_location) {
              if(hcab_location[key].value.location_type) {
                newLoaction.push(hcab_location[key].value);
              }
            }

            this.hcabOtherLocation = newLoaction;
            this.hcabOthers = 1;

            // console.log(this.hcabOtherLocation);
          }
          else{
            this.hcabOthers = 0;
          }
          
          if(result['data'].hcabOtherAccreditation != ''){
            this.accreditationInfo = result['data'].hcabOtherAccreditation;
            this.doesHcab = 1;
          }else{
            this.doesHcab = 1;
          }

          // console.log(this.otherStandards,'cbsOtherActivity');
          let getNameCountry: any = result['data'].nameOfCountry;
            if(getNameCountry != null){
            let tempNameCountry: any =[];
            for(var k in getNameCountry){
              let tempObj: any = (getNameCountry[k]['value']);
              tempNameCountry.push(tempObj);
              console.log(">>> ", k , " :: ", tempNameCountry);
            }
            this.nameOfCountry = tempNameCountry;
            }
          if(getData.data.form_meta == 'certification_bodies'){
            this.loadTermsConditions(4)
          }
          if(getData.data.form_meta == 'inspection_body'){
            this.loadTermsConditions(2)
            this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.inspection_form_basic_data)
              .subscribe( 
                res => {
                  
                  ////console.log("@Load scope....", res);
                  this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
                  //this.countryList = res['allCountry'];
                  this.labTypeList = res['allLabtype'];
                  //this.fullScope   = res['fullScope'];
                  this.criteriaList = res['data']['criteriaList'];
                  this.step1Data.criteria_request = this.criteriaList[0].code;
                  this.criteriaMaster = res['data']['schemes'];
                  ////////console.log("#Get criteria: ", this.criteriaMaster);

                },
                error => {
                
            })
          }
          if(getData.data.form_meta == 'health_care'){
            this.loadTermsConditions(1)
          }

          if(getData.data.form_meta == 'certification_bodies'){
            let otherCopy: any=[];
            if(this.editScopeData.others != undefined && typeof this.editScopeData.others == 'object'){
              let colheader: any = ['category', 'standard', 'scopeScheme'];
              let otherData: any = this.editScopeData['others']['others']['scope_value'];
              otherData.forEach((rec, key) => {
                //console.log(">>> other values: ", rec, " -- ", key);
                let tmpObj: any ={};
                    for(var p in rec){
                      //console.log(">>>col.. ", colheader[p], " == ",  rec[p]);
                      tmpObj[colheader[p].toString()] = rec[p];

                    }
                    otherCopy.push(tmpObj);
              })
            }
            if(otherCopy.length > 0){
              this.cbOtherStandards = otherCopy;
              delete this.editScopeData['others'];
            }
            let getActivity: any = getData.data.otherActivityLocations;
              console.log(">>> other activity: ", getActivity);
              if(getActivity != null){
                let tempAct: any =[];
              for(var k in getActivity){
                console.log(">>>> ", getActivity[k]['value'], " -- ", typeof getActivity[k]['value']);
                let tempObj: any = (getActivity[k]['value']);
                tempAct.push(tempObj);
                console.log(">>> ", k , " :: ", tempAct);
              }
              this.cbsOtherActivity = tempAct;
              }
              

              let getNameCountry: any = getData.data.nameOfCountry;
              console.log(">>> other name country: ", getNameCountry);
              if(getNameCountry != null){
              let tempNameCountry: any =[];
              for(var k in getNameCountry){
                let tempObj: any = (getNameCountry[k]['value']);
                tempNameCountry.push(tempObj);
                console.log(">>> ", k , " :: ", tempNameCountry);
              }
              this.cbnameOfCountry = tempNameCountry;
              }

              console.log("update scope: ", this.editScopeData);

          }

          this.recommendVisit = JSON.parse(result['data'].recommend_visit);
          console.log(this.recommendVisit);
          this.authorizationList = JSON.parse(result['data'].authorization_list);
          // let checkCount = 0;
          for(let key in this.authorizationList) {
            ////console.log("authorize checklist: ", key, " --", this.authorizationList[key]);
            if(this.authorizationList['undertaking_confirmTop3'] == true) {  
              this.ilaMraCheck = true;       
              // checkCount++;
            } 
          }

          // this.scopeDetailsHeading = result['data']['scopeDetails'].heading.column_list;
          // for(let key in result['data']['scopeDetails']) {
          //   // console.log(key,'key');
          //   this.scopeDetailsHeading = result['data']['scopeDetails'][key].scope_heading;
          //   this.scopeDetailvalues = result['data']['scopeDetails'][key].scope_value;
          // }
          // console.log(this.scopeDetailsHeading,'scopeDetailsHeading');
          // console.log(this.scopeDetailvalues,'scopeDetailvalues');
          // this.scopeDetailvalues = result['data']['scopeDetails']['details'];
          //console.log("@@@",result['data']['recommend_visit'])
          let visit = result['data']['recommend_visit'] || result['data']['recommend_visit'] != null ? result['data']['recommend_visit'].replace(/["']/g, "") : '';
          //let visit1 = visit.toString().replace("\"",' ');
          //console.log(">>>", visit);
          if(visit === "second"){
            this.recommVisit = '2nd';
          }
          if(visit === "first"){
            this.recommVisit = '1st';
          }
          if(visit === "third"){
            this.recommVisit = '3rd';
          }
          if(visit === "fourth"){
            this.recommVisit = '4th';
          }else{
            this.recommVisit = '1st';
          }
        },
        ()=>{
          // console.log('comp...');
        }
      )     
    )
    // this.userEmail = sessionStorage.getItem('email');
    // this.userType = sessionStorage.getItem('type');
    // let url = this._service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;

    // this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.profileService+'?id='+this.routeId)
    // .subscribe(
    //   res => { 
    //     // console.log(res, "@@@applicant Info: ");
    //     this.applicantInfo = res['data']['step1'][0];
    //   })

    // this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.inspection_form_basic_data)
    //   .subscribe( 
    //     res => {
          
    //       ////console.log("@Load scope....", res);
    //       this.inspectionBodyScopeFields = res['medicalLabScopeFields'];
    //       //this.countryList = res['allCountry'];
    //       this.labTypeList = res['allLabtype'];
    //       //this.fullScope   = res['fullScope'];
    //       this.criteriaList = res['data']['criteriaList'];
    //       this.step1Data.criteria_request = this.criteriaList[0].code;
    //       this.criteriaMaster = res['data']['schemes'];
    //       ////////console.log("#Get criteria: ", this.criteriaMaster);

    //     },
    //     error => {
        
    // })

    this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.certificationBodies)
    .subscribe( 
      res => {
        let record: any = res['data'];
        if(record){
          this.subTypeMaster = record.serviceList;
          //console.log("@Load Type....", this.subTypeMaster);
        }
        //this.criteriaList = res['data']['criteriaList'];
        //this.criteriaMaster = res['data']['schemes'];
        //////console.log("#Get criteria: ", this.criteriaMaster);

      },
      error => {
      
  })
  }

  // Modal Actions
  open(content, id: number) {
    //this.voucherSentData = {};
    if(id){
      console.log(">>ID: ", id);
      this.voucherSentData['accreditation'] = id;
    }
    this.paymentReceiptValidation = null;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReasonOther(reason)}`;
    });
  }
  private getDismissReasonOther(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this._service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
      //if(type == undefined){
        this.voucherFile.append('voucher_invoice',fileEvent.target.files[0]);
      //}
    }else{
        this.paymentReceiptValidation = false;
        
    }
  }

  downloadCsv() {
    // /admin/accreditation-application-csv?id=1068
    // this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.accrediationCsv+this.routeId)
    // .subscribe(
    //   res => {
    //     console.log(res,'res');
    //   })
    window.open(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.accrediationCsv+this.routeId, '_blank');
  }

  voucherSentSubmit(theForm){
     console.log("Valid/Invalid: ", theForm.form, " -- ", this.voucherSentData);
     let postObject: any = {};

     if(theForm.form.valid && this.paymentReceiptValidation === true){
          let dtFormat: string = '';;
          if(this.voucherSentData['voucher_date'] != undefined && 
          this.voucherSentData['voucher_date']._i != undefined){
            var dtData = this.voucherSentData['voucher_date']._i;
            var year = dtData.year;
            var month = dtData.month;
            var date = dtData.date;
            dtFormat = year + "-" + month + "-" + date;
          }
          console.log("@accred ID: ", this.voucherSentData['accreditation'])
          this.voucherFile.append('voucher_no',this.voucherSentData['voucher_no']);
          this.voucherFile.append('amount',this.voucherSentData['amount']);
          this.voucherFile.append('voucher_date',dtFormat);
          this.voucherFile.append('accreditation',this.voucherSentData['accreditation']);

          this.subscriptions.push(this._trainerService.courseVoucherSave((this.voucherFile))
          .subscribe(
             result => {
               let data: any = result;
                if(data.status){
                  this.voucherFile = new FormData();
                  this.voucherSentData = {};
                  this.modalService.dismissAll();
                  this._toaster.success("Invoice Uploaded Successfully",'Upload');
                }else{
                  this._toaster.warning(data.msg,'');
                }
             }
            )
          )

     }else if(theForm.form.valid && (this.paymentReceiptValidation == false || this.paymentReceiptValidation == null)){
      this._toaster.warning('Please Upload Valid Files','Upload Error',{timeOut:5000});
     }
     else{
      this._toaster.warning('Please Fill required fields','Validation Error',{timeOut:5000});
     }
  }
}
