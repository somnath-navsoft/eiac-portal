import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  candidateProfile:any = {};
  // clientCabFormFile:any = new FormData();

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  ngOnInit() {

  }

  onSubmit(ngForm:any) {
    // this.clientCabFormFile.append('data',JSON.stringify(this.candidateProfile));
    //console.log(this.candidateProfile);
    if(ngForm.form.valid) {

    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }
}
