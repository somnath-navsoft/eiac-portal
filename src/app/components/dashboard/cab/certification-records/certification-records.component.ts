import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from 'src/app/components/utility/custom-modal/custom-modal.component';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-certification-records',
  templateUrl: './certification-records.component.html',
  styleUrls: ['./certification-records.component.scss'], 
  providers: [CustomModalComponent],
})
export class CertificationRecordsComponent implements OnInit {
  
  getTrainerCourse: Observable<any>; 
  trainerdata: any[] = [];
  trainerTempdata: any;
  //Observable subscription
  subscriptions: Subscription[] = [];
  modalOptions:NgbModalOptions;

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 10;
  pageOffset: number = 0;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;

  curSortDir: any = {};
  dataLoad: boolean = false;

  advSearch: boolean = false;
  selectCustomCourses: any[] = [];
  selectCustomCourse: string='';
  selectAgreementStatus: string='';
  selectPaymentStatus: string='';
  selectCode: string='';
  selectFees: string='';
  agreementStatus: any[] =[]; 
  paymentStatus: any[] =[];
  
  closeResult: string;
  voucherSentData: any = {};
  selectCourseData: any = [];
  courseViewData: any = {};
  selectDeleteID: number = 0;
  voucherFile:any = new FormData();
  paymentReceiptValidation: boolean = true;
  loader:boolean = true;

  deleteConfirm: boolean = false;
  exportAsConfig: ExportAsConfig;
  exportAs: any = '';
  selectAccrType: any =[];
  selectAccrStatus: any =[];
  applicationNo: string = '' || null;
  paymentStatusValue: string = '' || null;
  selectAccrTypeValue: string = '' || null;
  show_data:any;

  userType: string;
  searchValue: any;
  searchText: any;
  allSchemeData: any[] = [];
  allSchemeREcord: any[] = [];
  accreditation_type: string;
  accreditation_status: string;
  accreditation_scope: string;

  getCountryStateCityAll: any[]=[];
  allCities: any[] =[];
  searchCountryText: string = '';
  searchCityText: string = '';
  criteria: string = '';
  loadCountryLists: any[]= [];

