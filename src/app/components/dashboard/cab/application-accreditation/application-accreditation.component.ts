import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService, Overlay, OverlayContainer } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TrainerService } from '../../../../services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-application-accreditation',
  templateUrl: './application-accreditation.component.html',
  styleUrls: ['./application-accreditation.component.scss'],
  providers: [CustomModalComponent, ToastrService, Overlay, OverlayContainer]
})
export class ApplicationAccreditationComponent implements OnInit {

  serviceList:any;
  loader:boolean = true;
  userType:any;
  getTrainerCourse: Observable<any>; 
  trainerdata: any[] = [];
  trainerTempdata: any;
  //Observable subscription
  subscriptions: Subscription[] = [];
  modalOptions:NgbModalOptions;

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 10;
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

  deleteConfirm: boolean = false;

  constructor(public Service: AppService, private titleService: Title,
  private metaTagService: Meta, public constant:Constants,public router: Router,public toastr: ToastrService,
  private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent) {
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit() {
    // console.log(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService);
    this.titleService.setTitle("Accreditation Page list");
    this.metaTagService.updateTag(
      { name: 'description', content: 'Add song template' },      
    );
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Eiac, Portal, Test, Rest' },      
    );
    this.loadService();
    this.userType = sessionStorage.getItem('type');

    this.curSortDir['id']                 = false;
    this.curSortDir['created_date']       = false;
    this.curSortDir['accr_status']        = false;
    this.curSortDir['prelim_status']      = false;
    this.curSortDir['form_meta']          = false;
    this.curSortDir['payment_status']     = false;
    this.curSortDir['applicant']          = false;
    

    this.loadPageData();
  }

  checkIBId(id: any){
    console.log("resetting...id...1");
    let getId = sessionStorage.getItem('ibUrlId');
    if(getId != undefined && getId != ''){
      console.log("resetting...id...2");
      sessionStorage.setItem('ibUrlId', '');
    }
  }

