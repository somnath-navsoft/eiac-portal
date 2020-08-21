/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate-trainer-service-list',
  templateUrl: './candidate-trainer-service-list.component.html',
  styleUrls: ['./candidate-trainer-service-list.component.scss']
})
export class CandidateTrainerServiceListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppService } from '../../../../services/app.service';
import { TrainerService } from '../../../../services/trainer.service';
import { Constants } from '../../../../services/constant.service';

import { TrainerState, selectTrainerList} from '../../../../store/trainer.states';
import { Listing, Delete } from '../../../../store/actions/trainer.actions';
import { TrainerModel} from '../../../../models/trainer';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {CustomModalComponent} from '../../../utility/custom-modal/custom-modal.component';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';

import {StripeCheckoutLoader, StripeCheckoutHandler, IStripeCheckoutOptions} from 'ng-stripe-checkout';


declare let paypal: any;
@Component({ 
  selector: 'app-candidate-trainer-service-list',
  templateUrl: './candidate-trainer-service-list.component.html',
  styleUrls: ['./candidate-trainer-service-list.component.scss'],
  providers: [BsModalService, BsModalRef, CustomModalComponent]
})
export class CandidateTrainerServiceListComponent implements OnInit, OnDestroy {
  getTrainerCourse: Observable<any>; 
  trainerdata: any[] = [];
  trainerTempdata: any;
  //Observable subscription
  subscriptions: Subscription[] = [];
  modalOptions:NgbModalOptions;
  modalRef: BsModalRef;

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 5;
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
  courseViewData: any = {};
  voucherEntry: any = {};
  selectCourseData: any = [];
  selectDeleteID: number =0;

  deleteConfirm: boolean = false;
  public payPalConfig ? : IPayPalConfig;
  //private stripeCheckoutHandler: StripeCheckoutHandler;
  paymentReview: any[] = [];
  selectCourses: any = [];

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  //private stripeCheckoutLoader: StripeCheckoutLoader,
  constructor(private store: Store<TrainerState>, private _service: AppService, private _constant: Constants,
    
    private _trainerService: TrainerService, private modalService: NgbModal, private _customModal: CustomModalComponent,
    private modalRefService: BsModalService) { 
    this.store.dispatch(new Listing({}));
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  } 

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script')
      scriptElement.src = scriptUrl
      scriptElement.onload = resolve
      console.log("load script...");
      document.body.appendChild(scriptElement)
  })
}

