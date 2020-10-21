import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constant.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService} from 'ngx-toastr';
import { TrainerService } from 'src/app/services/trainer.service';

@Component({
  selector: 'app-account-upload',
  templateUrl: './account-upload.component.html',
  styleUrls: ['./account-upload.component.scss']
})
export class AccountUploadComponent implements OnInit {

  accountUploadId:any;
  voucherSentData:any = {};
  loader:boolean = true;
  paymentReceiptValidation:boolean = true;
  voucherFile:any = new FormData();

  constructor(private _service: AppService, private _constant: Constants, public toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.accountUploadId = sessionStorage.getItem('accountUploadId');
  }

  validateFileVoucher(fileEvent: any, type?: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf'];
    var ex_check = this._service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.paymentReceiptValidation = true;
      //if(type == undefined){
        this.voucherFile.append('payment_receipt',fileEvent.target.files[0]);
      //}
    }else{
        this.paymentReceiptValidation = false;
        
    }
  }

  onSubmitPaymentInformation(ngForm7: any, type?: boolean){
    
      let dtFormat: string = '';
      if(this.voucherSentData['payment_date'] != undefined && 
        this.voucherSentData['payment_date']._i != undefined){
        var dtData = this.voucherSentData['payment_date']._i;
        var year = dtData.year;
        var month = dtData.month;
        var date = dtData.date;
        dtFormat = year + "-" + month + "-" + date;
      }
      //     
    
    this.voucherFile.append('voucher_no',this.voucherSentData['voucher_code']);
    this.voucherFile.append('amount',this.voucherSentData['amount']);
    this.voucherFile.append('transaction_no',this.voucherSentData['transaction_no']);
    this.voucherFile.append('payment_method',this.voucherSentData['payment_method']);
    this.voucherFile.append('payment_made_by',this.voucherSentData['payment_made_by']);
    this.voucherFile.append('mobile_no',this.voucherSentData['mobile_no']);
    this.voucherFile.append('voucher_date',dtFormat);
    this.voucherFile.append('accreditation',this.accountUploadId);
    // this.voucherFile.append('application_id',this.formApplicationId);
    
    console.log(this.voucherFile,'voucherFile');
    this.loader = false;
    if(ngForm7.form.valid && this.paymentReceiptValidation != false) {
      // //console.log(this.voucherFile);
        this._trainerService.accountPaymentSave((this.voucherFile))
        .subscribe(
            result => {
              this.loader = true;
              let data: any = result;
              ////console.log("submit voucher: ", data);
              if(data.status){
                setTimeout(() => {                    
                  // this.router.navigateByUrl('/dashboard/cab_client/application-accreditation');
                  this.toaster.success('Data save successfully','');
                },3500)
                
              }else{
                this.toaster.warning(data.msg,'');
              }
            }
          )
    }
    else{
      this.toaster.warning('Please Fill required field','Validation Error',{timeOut:5000});
    }
    
  }

}
