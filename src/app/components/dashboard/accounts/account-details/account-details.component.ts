import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constant.service';
import { Observable, Subscription } from 'rxjs';
import { ToastrService} from 'ngx-toastr';
import { TrainerService } from 'src/app/services/trainer.service';
import * as XLSX from 'xlsx';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  accountDetailId:any;
  subscriptions: Subscription[] = [];
  loader:boolean = true;
  accountsData:any;
  allRecords:any[] = []
  fileName:any;

  paginationConfig: any;
  pageLimit: number = 5;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;

  selectType: any ='';
  exportAsConfig: ExportAsConfig;

  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download
  //   elementIdOrContent: 'excel-table', // the id of html/table element
  // }
  
  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService, private exportAsService: ExportAsService) { }


  selectionType(){
    if(this.selectType != ''){
      this.exportAsConfig = {
        type: this.selectType.toString(), // the type you want to download
        elementIdOrContent: 'excel-table', // the id of html/table element
      }
    }
  }

  downloadDoc(){
      if(this.selectType != ''){
          let filename: string;
          this.exportAsConfig = {
            type: this.selectType.toString(), // the type you want to download
            elementIdOrContent: 'excel-table', // the id of html/table element
          }
         if(this.selectType == 'pdf'){
          filename = "ExportToPdf";
          this.export(filename);
         }
         if(this.selectType == 'csv'){
          filename = "ExportToCsv";
          this.export(filename);
         }
         if(this.selectType == 'xls'){
          filename = "ExportToXls";
          this.export(filename);
         }
      }else{
        this._toaster.warning("Please select a valid type",'');
      }
  }

  ngOnInit() {
    this.fileName = 'acounts.xlsx'
    this.accountDetailId = localStorage.getItem('accountDetailId');

    this.loader = false;
    this.subscriptions.push(this._trainerService.getAccountDetails(this.accountDetailId)
      .subscribe(
        result => {
          this.loader = true;
          var getDetails = {};
          // var allRecords = [];
          this.allRecords = result['data'];
          this.allRecords.forEach((res,key) => {
            if(res.payment_meta == 'prelim_visit'){
              getDetails['prelim_visit'] = this.allRecords[key];
            }
            if(res.payment_meta == 'application_fees'){
              getDetails['application_fees'] = this.allRecords[key];
            }
            if(res.payment_meta == 'document_review'){
              getDetails['document_review'] = this.allRecords[key];
            }
            if(res.payment_meta == 'assessment'){
              getDetails['assessment'] = this.allRecords[key];
            }
            if(res.payment_meta == 'certification'){
              getDetails['certification'] = this.allRecords[key];
            }
            this.accountsData = getDetails;
          })
          
      })
    )
  }

  exportexcel(): void 
  {
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  export(fileName: string) {
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, fileName.toString()).subscribe(() => {
      // save started
    });
    // this.exportAsService.save(this.exportAsConfig, 'My File Name').subscribe(() => {
    //   // save started
    // });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    // this.exportAsService.get(this.exportAsConfig).subscribe(content => {
    //   console.log(content);
    // });
  }
  
}