ngAfterViewInit(): void {
  //Aa_cAg0C6jOVqGZNIBKbOvQHoeDf65clD6LOx-ueefdSMjtdA05nGSNp7qlITU46I4e_UHFOq55SihSS
  //----abhishek.das@navsoft.in
  //----AaradqmTEUZmA70-KmyJ4hDka2Ed1OVWiwMcD3Vb2MzN-OFWD0kc34uUx1xzfPqk2aEY7_fvc5Zi5AlL
  //Ac8bEfv_0vym_lRhTt37A3pbc6Kbr2JXUknS_x7TO6wOGVKKbqpgVhn9xgNdq2S3vtcQEqvY4NJvLVYs
  //------------------
  //---das.abhishek77@gmail.com
  //---AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl
  //https://www.paypalobjects.com/api/checkout.js
  
  let url ='https://www.paypalobjects.com/api/checkout.js';
  //this.loadExternalScript(url);

  /*
  this.loadExternalScript("https://www.paypalobjects.com/api/checkout.js").then(() => {
      paypal.Button.render({
        env: 'sandbox',
        client: {
          sandbox: 'AbP1IN2Lh73n4OhEnK9Uo1HH5PnzRjGtCHe-Us_8qOaa6YWHmSYjERJz6pgiAaRgEf7-pHDYo8PgA-xv'
        },
        commit: true,
        payment: function (data, actions) {
          console.log(">>> paymen: ", data, " -- ", actions)
          return actions.payment.create({
            payment: {
              transactions: [
                {
                  amount: { total: '1.00', currency: 'INR' }
                }
              ]
            }
          })
        },
        onAuthorize: function(data, actions) {
          console.log(">>> onAuthorize: ", data, " -- ", actions)
          return actions.payment.execute().then(function(payment) {
            // TODO
          })
        }
      }, '#paypal-button');
    });
    */
  


  //https://www.paypalobjects.com/api/checkout.js

  // if(this.paymentReview.length){

  //   this.loadExternalScript("https://www.paypalobjects.com/api/checkout.js").then(() => {
  //   paypal.Button.render({
  //     env: 'sandbox',
  //     client: {
  //       sandbox: 'AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl'
  //     },
  //     commit: true,
  //     payment: function (data, actions) {
  //       console.log("@Paypal payment actionms: ", actions, " -- ", data);
  //       return actions.payment.create({
  //         payment: {
  //           transactions: [
  //             {
  //               amount: { "total": "3.00", currency: 'USD',
  //               "details": {
  //                 "subtotal": "3.00",
  //               } 
  //             },
  //               item_list: {
  //                 items: [
  //                   {
  //                   "name": "Course 1",
  //                   "description": "Calibration Laboratories",
  //                   "quantity": "1",
  //                   "price": "1",                    
  //                   "currency": "USD"
  //                   },
  //                   {
  //                     "name": "Course 2",
  //                     "description": "Inspection Bodies",
  //                     "quantity": "1",
  //                     "price": "2",                      
  //                     "currency": "USD"
  //                     }                    
  //                 ]                
  //               }
  //             }
  //           ]
  //         }
  //       })
  //     },
  //     onAuthorize: function(data, actions) {
  //       console.log("@Paypal onAuthorize actionms: ", actions, " -- ", data);
  //       return actions.payment.execute().then(function(payment) {
  //         // TODO
  //         console.log(">>>Success: ", payment);
  //       })
  //     },
  //     onCancel: (data, actions) => {
  //       console.log('OnCancel', data, actions);
  //       //this.showCancel = true;

  //   },
  //   onError: err => {
  //       console.log('OnError', err);
  //       //this.showError = true;
  //   },
  //   onClick: (data, actions) => {
  //       console.log('onClick', data, actions);
  //       //this.resetStatus();
  //   },
  //   }, '#paypalPayment');
  // });
  // }
 
//  this.stripeCheckoutLoader.createHandler({
//     key: 'pk_test_51HHqRNJ6ZMl7d4yhsXNcoo6GhSWI5Ui23ajjeq4UUinTknogJsa9uLosfaW6MRQyEAjkwlgsxAxe0T3FvhstNT6r00QckjHaxZ',
//     // token: (token) => {
//     //     // Do something with the token...
//     //     console.log('Payment successful!', token);
//     // },
//   }).then((handler: StripeCheckoutHandler) => {
//     //console.log("Exceptions :", handler);
//     this.stripeCheckoutHandler = handler;
//   });
}
paymentCloseDialog(){
  console.log("@payment dialog close....");
  this.paymentReview = [];
  this.modalService.dismissAll();
}

createPaymentButton(){
  console.log("creating....buttons...", this.paymentReview, " :: ", this.paymentReview.length);
  if(this.paymentReview.length){
    this.loadExternalScript("https://www.paypalobjects.com/api/checkout.js").then(() => {
    paypal.Button.render({
      env: 'sandbox',
      client: {
        sandbox: 'AZFJTTAUauorPCb9sK3QeQoXE_uwYUzjfrSNEB4I808qDO1vO04mNfK-rQ3x1rjLUIN_Bv83mhhfyCRl'
      },
      commit: true,
      payment: function (data, actions) {
        console.log("@Paypal payment actionms: ", actions, " -- ", data);
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { "total": "0.10", currency: 'USD',
                "details": {
                  "subtotal": "0.10",
                } 
              },
                item_list: {
                  items: [
                    {
                    "name": "Course 1",
                    "description": "Calibration Laboratories",
                    "quantity": "1",
                    "price": "0.05",                    
                    "currency": "USD"
                    },
                    {
                      "name": "Course 2",
                      "description": "Inspection Bodies",
                      "quantity": "1",
                      "price": "0.05",                      
                      "currency": "USD"
                      }                    
                  ]                
                }
              }
            ]
          }
        })
      },
      onAuthorize: function(data, actions) {
        console.log("@Paypal onAuthorize actionms: ", actions, " -- ", data);
        return actions.payment.execute().then(function(payment) {
          // TODO
          console.log(">>>Success: ", payment);
        })
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        //this.showCancel = true;

    },
    onError: err => {
        console.log('OnError', err);
        //this.showError = true;
    },
    onClick: (data, actions) => {
        console.log('onClick', data, actions);
        //this.resetStatus();
    },
    }, '#paypalPayment');
  });
  }
}

