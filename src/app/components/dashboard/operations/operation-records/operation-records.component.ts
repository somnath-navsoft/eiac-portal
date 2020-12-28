import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TrainerService } from 'src/app/services/trainer.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-operation-records',
  templateUrl: './operation-records.component.html',
  styleUrls: ['./operation-records.component.scss']
})
export class OperationRecordsComponent implements OnInit {

  loader:boolean = true;
  subscriptions: Subscription[] = [];
  paginationConfig: any;
  pageLimit: number = 10;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;
  eventData:any[] = [];
  curSortDir: any = {};
  modalOptions:NgbModalOptions;
  closeResult: string;
  participantsTempList:any[] = [{}];
  participantsList:any[] = [{}];
  dataLoad: boolean = false;
  detailsCourse:any;
  detailsDate:any;
  noOfParticipants:any;
  exportAsConfig: ExportAsConfig;
  exportAs:any = {};
  eventTitle:any;
  show_data:any;
  advSearch: boolean = false;
  userType:any;
  event_date:any;
  minDate:any;
  searchDateData: any = {};
  searchText:any;
  selectStatus:any = [];
  searchValue:any;

  constructor(public Service: AppService, public constant: Constants, public router: Router, public toastr: ToastrService, public _trainerService:TrainerService, private modalService: NgbModal, private exportAsService: ExportAsService) { }

  ngOnInit() {
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
    if(this.searchValue == 'name') {
      document.getElementById('applicant').style.display = 'block';
    }else if(this.searchValue == 'uploaded_date') {
      document.getElementById('uploaded_date').style.display = 'block';
    }else if(this.searchValue == 'expiry_date') {
      document.getElementById('expiry_date').style.display = 'block';
    }
  }

  isValidSearch(){
    if((this.searchValue == '' || this.searchValue == null) || (this.searchText == '' || this.searchText == null)){
      return false;
    }
    return true;
  }

  filterSearchSubmit(){
    let postObject: any = new FormData();
     //console.log("Search click....");
     if(this.isValidSearch()){
      //  if(this.applicationNo != '' && this.applicationNo != null){
      //   postObject.append('id', this.applicationNo);
      //  }
      //  if(this.selectAccrTypeValue != '' && this.selectAccrTypeValue != null){
      //   postObject.append('form_meta', this.selectAccrTypeValue);
      //  }
      var appendKey = this.searchValue;
       if(this.searchValue != '' && this.searchValue != null && this.searchText != '' && this.searchText != null){

        if(this.searchValue == 'uploaded_date') {
          let dtFormat: string = '';

          var dtData = this.searchText._i;
          var year = dtData.year;
          var month = dtData.month + 1;
          var date = dtData.date;
          dtFormat = year + "-" + month + "-" + date;

          postObject.append(appendKey, dtFormat);
        }else if(this.searchValue == 'expiry_date') {
          let dtFormat: string = '';

          var dtData = this.searchText._i;
          var year = dtData.year;
          var month = dtData.month + 1;
          var date = dtData.date;
          dtFormat = year + "-" + month + "-" + date;

          postObject.append(appendKey, dtFormat);
        }else{
          postObject.append(appendKey, this.searchText);
        }
        
       }

        if(postObject){
          this.loader = false;
          this.subscriptions.push(this._trainerService.searchEventlist((postObject))
          .subscribe(
            result => {
              this.loader = true;
              let data: any = result;
                console.log("search results: ", result);
                this.loader = true;
                if(data != undefined && typeof data === 'object' && data.records.length > 0){
                    console.log(">>> Data: ", data.records);
                    this.pageCurrentNumber = 1;
                    this.dataLoad = true;
                    this.eventData = data.records;
                    this.pageTotal = data.records.length;
                }
                if(data != undefined && typeof data === 'object' && data.records.length == 0){
                  this.eventData = data.records;
                  this.pageTotal = data.records.length;
                }
            }
            )
          )
        }

    }else{
      //this._service.openMessageDialog('Please select search fields properly.', "Validation Error");
      this.toastr.warning("Please select search fields properly",'')
    }     
  }
}
