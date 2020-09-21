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
  bodMember:any;
  otherAccr:any;
  other_accr_model:any;
  Object = Object;
  ptParticipation:any[] = [];
  technicalManager:any;
  managementManager:any;
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
  userType:string='';
  applicantDetails: any;
  countryList: any;
  appCountry: string = '';

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, public sanitizer: DomSanitizer,private modalService: NgbModal,) { }

  ngOnInit() {
    this.loader = true;
    this.routeId = sessionStorage.getItem('routeId');

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
        console.log(">>>cccc ", this.countryList);
    })
 }

  loadData() {
    this.subscriptions.push(this._trainerService.trainerAccredDetailsServtrainerAccredDetailsServ(this.routeId)
      .subscribe(
        result => {
          console.log(result, " -- ", this.countryList);
          //return;
          this.serviceDetail = result['data'];
          let getC: any = this.countryList.countries.find(item => item.id == this.serviceDetail.country)
          console.log("cc>> ", getC);
          if(getC){
            this.appCountry = getC.name;
          }
          //
          if(this.serviceDetail.onBehalfApplicantDetails != undefined && this.serviceDetail.onBehalfApplicantDetails.length >0 ){
            this.applicantDetails = this.serviceDetail.onBehalfApplicantDetails[0]
          }
          this.ownershipOfOrg = result['data']['ownershipOfOrg']
          this.bodMember = result['data']['bodMember'];
          this.otherAccr = result['data']['otherAccr'];
          this.other_accr_model = result['data']['otherAccr'] != '' ? '1' : '0' ;
          this.ptParticipation = result['data']['ptParticipation'];
          this.technicalManager = result['data']['technicalManager'][0];
          this.managementManager = result['data']['technicalManager'][0];
          this.paymentDetails = result['data'].paymentDetails;
          this.scopeDetailsHeading = result['data']['scopeDetails'].heading.column_list;
          this.scopeDetailvalues = result['data']['scopeDetails']['details'];
          //console.log("@@@",result['data']['recommend_visit'])
          let visit = result['data']['recommend_visit'].replace(/["']/g, "");
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
          }
        },
        ()=>{
          console.log('comp...');
        }
      )     
    )
    // this.userEmail = sessionStorage.getItem('email');
    // this.userType = sessionStorage.getItem('type');
    let url = this._service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;

    this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constant.API_ENDPOINT.profileService+'?id='+this.routeId)
    .subscribe(
      res => { 
        console.log(res, "@@@applicant Info: ");
        this.applicantInfo = res['data']['step1'][0];
      })
  }
}
