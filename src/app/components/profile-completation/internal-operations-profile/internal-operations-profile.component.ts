import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../../store/app.states';
import { LogOut, LogInSuccess } from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-internal-operations-profile',
  templateUrl: './internal-operations-profile.component.html',
  styleUrls: ['./internal-operations-profile.component.scss']
})
export class InternalOperationsProfileComponent implements OnInit {

  eiacStaff:any = {};
  eiacStaffFormFile:any = new FormData();
  userEmail:any;
  userType:any;
  headerSteps:any[] = [];
  isCompleteness:any;
  profileComplete:any;
  progressValue:any = 0;
  loader:boolean = true; 
  userId:any;
  titleArr:any[] = [];
  titleFind:any;
  closeResult: string;
  modalOptions:NgbModalOptions;
  user:any = null;

  constructor(public Service: AppService, private store: Store<AppState>, public constant:Constants,public router: Router,public toastr: ToastrService,private modalService: NgbModal) { }

  ngOnInit() {
    this.stepDefaultValue();
    this.userEmail = localStorage.getItem('email');
    this.userType = localStorage.getItem('type');
    this.isCompleteness = localStorage.getItem('profileComplete');
    this.profileComplete = localStorage.getItem('profileComplete');
    this.userId = localStorage.getItem('userId');

    this.headerSteps.push(
      {
      title:'personal_details', desc:'1. Personal <br> Details', activeStep:true, stepComp:false, icon:'icon-user', activeClass:'user-present'
      }
    );
    this.titleArr = ['Mr.','Ms.','Dr.','Prof.','Mrs.'];
    this.loadStep1Data();
  }

  stepDefaultValue() {
    this.eiacStaff.firstName = '';
    this.eiacStaff.last_name = '';
    this.eiacStaff.department = '';
    this.eiacStaff.company_email = '';
    this.eiacStaff.personal_email = '';
    this.eiacStaff.company_phone_with_area = '';
    this.eiacStaff.personal_phone_with_area = '';
    this.eiacStaff.designation = '';
  }

  loadStep1Data() {
    this.loader = false;
    this.Service.getwithoutData(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService+'?userType='+this.userType+'&email='+this.userEmail+'&id='+this.userId)
    .subscribe(
      res => {
        if(res['status'] == true) {
          // console.log(res['data'].step1[0],'data');
          var first_nameData = res['data']['user_data'][0].first_name.split(' ');
            
          console.log(first_nameData);
            this.titleArr.forEach((res2,key) => {
              if(res2 == first_nameData[0]){
                this.titleFind = first_nameData[0];
                // this.firstName = first_nameData[1];
              }
            })
            this.eiacStaff.title = this.titleFind;

          this.eiacStaff.firstName = this.titleFind != '' && this.titleFind != undefined ? first_nameData[1] : first_nameData[0];
          this.eiacStaff.last_name = res['data']['user_data'][0].last_name;
          this.eiacStaff.personal_email = res['data']['user_data'][0].email;
          this.eiacStaff.personal_phone_with_area = res['data']['user_data'][0].contact;
          if(res['data'].step1 != '') {
            var step1 = res['data'].step1[0];
            // this.eiacStaff.date_of_birth = new Date(step1.dob);
            this.eiacStaff.department = step1.department;
            this.eiacStaff.company_email = step1.office_email;
            this.eiacStaff.company_phone_with_area = step1.office_tel_no;
            // this.eiacStaff.personal_phone_with_area = step1.personal_phone_with_area;
            this.eiacStaff.pobox_mailing_address = step1.pobox_mailing_address;
            this.eiacStaff.designation = step1.designation;
            
            if(res['data'].step1 != '' && res['data'].step1[0] && res['data']['user_data'][0].first_name != "" && res['data'].step1[0].dob != "null" && res['data'].step1[0].department != "" && res['data'].step1[0].office_email != "" && res['data'].step1[0].office_tel_no != "" && res['data'].step1[0].designation != "") {
              this.progressValue = 100;
            }
          }
        }
        this.loader = true;
      });
  }

  onSubmit(ngForm:any) {
    if(ngForm.form.valid) {
      //console.log(this.eiacStaff);
      this.eiacStaff.email = this.userEmail;
      this.eiacStaff.userType = this.userType;
      this.eiacStaff.first_name = this.eiacStaff.title+' '+this.eiacStaff.firstName;
      this.eiacStaffFormFile.append('data',JSON.stringify(this.eiacStaff));
      this.loader = false;
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.eiacStaffFormFile)
        .subscribe(
          res => {
            if(res['status'] == true) {
              this.toastr.success(res['msg'], '');
              this.progressValue == 0 || this.progressValue < 100 ? this.progressValue = 100 : this.progressValue = this.progressValue ;
              // this.router.navigateByUrl('/sign-in');
              if(localStorage.getItem('profileComplete') == '0') {
                setTimeout(()=>{
                  let elem = document.getElementById('openAppDialog');
                  //console.log("App dialog hash....", elem);
                  if(elem){
                    elem.click();
                  }
                }, 100)
              }
            }else{
              this.toastr.warning(res['msg'], '');
            }
            this.loader = true;
          });
    }else{
      this.toastr.warning('Please Fill required field','');
    }
  }

  openView(content, type:string) {
    
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //////console.log("Closed: ", this.closeResult);
      //this.courseViewData['courseDuration'] = '';
      //this.courseViewData['courseFees'] = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeChecklistDialog(){
    this.modalService.dismissAll();
    this.store.dispatch(new LogOut(this.user));
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //////console.log("Closed with ESC ");
      
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //////console.log("Closed with CLOSE ICON ");
     
      return 'by clicking on a backdrop';
    } else {
      //////console.log("Closed ",`with: ${reason}`);
      
      return  `with: ${reason}`;
    }
  }

  savedraftStep(stepCount) {
    if(stepCount == 'step1') {
      this.eiacStaff.email = this.userEmail;
      this.eiacStaff.userType = this.userType;
      this.eiacStaff.isDraft = 1;
      this.eiacStaff.first_name = this.eiacStaff.title+' '+this.eiacStaff.first_name;
      this.loader = false;
      this.eiacStaffFormFile.append('data',JSON.stringify(this.eiacStaff));
      this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.profileService,this.eiacStaffFormFile)
      .subscribe(
        res => {
          if(res['status'] == true) {
            this.toastr.success('Save draft successfully', '');
          }else{
            this.toastr.warning(res['msg'], '');
          }
          this.loader = true;
        });
    }
  }
}
