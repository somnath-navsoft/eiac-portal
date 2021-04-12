import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { Router} from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portal';
  userActivity;
  userInactive: Subject<any> = new Subject();
  //Set 30 min idle time
  userIdleTimeLogout: any = 1799900;//1800000 => 30min;
  constructor(private _router: Router,){
    this.setTimeout();
    this.userInactive.subscribe(() => console.log(`user has been inactive for 15s`));
  }
  setTimeout(): void {
    this.userActivity = setTimeout(() => {
      console.log(">>>Time lapse....");
      this.userInactive.next(undefined)
      localStorage.setItem('token', '');
      localStorage.setItem('type', '');
      localStorage.setItem('email','');
      window.top.location.href = '/sign-in';
    }, this.userIdleTimeLogout);
}

@HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
}
}
