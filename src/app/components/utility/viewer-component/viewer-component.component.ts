import { Component, OnInit, Input, Inject,SecurityContext } from '@angular/core';
import { VERSION, MatDialogRef, MatDialog, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFProgressData, PDFDocumentProxy} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-viewer-component',
  templateUrl: './viewer-component.component.html',
  styleUrls: ['./viewer-component.component.scss']
})
export class ViewerComponentComponent implements OnInit {

  public path: string;
  public fileError: string = '';
  public pathURL: any;
  public loaderPdf: boolean = false;
  public completeLoaded: boolean = false;
  public errorLoader: boolean = false; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer,public dialogRef: MatDialogRef<ViewerComponentComponent>) { 
    //(<any>window).pdfWorkerSrc = '../../../../node_modules/pdfjs-dist/build/pdf.worker.js';
    if(this.data){
      console.log('dataa...', this.data);
      let pathValues : any;
      this.pathURL = this.data.path;// + "&output=embed";
      //let url = 'https://uat-service.eiac.gov.ae/media/publication/files/Accreditation%20Agreement.pdf';
      pathValues = this.getSantizeUrl(this.pathURL);//this.sanitizer.bypassSecurityTrustResourceUrl(this.data.path);
      // = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.path);
      //pathValues.changingThisBreaksApplicationSecurity;
      console.log('>>>path: ', pathValues);
      this.path = pathValues.changingThisBreaksApplicationSecurity;
      //this.path = sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.data.path);

      //console.log('PATH: ', this.getSantizeUrl(this.pathURL), " -- ", this.path);
    }

  }


  onError(error: any) {
    // do anything
    //console.log('PDF Error: ', error)
    this.errorLoader = true;
  }

  completeLoadPDF(pdfLoad: PDFDocumentProxy){
    //console.log("Completed Load PDF :: ", pdfLoad);
    this.loaderPdf = false;
    this.completeLoaded = true;
  }

  onProgress(progressData: PDFProgressData){
   //console.log("Loding Pdf :: ", progressData);
    this.loaderPdf = true;
  }

  getSantizeUrl(url : string) { 
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); 
  }

  loadError(){
    this.fileError = "File Exception Error";
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