getAllCourse(){
  this.subscriptions.push(this._trainerService.getTrainerCourseAll()
     .subscribe(
        result => {
          let data: any = result;
          this.selectCourses = data.records;
          console.log(">>>>course: ", this.selectCourses);
        }
     ))
}

openPaymentView(content, id){
  if(id){     
    this.subscriptions.push(this._trainerService.getTrainerCourseByID(id)
        .subscribe(
           result => {
             let data: any = result;
              if(data != undefined && data.records != undefined){
                console.log(">>>get data: ", data.records);
                if(data.records.customCourseListDetails != undefined && data.records.customCourseListDetails.length){
                  data.records.customCourseListDetails.forEach(rec => {
                    console.log("@get course: ", rec);
                    let findData = this.selectCourses.find(item => item.id == rec.id);
                    if(findData){
                      this.paymentReview.push({title: findData.courseDetails , price: findData.fees_per_trainee})
                    }
                  })
                }
                //this.paymentReview.push(data.records);
                console.log(">>>review: ", this.paymentReview, " :: ");
                this.createPaymentButton();
              }
           },
           error => {
            if(error != undefined && typeof error === 'object'){
             this.modalService.dismissAll();
            }
          },
          () => {
            this.modalService.open(content, this.modalOptions).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
              //console.log("Closed: ", this.closeResult);
              this.courseViewData['courseDuration'] = '';
              this.courseViewData['courseFees'] = '';
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          }
        )
    );
  }
}

// public onClickBuy() {
//   console.log("onClickBuy :");
//   this.stripeCheckoutHandler.open({
//     amount: 2,
//     currency: 'INR',
//     description: "Course Payment",
//     name:''
// }).then((token) => {
//     // Do something with the token...
//     console.log('Payment successful!', token);
// }).catch((err) => {
//     // Payment failed or was canceled by user...
//     if (err !== 'stripe_closed') {
//         console.log("Payment Error: ", err);
//         throw err;
//     }
// });
//   // this.stripeCheckoutHandler.open({
//   //     amount: 1.00,
//   //     currency: 'INR',
//   // });
// }

