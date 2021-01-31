import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-operations-scheme-list',
  templateUrl: './operations-scheme-list.component.html'
})
export class SchemeListOperationsComponent implements OnInit { 

  loader:boolean = true;
  subscriptions: Subscription[] = [];
  schemedata:any;
  allScheme:any[] =[];

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loadPageData();
  }

  loadPageData() { 
    this.loader = false;
    let departmetnId: any = '';
    if(localStorage.getItem('io_dept') != null && localStorage.getItem('io_dept') != ''){
      departmetnId = localStorage.getItem('io_dept');
    }
    let getURL: string = this._service.apiServerUrl + "/" + 'io-dashboard/?department_type=' + departmetnId;
    console.log("@URL: ", getURL);
    this._service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          console.log(res,'@Scheme list...');
          if(res['status'] == 200){
            this.allScheme = res['dashBoardData']['allScheme'];
          }
        });
  }
}
