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
  constructor(private _constants:  Constants, private _service: AppService, 
              private _router: Router) { }

  ngOnInit() {
    this._service.getUserType();
    this.userType = this._constants.logType;
    this.dashMenu = this._constants.dashBoardMenu;
    let getTypeMenu = this.dashMenu.find(rec => rec.type === this.userType);
    this.dashMenu = getTypeMenu;
    //console.log("Type menu: ", this.dashMenu);
  }
  accDropDown(itemHeading: string) { 
    let menuToggle: any =[];
    menuToggle = this.dashMenu;
    menuToggle.menu.forEach(rec => {
         if(rec.heading === itemHeading && rec.submenu.length> 0){
            rec.sub = !rec.sub;
         }
    })
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