// public onClickCancel() {
//   console.log("onClickCancel :");
//   // If the window has been opened, this is how you can close it:
//   this.stripeCheckoutHandler.close();
// }


  //Delete Course
  deleteCourse(id: number){
    console.log("delete data...", id);
    if(this.deleteConfirm){
      this.deleteConfirm = false;
    }
    if(id){
      this.subscriptions.push(this._trainerService.deleteTrainerCourseByID(id)
          .subscribe(
             result => {
               let data: any = result;
               //console.log("delte response:1 ", data);
                if(data != undefined && data.status != undefined && data.status == 200){
                  console.log("delte response:2 ", data, " -- ", this.modalRef);
                  //this.modalRef.hide();
                  this._customModal.closeDialog();
                  this._service.openFlashMessage(data.msg,'',5000);
                  
                  this.store.dispatch(new Listing({}));
                  this.loadPageData();
                }
             }
          )
      );
    }
  }
  //hashContent: TemplateRef<any>, 
  openDelete(id: number){
    //console.log(">>>delete ", id);
    if(id){
      //console.log("assign delete id: ", id);
      this.selectDeleteID = id;
      this.deleteConfirm = true;
      //let _dialogRef: any = 'deleteDialog';
      //this._customModal.openDialog(_dialogRef);
    }
    //return;
    console.log("Opening dialog....");
    // this.modalRef = this.modalRefService.show(  
    //   hashContent,  
    //   Object.assign({}, { class: 'gray modal-lg' })  
    // );  
    return;
    // this.modalService.open(hashContent, this.modalOptions).result.then((result) => {
    //   alert("....1");
    //   this.closeResult = `Closed with: ${result}`;
    //   //console.log("Closed: ", this.closeResult);
      
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  // Modal Actions
  openView(content, id: number) {
    //console.log(">>> ", id);
    if(id){     
      this.subscriptions.push(this._trainerService.getTrainerCourseByID(id)
          .subscribe(
             result => {
               let data: any = result;
                if(data != undefined && data.records != undefined){
                  this.selectCourseData = data.records;
                }
             },
             error => {
              if(error != undefined && typeof error === 'object'){
               this.modalService.dismissAll();
              }
            },
            () => {
              this.modalService.open(content, this.modalOptions).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
                //console.log("Closed: ", this.closeResult);
                this.courseViewData['courseDuration'] = '';
                this.courseViewData['courseFees'] = '';
              }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              });
            }
          )
      );
    }
    
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //console.log("Closed with ESC ");
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //console.log("Closed with CLOSE ICON ");
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
      return 'by clicking on a backdrop';
    } else {
      //console.log("Closed ",`with: ${reason}`);
      this.courseViewData['courseDuration'] = '';
      this.courseViewData['courseFees'] = '';
      return  `with: ${reason}`;
    }
  }
  ngOnDestroy() {
     this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  //AbP1IN2Lh73n4OhEnK9Uo1HH5PnzRjGtCHe-Us_8qOaa6YWHmSYjERJz6pgiAaRgEf7-pHDYo8PgA-xv - abhishek.das@navsoft.in
  //AW9aM0m3mC6WOAAmMFpTS9UVhnqKPqg8r7Gdi5hYUjg1Rt6v969mTPU_X1oIw5apJEXaEkcfQb3YfgpV - abhishek.navsoft@gmail.com
  //Acl1AWWet2z5VxLDkSc9jp4HGUDn5XINrJC1o9wgn121b_8nlUG-KdbDUvyfb1NJ6-Rdg9-sMc_YXrKO - abhishek.das.navsoft@gmail.com
  private initConfig(): void {
    this.payPalConfig = {
        currency: 'INR',
        clientId: 'Acl1AWWet2z5VxLDkSc9jp4HGUDn5XINrJC1o9wgn121b_8nlUG-KdbDUvyfb1NJ6-Rdg9-sMc_YXrKO',
        
        // createOrderOnClient: (data) => < ICreateOrderRequest > {
        //   intent: 'CAPTURE',
        //   purchase_units: [{
        //     amount: {
        //       currency_code: 'INR',
        //       value: '1.00',
        //     },
        //     items: [{
        //       name: 'Course Payment',
        //       quantity: '1'
        //   }]
        //   }]
        // },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            //this.showSuccess = true;
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            //this.showCancel = true;

        },
        onError: err => {
            console.log('OnError', err);
            //this.showError = true;
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            //this.resetStatus();
        },
    };
}

  ngOnInit() {
    //this.initConfig();
    //return;


    
    
    setTimeout(() => {
      // this.paypal.Button.render({
      //   env: 'sandbox',
      //   client: {
      //     sandbox: 'Acl1AWWet2z5VxLDkSc9jp4HGUDn5XINrJC1o9wgn121b_8nlUG-KdbDUvyfb1NJ6-Rdg9-sMc_YXrKO'
      //   },
      //   commit: true,
      //   payment: function (data, actions) {
      //     console.log("@Paypal payment actionms: ", actions, " -- ", data);
      //     return actions.payment.create({
      //       payment: {
      //         transactions: [
      //           {
      //             amount: { total: '1.00', currency: 'INR' }
      //           }
      //         ]
      //       }
      //     })
      //   },
      //   onAuthorize: function(data, actions) {
      //     console.log("@Paypal onAuthorize actionms: ", actions, " -- ", data);
      //     return actions.payment.execute().then(function(payment) {
      //       // TODO
      //     })
      //   }
      // }, '#paypal');
    }, 100)
    
    /*
    setTimeout(() => {
      console.log('eee');
      paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Test Course',
                amount: {
                  currency_code: 'INR',
                  value: '1.00'
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          //this.paidFor = true;
          console.log("Approve: ",order);
        },
        onError: err => {
          console.log("Error: ",err);
        }
      })
      .render(this.paypalElement.nativeElement);
    }, 100)
    */
    

    


    /////////////////////////////////
    this.getTrainerCourse = this.store.select(selectTrainerList);
    this.curSortDir['training_course_type']   = false;
    this.curSortDir['course_code']            = false;
    this.curSortDir['agreement_status']       = false;
    this.curSortDir['payment_status']         = false;

    this.selectCustomCourses.push({title: 'Custom Course', value: 'custom_course'})
    this.selectCustomCourses.push({title: 'Public Course', value: 'public_course'})

    this.agreementStatus.push({title: 'Pending', value: 'pending'})
    this.paymentStatus.push({title: 'Pending', value: 'pending'})

    this.voucherEntry['courseDuration'] = '';
    this.voucherEntry['courseFees'] = '';

    //this.courseViewData['courseDuration'] = '';
    this.courseViewData['courseFees'] = '';
    this.courseViewData['courseID'] = 0;
    this.getAllCourse();
    //Get params
    this.loadPageData();
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
        //console.log(">>>POST: ", postObject);

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
        this._service.openMessageDialog('Please select search fields properly.', "Validation Error");
     }     
  }

  sortedList(data: any, sortBy: string, sortDir: boolean){
       //true - asc / false - desc
       ////console.log('>>>', data);
      if(data.length){
          if(sortBy === 'training_course_type'){
            //console.log(">>>Enter type...");
            this.curSortDir.training_course_type = !sortDir;
            if(this.curSortDir.training_course_type){
              let array = data.slice().sort((a, b) => (a.training_course_type > b.training_course_type) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type > b.training_course_type) ? 1 : -1);
            }
            if(!this.curSortDir.training_course_type){
              let array = data.slice().sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1)
              this.trainerdata = array;
              //data.sort((a, b) => (a.training_course_type < b.training_course_type) ? 1 : -1);
            }
          }
          //By course_code
          if(sortBy == 'course_code'){
            this.curSortDir.course_code = !sortDir;
            //console.log(">>>Enter code...", data, " -- ", this.curSortDir.course_code);
            if(this.curSortDir.course_code){
              let array = data.slice().sort((a, b) => (a.course_code > b.course_code) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.course_code){
              let array = data.slice().sort((a, b) => (a.course_code < b.course_code) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By Agreement Status
          if(sortBy == 'agreement_status'){
            this.curSortDir.agreement_status = !sortDir;
            //console.log(">>>Enter agreement_status...", data, " -- ", this.curSortDir.agreement_status);
            if(this.curSortDir.agreement_status){
              let array = data.slice().sort((a, b) => (a.agreement_status > b.agreement_status) ? 1 : -1)
              this.trainerdata = array;
              //console.log("after:: ", array, " :: ", this.trainerdata);
            }
            if(!this.curSortDir.agreement_status){
              let array = data.slice().sort((a, b) => (a.agreement_status < b.agreement_status) ? 1 : -1)
              this.trainerdata = array;
            }
          }
          //By Payment Status
          if(sortBy == 'agreement_status'){
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
      }
  }

  //Load Record
  loadPageData(){
    
    this.getTrainerCourse.subscribe((state) => {
      //console.log(">>>State subscribed: ", state);      
      setTimeout(()=>{
        
        if(state.trainer != undefined && state.trainer.records != undefined){
          this.dataLoad = true;
          let dataRec: any=[];
          this.trainerdata = state.trainer.records;
          dataRec = state.trainer.records;
          //console.log(">>>Load Data: ", this.trainerdata, " -- ", dataRec);
        }
        
        if(state.trainer != undefined && state.trainer.records != undefined && state.trainer.records.length > 0){
          this.pageTotal = state.trainer.records.length;
        }
      },100)      
    });
  }
}


