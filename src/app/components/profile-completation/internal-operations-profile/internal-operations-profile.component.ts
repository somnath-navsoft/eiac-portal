import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-internal-operations-profile',
  templateUrl: './internal-operations-profile.component.html',
  styleUrls: ['./internal-operations-profile.component.scss']
})
export class InternalOperationsProfileComponent implements OnInit {

  eiacStaff:any = {};

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {

  }

  onSubmit(ngForm:any) {
    if(ngForm.form.valid) {
      //console.log(this.eiacStaff);
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

}
