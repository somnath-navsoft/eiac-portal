import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import { Observable, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-operations-services-list',
  templateUrl: './operations-services-list.component.html'
})
export class ServicesListOperationsComponent implements OnInit { 

  loader:boolean = true;
  subscriptions: Subscription[] = [];
  schemedata:any;
  allRecord:any[] =[];

  //Add pagination
  paginationConfig: any;
  pageLimit: number = 10;
  pageOffset: number = 0;
  pageCurrentNumber: number = 1;
  pageConfigData: any = {};
  pageData: any = {};
  pageTotal: number = 0;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loadPageData();
  }

  loadPage(theEvt: any){
    console.log(theEvt);
    let offset: number = theEvt;
    this.pageCurrentNumber = theEvt;
    this.loadPageData(offset, this.pageLimit);
  }

  getFormType(formMeta: string){
    // | 
      if(formMeta === 'health_care'){
        return 'Healthcare';
      }
      else if(formMeta === 'inspection_bodies'){
        return 'Inspection Bodies';
      }
      else if(formMeta === 'testing_calibration'){
        return 'Testing and Calibration';
      }
      else if(formMeta === 'certification_bodies'){
        return 'Certification Bodies';
      }
      else if(formMeta === 'pt_providers'){
        return 'Proficiency Testing Providers';
      }
      else if(formMeta === 'halal_conformity_bodies'){
        return 'Halal Conformity Bodies';
      }else{
        return 'NA';
      }
  }

  loadPageData(offset?:number, limit?:number) { 
    this.loader = false;
    let departmetnId: any = '';
    if(localStorage.getItem('io_dept') != null && localStorage.getItem('io_dept') != ''){
      departmetnId = localStorage.getItem('io_dept');
    }
    //departmetnId = 'accreditation_service';
    //let getURL: string = this._service.apiServerUrl + "/" + 'enquiry-list?page=1&limit=10&enquiry_for=' + departmetnId;
    //console.log("@URL: ", getURL);
    this.subscriptions.push(this._trainerService.getEnquiriesList(offset, limit, departmetnId)
      .subscribe(
        res => {
            this.loader = true;
            let data: any = res;
            //console.log(res,'@Services list...');
            if(typeof data == 'object' && data.records != undefined){
              this.allRecord = data.records;
              this.pageTotal = data.totalCount;
            }
        }));
  }
}