  loadCertificateType: any[]=[];
  loadCertificateStatus: any[]=[];

  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  public errorLoader: boolean = false;
  pathPDF: any;
  tradelicenseName:any;
  cabName:any;
  startDate:any;
  expiryDate:any;
  tradelicenseFile:any;
  newTextchange:any = 'Search Text';
  
  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService, public sanitizer: DomSanitizer, private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent, private exportAsService: ExportAsService,config: NgbModalConfig) { 
    config.windowClass = 'custom-modal';
  }

    closeDialog(){
      this.modalService.dismissAll();
    }
    
    onError(error: any) {
      // do anything
      //////////console.log('PDF Error: ', error)
      this.errorLoader = true;
    }

    completeLoadPDF(pdfLoad: PDFDocumentProxy){
      console.log("Completed Load PDF :: ", pdfLoad);
      this.loaderPdf = false;
      this.completeLoaded = true;
    }

    onProgress(progressData: PDFProgressData){
    console.log("Loding Pdf :: ", progressData);
      this.loaderPdf = true;
    }

    getSantizeUrl(url : string) { 
      return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
    }

    openView(content: any,filepath: string) {
      let pathData: any;
      this.errorLoader = false;
      ////////console.log(">>>pop up...", content);
      let makePath: any = this._constant.mediaPath+filepath;
      console.log(">>> open file...", makePath);
      pathData = this.getSantizeUrl(makePath);
      this.pathPDF = pathData.changingThisBreaksApplicationSecurity;

      console.log(">>> open view", pathData);

      this.modalService.open(content, this.modalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        //////////console.log("Closed: ", this.closeResult);
        //this.courseViewData['courseDuration'] = '';
        //this.courseViewData['courseFees'] = '';
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        //////////console.log("Closed with ESC ");
        
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        //////////console.log("Closed with CLOSE ICON ");
      
        return 'by clicking on a backdrop';
      } else {
        //////////console.log("Closed ",`with: ${reason}`);
        
        return  `with: ${reason}`;
      }
    }


    exportFile() {
      // console.log(this.exportAs);
      this.exportAsConfig = {
        type: 'csv', // the type you want to download
        elementIdOrContent: 'records-export', // the id of html/table element
      }
      // let fileName: string = (this.exportAs.toString() == 'xls') ? 'accreditation-service-report' : 
      this.exportAsService.save(this.exportAsConfig, 'report').subscribe(() => {
        // save started
      });
    }

  ngOnInit() { 
    this.loadPageData();
    this.loadCertTypeStatus();
    this.curSortDir['new_no']                       = false;
    this.curSortDir['certificate_type']             = false;
    this.curSortDir['cab_type']             = false;
    this.curSortDir['cab_status']           = false;
    this.curSortDir['start_date']        = false;
    this.curSortDir['to_date']             = false;

    this.userType = sessionStorage.getItem('type');

    //Assign Search Type
    this.selectAccrType = [ 
      {title: 'Inspection Bodies', value:'inspection_body'},
      {title: 'Certification Bodies', value:'certification_bodies'},
      {title: 'Testing Calibration', value:'testing_calibration'},
      {title: 'Health Care', value:'health_care'},
      {title: 'Halal Conformity Bodies', value:'halal_conformity_bodies'},
      {title: 'Proficiency Testing Providers', value:'pt_providers'}      
      ];
    this.selectAccrStatus  = [
      {title: 'Payment Pending', value:'pending'},
      {title: 'Application Process', value:'application_process'},
      {title: 'Under Review', value:'under_review'},
      {title: 'Complete', value:'complete'},
      {title: 'Draft', value:'draft'}
    ]

  }

  loadCertTypeStatus(){

    this.subscriptions.push(this._trainerService.getCertificateType()
      .subscribe(
        result => {
          //this.loader = true;
          let record: any = result;

          if(record != undefined && typeof record === 'object'){
            if(record.certificate_status != undefined){
              this.loadCertificateStatus = record.certificate_status;
            }
            if(record.data != undefined && record.data.length > 0){
              this.loadCertificateType = record.data;
            }
          }
          
          console.log('Data Status...', record);
          
        },
        ()=>{
          console.log('comp status...');
        }
      )
    )

  }

  searchableColumn() {
    this.searchText = '';
    var myClasses = document.querySelectorAll('.field_show'),
          i = 0,
          l = myClasses.length;
       for (i; i < l; i++) {
          let elem: any = myClasses[i]
          elem.style.display = 'none';
      }
    if(this.searchValue == 'trade_license_number') {
      document.getElementById('applicant').style.display = 'block';
      this.newTextchange = 'Record Number';
    }else if(this.searchValue == 'uploaded_on') {
      document.getElementById('event_date').style.display = 'block';
      this.newTextchange = 'Date of Issue';
    }else if(this.searchValue == 'expiry_date') {
      document.getElementById('event_date').style.display = 'block';
      this.newTextchange = 'Date of Expiry';
    }
  }


  filterSearchSec(){
    this.advSearch = !this.advSearch
    this.filterSearchReset();
  }

  filterSearchReset(type?: string){
    //Reset serach
    this.searchText = '' || null;
    this.searchValue = '' || null;
    // this.paymentStatusValue = '' || null;
    this.show_data = this.pageLimit = 10;
    this.exportAs = null;
    if(type != undefined && type != ''){
      this.loadPageData();
    }
  }

  isValidSearch(){
    if((this.searchValue == '') || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  showData() {
    //this.pageLimit = this.show_data;
    // this.loadPageData();
    this.pageLimit = this.show_data;
    this.pageCurrentNumber = 1;
    if(this.searchValue != null && (this.searchText != null && this.searchText != '')){
      this.filterSearchSubmit();
  }else{
    this.loadPageData(0,this.pageLimit);
  }
    //this.trainerdata.slice(0, this.show_data);
  }

  paginationReset() {
    console.log(">>>Reset calling....");
    this.exportAs = {};
  }


  changeFilter(theEvt: any){
    console.log("@change: ", theEvt, " :: ", theEvt.value);
    let getIdValue: string = theEvt.value;
    this.searchText = '';
    var myClasses = document.querySelectorAll('.slectType'),i = 0,length = myClasses.length;
      for (i; i < length; i++) {
          let elem: any = myClasses[i]
            console.log("@Elem: ", elem);
            elem.style.display = 'none';
            if(getIdValue == 'certificate_no') {
                let getElementId = document.getElementById('textType');
                getElementId.style.display = 'block';
            }else{
              if(elem.id === getIdValue){
                elem.style.display = 'block';
              }
            }
      }
  }

  filterSearchSubmit(offset:number = 0){
    
    if(this.isValidSearch()){
      this.loader = false;
      let useQuery: any = '';
      let newsearchText = '';
      if(this.searchValue == 'trade_license_number') {
        newsearchText = this.searchText;
      }else if(this.searchValue == 'uploaded_on' || this.searchValue == 'expiry_date') {
        var dtData = this.searchText._i;
        var year = dtData.year;
        var month = dtData.month + 1;
        var date = dtData.date;
        newsearchText = year + "-" + month + "-" + date;
      }
      useQuery =   this.searchValue + "=" + newsearchText + '&offset='+offset+'&limit='+this.pageLimit;              

        if(useQuery){
          this.subscriptions.push(this._trainerService.searchRecordList(useQuery)
          .subscribe(
            result => {
              let data: any = result;
                console.log("search results: ", result);
                this.loader       = true;
                this.dataLoad     = true;
                console.log('Data search load...', data);                
                this.trainerdata  = data['records'];
                // let tempObj = [];
                // this.trainerdata.forEach((res,key) => {
                //   if(this.trainerdata[key].trade_license_number != null){
                //     tempObj.push(this.trainerdata[key]);
                //   }
                //   // this.trainerdata[key].trade_license_number = ;
                // })
                // //dataRec = data.records;
                // this.trainerdata = tempObj;

                this.pageTotal    = data.totalCount;

            }
            )
          )
        }

    }else{
      //this._service.openMessageDialog('Please select search fields properly.', "Validation Error");
      this._toaster.warning("Please select search fields properly",'')
    }     
  }

  loadPage(theEvt: any){
    console.log(theEvt);
    let offset: number = theEvt - 1;
    this.pageCurrentNumber = theEvt;
    if(this.searchValue != null && (this.searchText != null && this.searchText != '')){
      console.log('src...');
      this.filterSearchSubmit(offset);
    }else{
    this.loadPageData(offset, this.pageLimit);
    }
  }

  openRecord(content,newObj:any) {
    console.log(newObj)
    //this.voucherSentData = {};
    // if(id){
    //   console.log(">>ID: ", id);
    //   this.voucherSentData['accreditation'] = id;
    //   this.voucherSentData['index'] = key;
    //   this.voucherIndex = key
    // }
    // this.paymentReceiptValidation = null;
    
    
    this.cabName = newObj.cab_name != null && newObj.cab_name ? newObj.cab_name : 'N/A';
    this.tradelicenseName = newObj.trade_license_number != null && newObj.trade_license_number ? newObj.trade_license_number : 'N/A';
    this.tradelicenseFile = newObj.trade_license != null && newObj.trade_license ? newObj.trade_license : 'N/A';
    this.startDate = newObj.date_of_issue != null && newObj.date_of_issue ? newObj.date_of_issue : 'N/A';
    this.expiryDate = newObj.date_of_expiry != null && newObj.date_of_expiry ? newObj.date_of_expiry : 'N/A';

    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  downloadRecord(file){
    console.log(file,'file');
    window.open(this._constant.mediaPath+file, '_blank');
  }

  loadPageData(offset?:number, limit?:number) { 
    this.loader = false;
    var id = 'all';

    this.subscriptions.push(this._trainerService.getRecordList(offset,limit)
      .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          this.dataLoad = true;
          console.log('Data load...', data);
          // let tempObj = [];
          this.trainerdata = data['records'];
          // this.trainerdata.forEach((res,key) => {
          //   // if(this.trainerdata[key].trade_license_number != null){
          //     tempObj.push(this.trainerdata[key]);
          //   // }
          //   // this.trainerdata[key].trade_license_number = ;
          // })
          //dataRec = data.records;
          // this.trainerdata = tempObj;
          this.pageTotal = data.totalCount;

        },
        ()=>{
          console.log('comp...');
        }
      )          
    )
  }

  sortedList(data: any, sortBy: string, sortDir: boolean){
    //true - asc / false - desc
    ////console.log('>>>', data);
    if(data.length){
        if(sortBy === 'new_no'){
          //console.log(">>>Enter type...");
          this.curSortDir.new_no = !sortDir;
          if(this.curSortDir.new_no){
            let array = data.slice().sort((a, b) => (a.trade_license_number > b.trade_license_number) ? 1 : -1)
            this.trainerdata = array;
          }
          if(!this.curSortDir.new_no){
            let array = data.slice().sort((a, b) => (a.trade_license_number < b.trade_license_number) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By certificate_type
        if(sortBy == 'uploaded_on'){
          this.curSortDir.uploaded_on = !sortDir;
          if(this.curSortDir.uploaded_on){
            let array = data.slice().sort((a, b) => (a.date_of_issue > b.date_of_issue) ? 1 : -1)
            this.trainerdata = array;
          }
          if(!this.curSortDir.uploaded_on){
            let array = data.slice().sort((a, b) => (a.date_of_issue < b.date_of_issue) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By cab_type
        if(sortBy == 'expiry_date'){
          this.curSortDir.expiry_date = !sortDir;
          if(this.curSortDir.expiry_date){
            let array = data.slice().sort((a, b) => (a.date_of_expiry > b.date_of_expiry) ? 1 : -1)
            this.trainerdata = array;
          }
          if(!this.curSortDir.expiry_date){
            let array = data.slice().sort((a, b) => (a.date_of_expiry < b.date_of_expiry) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By cab_status
        if(sortBy == 'cab_status'){
          this.curSortDir.cab_status = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.cab_status){
            let array = data.slice().sort((a, b) => (a.cab_status > b.cab_status) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.cab_status){
            let array = data.slice().sort((a, b) => (a.cab_status < b.cab_status) ? 1 : -1)
            this.trainerdata = array;
          }
        }
        //By start_date
        if(sortBy == 'start_date'){
          this.curSortDir.start_date = !sortDir;
          //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
          if(this.curSortDir.start_date){
            let array = data.slice().sort((a, b) => (a.start_date > b.start_date) ? 1 : -1)
            this.trainerdata = array;
            //console.log("after:: ", array, " :: ", this.trainerdata);
          }
          if(!this.curSortDir.start_date){
            let array = data.slice().sort((a, b) => (a.start_date < b.start_date) ? 1 : -1)
            this.trainerdata = array;
          }
        }

        //By to_date
        if(sortBy == 'to_date'){
          this.curSortDir.to_date = !sortDir;
          if(this.curSortDir.to_date){
            let array = data.slice().sort((a, b) => (a.to_date > b.to_date) ? 1 : -1)
            this.trainerdata = array;
          }
          if(!this.curSortDir.to_date){
            let array = data.slice().sort((a, b) => (a.to_date < b.to_date) ? 1 : -1)
            this.trainerdata = array;
          }
        }       
    }
  }
}
