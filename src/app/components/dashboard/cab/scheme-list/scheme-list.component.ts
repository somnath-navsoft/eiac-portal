import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { TrainerService } from 'src/app/services/trainer.service';
import { Constants } from 'src/app/services/constant.service';
import { ToastrService} from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.scss']
})
export class SchemeListComponent implements OnInit {

  loader:boolean = true;
  subscriptions: Subscription[] = [];
  schemedata:any;
  allScheme:any;

  constructor(private _service: AppService, private _constant: Constants, public _toaster: ToastrService,
    private _trainerService: TrainerService) { }

  ngOnInit() {
    this.loadPageData();
  }

  loadPageData() { 
    this.loader = false;
    let getURL: string =this._service.apiServerUrl + "/" + 'cab-dashboard/' ;
    this._service.getwithoutData(getURL)
      .subscribe(
        res => {
          this.loader = true;
          // console.log(res,'res');
          if(res['status'] == 200){
            this.allScheme = res['dashBoardData']['allScheme'];
          }
        });
  }
}