  loadService() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.service_details_page+"?data=accreditation_service")
    .subscribe(
      res => {
        // console.log(res,'res');
        this.serviceList  = res['allServiceList'];
        this.loader = true;
      });
  }




  //Delete Course
  deleteCourse(id: number){
    if(id){
      this.subscriptions.push(this._trainerService.deleteTrainerCourseByID(id)
          .subscribe(
             result => {
               let data: any = result;
               //console.log("delte response:1 ", data);
                if(data != undefined && data.status != undefined && data.status == 200){
                  //console.log("delte response:2 ", data);
                  this.Service.openFlashMessage(data.msg,'',5000);
                  //this.modalService.dismissAll();
                  this._customModal.closeDialog();
                  //this.store.dispatch(new ListingAccredService({}));
                  this.loadPageData();
                }
             }
          )
      );
    }
  }

  openDelete(id: number){
    //console.log(">>>delete ", id);
    if(id){
      console.log("assign delete id: ", id);
      this.selectDeleteID = id;
      this.deleteConfirm = true;
    }
  }

  serviceStatus(index,id){
    this.loader = false;

    this.subscriptions.push(this._trainerService.updateStatus(id)
      .subscribe(
        result => {
          this.loader = true;
          // console.log(result,'result');
          this.trainerdata[index].accr_status = 'complete';
          this.toastr.success("Payment Completed Successfully",'');
      })
    );

  }

  //Open View Action
  openView(content, id: number) {
    //console.log(">>> ", id);
    if(id){
    }
    
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
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
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
                  this.toastr.success("Invoice Uploaded Successfully",'Upload');
                }else{
                  this.toastr.warning(data.msg,'');
                }
             }
            )
          )

     }else if(theForm.form.valid && (this.paymentReceiptValidation == false || this.paymentReceiptValidation == null)){
      this.toastr.warning('Please Upload Valid Files','Upload Error',{timeOut:5000});
     }
     else{
      this.toastr.warning('Please Fill required fields','Validation Error',{timeOut:5000});
     }
  }


  ngOnDestroy() {
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  validateFile(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf', 'PDF'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
      //if(type == undefined){
        this.voucherFile.append('voucher_invoice',fileEvent.target.files[0]);
      //}
    }else{
        this.paymentReceiptValidation = false;
        
    }
  }

  filterSearchSec(){
    this.advSearch = !this.advSearch
  }

  filterSearchReset(){
    //Reset serach
    this.selectCode = '';
    this.selectFees = '';
    this.selectAgreementStatus = '';
    this.selectPaymentStatus = '';
    this.selectCustomCourse = '';

    this.loadPageData();
  }
  
  isValidSearch(){
    if(this.selectCode === '' && this.selectFees === '' && this.selectAgreementStatus === '' && 
        this.selectPaymentStatus === '' && this.selectCustomCourse === ''){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
     let postObject: any = {};
     //console.log("Search click....");
     if(this.isValidSearch()){
       if(this.selectCode != ''){
        postObject['course_code'] = this.selectCode;
       }
       if(this.selectFees != '' && this.selectFees != null){
        postObject['fees_per_trainee'] = this.selectFees;
       }
       if(this.selectAgreementStatus != ''){
        postObject['agreement_status'] = this.selectAgreementStatus;
       }
       if(this.selectPaymentStatus != ''){
        postObject['payment_status'] = this.selectPaymentStatus;
       }
       if(this.selectCustomCourse != ''){
        postObject['training_course_type'] = this.selectCustomCourse;
       }

        if(postObject){
          this.subscriptions.push(this._trainerService.searchCourse((postObject))
          .subscribe(
             result => {
               let data: any = result;
                ////console.log("search results: ", result);
                if(data != undefined && typeof data === 'object' && data.records.length){
                    //console.log(">>> Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
                    this.trainerdata = data.records;
                    this.pageTotal = data.records.length;
                }
             }
            )
          )
        }

     }else{
      this.Service.openMessageDialog('Please select search fields properly.', "Validation Error");
     }     
  }

  getRouteId(routeId) {
    // sessionStorage.setItem('routeId',routeId);
  }

  sortedList(data: any, sortBy: string, sortDir: boolean){
       //true - asc / false - desc
       ////console.log('>>>', data);
      if(data.length){
          if(sortBy === 'id'){
            //console.log(">>>Enter type...");
            this.curSortDir.id = !sortDir;
            if(this.curSortDir.id){
              let array = data.slice().sort((a, b) => (a.id > b.id) ? 1 : -1)
              this.trainerdata = array;
            }
            if(!this.curSortDir.id){
              let array = data.slice().sort((a, b) => (a.id < b.id) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
            }
          }
          //By created_date
          if(sortBy == 'created_date'){
            this.curSortDir.created_date = !sortDir;
            //console.log(">>>Enter code...", data, " -- ", this.curSortDir.course_code);
            if(this.curSortDir.created_date){
              let array = data.slice().sort((a, b) => (a.created_date > b.created_date) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.created_date){
              let array = data.slice().sort((a, b) => (a.created_date < b.created_date) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By accr_status
          if(sortBy == 'accr_status'){
            this.curSortDir.accr_status = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.accr_status){
              let array = data.slice().sort((a, b) => (a.accr_status > b.accr_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.accr_status){
              let array = data.slice().sort((a, b) => (a.accr_status < b.accr_status) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By Prelim Status
          if(sortBy == 'prelim_status'){
            this.curSortDir.prelim_status = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.prelim_status){
              let array = data.slice().sort((a, b) => (a.prelim_status > b.prelim_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.prelim_status){
              let array = data.slice().sort((a, b) => (a.prelim_status < b.prelim_status) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By form_meta
          if(sortBy == 'form_meta'){
            this.curSortDir.form_meta = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.form_meta){
              let array = data.slice().sort((a, b) => (a.form_meta > b.form_meta) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.form_meta){
              let array = data.slice().sort((a, b) => (a.form_meta < b.form_meta) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By Payment Status
          if(sortBy == 'payment_status'){
            this.curSortDir.payment_status = !sortDir;
            //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
            if(this.curSortDir.payment_status){
              let array = data.slice().sort((a, b) => (a.payment_status > b.payment_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.payment_status){
              let array = data.slice().sort((a, b) => (a.payment_status < b.payment_status) ? 1 : -1)
              this.trainerdata = array;
            }
          }  
          if(sortBy == 'applicant'){
            this.curSortDir.applicant = !sortDir;
            //console.log(">>>Enter payment_status...", data, " -- ", this.curSortDir.payment_status);
            if(this.curSortDir.applicant){
              let array = data.slice().sort((a, b) => (a.applicant > b.applicant) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.applicant){
              let array = data.slice().sort((a, b) => (a.applicant < b.applicant) ? 1 : -1)
              this.trainerdata = array;
            }
          }        
      }
  }

  //Load Record
  loadPageData(){
    this.loader = false;
    this.subscriptions.push(this._trainerService.getAccreditationServiceList()
      .subscribe(
        result => {
          this.loader = true;
          let data: any = result;
          let dataRec: any=[];
          this.dataLoad = true;
          // console.log('loading...', data.records);
          // console.log(">>>List: ", data);
          this.trainerdata = data.records;
          dataRec = data.records;
          this.pageTotal = data.records.length;
        },
        ()=>{
          // console.log('comp...');
        }
      )          
    )
  }

}
