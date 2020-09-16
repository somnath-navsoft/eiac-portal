import { Injectable } from '@angular/core';
import { MatSnackBar, MatDialog} from '@angular/material';

import { ViewerComponentComponent } from '../components/utility/viewer-component/viewer-component.component';

@Injectable()
export class UiDialogService {
    public title            : string  = "";
    public message          : string  = "";
    constructor(public snackBar: MatSnackBar, public dialog: MatDialog) { }
    

    showInfoDialog(message: string, duration: number, handler: any){
        this.snackBar.open(message, handler, {duration: (duration != null) ? duration : 4000, panelClass: ['info']});
    }
    showWarningDialog(message: string, duration: number, handler: any){
        this.snackBar.open(message, handler, {duration: (duration != null) ? duration : 4000, panelClass: ['warning']});
    }
    showErrorDialog(message: string, duration: number, handler: any){
        this.snackBar.open(message, handler, {duration: (duration != null) ? duration : 4000, panelClass: ['error']});
    }
    setMessage(mesg: string, duration: number, handler:any, type?: string) {
        switch(type){
            case 'info':
                this.showInfoDialog(mesg, duration, handler);
            break;

            case 'warning':
                this.showWarningDialog(mesg, duration, handler);
            break;

            case 'error':
                this.showErrorDialog(mesg, duration, handler);
            break;
            default:
                this.showErrorDialog(mesg, duration, handler);
            break;
        }
    }

    //Open HappinessDialog
    openPDFViewer(path: any,file: any) {
        var pathFile = path+file;
        // console.log('opening..pdf....', pathFile);
    this.dialog.open(ViewerComponentComponent,{
        data:{
            path: pathFile
        },
        height:'800px'
    });
    }

}