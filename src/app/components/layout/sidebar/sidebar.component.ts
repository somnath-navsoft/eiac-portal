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
  userEmail:any;
  currentTitle:any;
  
  constructor(private _constants:  Constants, private _service: AppService, 
              private _router: Router) { }

  ngOnInit() {
    this.userEmail = sessionStorage.getItem('email');
    this.userType = sessionStorage.getItem('type');
    this._service.getUserType();
    // this.userType = this._constants.logType;
   
    //console.log("Type menu: ", this.dashMenu);
    this.loadData();
  }

  loadData() {
    this._service.getwithoutData(this._service.apiServerUrl+"/"+this._constants.API_ENDPOINT.userPermissionData+'?userType='+this.userType+'&email='+this.userEmail)
    .subscribe(
      res => {
        this.dashMenu = res['menu'];
        console.log(this.dashMenu,'dashMenu');
        // let getTypeMenu = this.dashMenu.find(rec => rec.type === this.userType);
        // this.dashMenu = getTypeMenu;
      })
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
  goToLink(link: string){
    if(link !== '#'){
      this._router.navigateByUrl(link);
    }
  }
}
