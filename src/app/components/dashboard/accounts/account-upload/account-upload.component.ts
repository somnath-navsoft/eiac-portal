import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constant.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService} from 'ngx-toastr';
import { TrainerService } from 'src/app/services/trainer.service';
import { HttpClientModule, HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-account-upload',
  templateUrl: './account-upload.component.html',
  styleUrls: ['./account-upload.component.scss']
})
export class AccountUploadComponent implements OnInit {

  accountUploadId:any;
  voucherSentData:any = {};
  loader:boolean = true;
  paymentReceiptValidation:boolean = false;
  fileExist:boolean = true;
  voucherFile:any = new FormData();
  userEmail:any;
  userType:any;

  constructor(private _service: AppService, private _constant: Constants, public toaster: ToastrService,
    private _trainerService: TrainerService, private http: HttpClient) { }



  getAppInfo = (url: any) => {
    //console.log("@Calling promise...");
    let promise: any =  new Promise((resolve, reject) => {
      let apiURL = url;
      this.http.get(apiURL)
        .toPromise()
        .then(
          rec => { // Success
            //console.log(">>>> Retrn result: ",rec);
            resolve(rec);
          }
        );
    });
    return promise;
  }  

  ngOnInit() {
    this.accountUploadId = sessionStorage.getItem('accountUploadId');
    let appID: any = this.accountUploadId;
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    
    let url = this._service.apiServerUrl+"/"+'accrediation-details-show/'+appID;
    let promiseResult: any = this.getAppInfo(url);
    if(promiseResult != undefined){
      promiseResult.then((data) => {
        let record: any = data;
        console.log('@Result Data', record);
        if(typeof record == 'object'){
            if(record.data.paymentDetails != undefined && record.data.paymentDetails != false){
                this.voucherSentData.voucher_code = record.data.paymentDetails.voucher_no;
                this.voucherSentData.payment_date = record.data.paymentDetails.voucher_date;
                this.voucherSentData.amount       = record.data.paymentDetails.amount;
                console.log(">>Voucher object: ", this.voucherSentData);
            }
        }
      }, (error) => {
        console.log('Promise rejected.');
        console.log(error.message);
      });
      }
    
    
    // let url = this._service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    // let promiseResult: any = this.getAppInfo(url);
    // if(promiseResult != undefined){
    //   promiseResult.then((data) => {
    //     let record: any = data;
    //     console.log('@User Data', record);       
    //   }, (error) => {
    //     console.log('Promise rejected.');
    //     console.log(error.message);
    //   });
    //   }


    //Call service
    // let aurl = this._service.apiServerUrl+"/"+'profile-service/?userType='+this.userType+'&email='+this.userEmail;
    // this._service.getwithoutData(aurl)
    // .subscribe(
    //   res => {
    //     let getData: any = res;
    //     console.log("#User Data: ", getData);

    //   });

      // let burl = this._service.apiServerUrl+"/"+'accrediation-details-show/'+appID;
      // this._service.getwithoutData(burl)
      // .subscribe(
      //   res => {
      //     let record: any = res;
      //     console.log('@Result Data', record);
      //     if(typeof record == 'object'){
      //       if(record.data.paymentDetails != undefined && record.data.paymentDetails != false){
      //           this.voucherSentData.voucher_code = record.data.paymentDetails.voucher_no;
      //           this.voucherSentData.payment_date = record.data.paymentDetails.voucher_date;
      //           this.voucherSentData.amount       = record.data.paymentDetails.amount;
      //           console.log(">>Voucher object: ", this.voucherSentData);
      //       }
      //     }  
      //   }); 
    
    
    console.log("ID: ", this.accountUploadId)
  }

  validateFileVoucher(fileEvent: any, type?: any) { 
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this._service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
      this.fileExist = true;
      //if(type == undefined){
        this.voucherFile.append('payment_receipt',fileEvent.target.files[0]);
      //}
    }else{
        this.paymentReceiptValidation = false;
        this.fileExist = false;
        
    }
  }

  onSubmitPaymentInformation(ngForm7: any, type?: boolean){
    
    let dtFormat: string = '';
    if(this.voucherSentData['payment_date'] != null){
      var dtData = new Date(this.voucherSentData['payment_date']);
      var year = dtData.getFullYear();
      var month = dtData.getMonth() + 1;
      var date = dtData.getDate();
      dtFormat = year + "-" + month + "-" + date;
    }
    console.log("@Date: ", dtFormat, " -- ", dtData);
    
    this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
    this.voucherFile.append('amount',this.voucherSentData['amount']);
    this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
    this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
    this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
    this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
    this.voucherFile.append('voucher_date',dtFormat);
    this.voucherFile.append('accreditation',this.accountUploadId);
    // this.voucherFile.append('application_id',this.formApplicationId);
    
    if(ngForm7.form.valid && this.paymentReceiptValidation != false) {
      this.fileExist = true;
      // //console.log(this.voucherFile);
      this.loader = false;
        this._trainerService.accountPaymentSave((this.voucherFile))
        .subscribe(
            result => {
              let data: any = result;
              ////console.log("submit voucher: ", data);
              if(data.status){
                setTimeout(() => {                    
                  // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                  // this.toaster.success('Data save successfully','');
                  this.toaster.success(data.msg,'');
                },3500)
                this.loader = true;
              }else{
                this.toaster.warning(data.msg,'');
              }
            }
          )
    }else if(ngForm7.form.valid && this.paymentReceiptValidation == false) {
      this.fileExist = false;
    }
    else{
      this.toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
    
  }

}
