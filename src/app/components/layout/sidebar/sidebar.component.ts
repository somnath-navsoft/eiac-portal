import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../../services/constant.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  dashMenu: any[]   = []; 
  userType: string  = '';
  userID: number = 0;
  userEmail:any;
  currentTitle:any;
  isdDynamicsopenClose:any;
  accrCount:any;
  registrationCount:any;
  trainingCount:any;

  constructor(private _constants:  Constants, private _service: AppService, 
              private _router: Router) { }

  ngOnInit() {
    this.userEmail  = localStorage.getItem('email');
    this.userType   = localStorage.getItem('type');
    this.userID     = parseInt(localStorage.getItem('userId'));
    this._service.getUserType();
    // this.userType = this._constants.logType;
   
    //console.log("Type menu: ", this.dashMenu);
    this.loadData();
  }

  loadData() {
    //this._service.apiServerUrl+"/"+this._constants.API_ENDPOINT.userPermissionData+'?userType='+this.userType+'&email='+this.userEmail
    let reqURL: string = '';
    reqURL = this._service.apiServerUrl+"/"+this._constants.API_ENDPOINT.userPermissionData+'?userType='+this.userType+'&email='+this.userEmail;
    if(this.userEmail == ''){
      reqURL = this._service.apiServerUrl+"/"+this._constants.API_ENDPOINT.userPermissionData+'?userType='+this.userType+'&id='+this.userID;
    }
    console.log("@Request Menu URL: ", reqURL);

    this._service.getwithoutData(reqURL)
    .subscribe(
      res => {
        this.dashMenu = res['menu'];
        // let getTypeMenu = this.dashMenu.find(rec => rec.type === this.userType);
        // this.dashMenu = getTypeMenu;
        
        // console.log(this.dashMenu,'APPLICATIONAPPLICATION');
        this.accrCount = this.userType == 'operations' ? res['applicationCount'].accrCount : '';
        this.registrationCount = this.userType == 'operations' ? res['applicationCount'].registerCount : '';
        this.trainingCount = this.userType == 'operations' ? res['applicationCount'].trainingCount : '';

        if(this.dashMenu != null) {
          this.dashMenu.forEach((res,key) => {
            // this.dashMenu[key]['icon'] = res.title == 'APPLICATION' ? 'icon-doc' : 'icon-dashboard';
            // this.dashMenu[key]['icon'] = res.title == 'STATUS' ? 'icon-doc' : 'icon-dashboard';
            // this.dashMenu[key]['icon'] = res.title == 'EVENTS' ? 'icon-doc' : 'icon-dashboard';
            // this.dashMenu[key]['icon'] = res.title == 'ACCOUNTS' ? 'icon-doc' : 'icon-dashboard';
            // this.dashMenu[key]['icon'] = res.title == 'DOCUMENTS' ? 'icon-doc' : 'icon-dashboard';
            // this.dashMenu[key]['icon'] = res.title == 'PROFILE' ? 'icon-doc' : 'icon-dashboard';
            if(res.title == 'APPLICATION'){
              this.dashMenu[key]['icon'] = 'icon-doc-diff';
            }else if(res.title == 'STATUS'){
              this.dashMenu[key]['icon'] = 'icon-doc-write';
            }else if(res.title == 'EVENTS'){
              this.dashMenu[key]['icon'] = 'icon-calendar';
            }else if(res.title == 'ACCOUNTS'){
              this.dashMenu[key]['icon'] = 'icon-doc-attach';
            }else if(res.title == 'DOCUMENTS'){
              this.dashMenu[key]['icon'] = 'icon-money';
              this.dashMenu[key]['menuLink'] = 'documents';
            }else if(res.title == 'PROFILE'){
              this.dashMenu[key]['icon'] = 'icon-user-dash';
            }else if(res.title == 'MESSAGES'){
              this.dashMenu[key]['icon'] = 'icon-email';
            }
            // else if(res.title == 'APPLICATION' && ){

            // }
            else{
              this.dashMenu[key]['icon'] = 'icon-dashboard';
            }

          })
        }
        // console.log(this.dashMenu,'dashMenu');
      })
  }

  dynamicsopenClose(id,status)
  {
    if(status == 'open')
    {
      this.isdDynamicsopenClose = id;
    }else if(status == 'close'){
      this.isdDynamicsopenClose = '0';
    }
    // console.log(this.isdDynamicsopenClose);
    // console.log(status);
  }

  accDropDown(itemHeading: string) { 
    // let menuToggle: any =[];
    // menuToggle = this.dashMenu;
    // menuToggle.menu.forEach(rec => {
    //      if(rec.heading === itemHeading && rec.submenu.length> 0){
    //         rec.sub = !rec.sub;
    //      }
    // })
    this.currentTitle = itemHeading;
  }

  createLink(link: string){
      if(link === '#'){
        return "javascript:void(0);"
      }
      return link;
  }
  goToParentLink(link: any,menuLink:any) {
    if(link!== '#' && menuLink !='documents'){
      this._router.navigateByUrl('dashboard/'+link);
    }else if(link!== '#' && menuLink =='documents'){
      // this._router.navigateByUrl('https://eiac.gov.ae/documents/publications');
      window.open('https://eiac.gov.ae/documents/publications', '_blank');
    }
  }

  goToLink(link: any){
    if(link !== '#'){      
      this._router.navigateByUrl(link);
    }
  }
}
