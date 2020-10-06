import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { Constants } from '../../../services/constant.service';
//Bootsrap Custom Modal
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent implements OnInit {
  modalOptions:NgbModalOptions;
  modalRef: BsModalRef;
  modelObj: TemplateRef<any>;
  rejectmessage:any;

  @Input() modalData: any;
  @Input() modalType: any;
  @Input() parent: any;
  // @Input() modalRef: any;
  @Input() onDeleteMessage: any;
  
  @Output() onDeleteAction : any = new EventEmitter();
  @Output() rejectMessageEvent:any = new EventEmitter();
  rejectObj:any = {};

  closeResult: string;
  constructor(private _service: AppService, private _constant: Constants, 
              private modalService: BsModalService, private _modalService: NgbModal) { 
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop',
      keyboard: false
    }
  }

  ngOnInit() { 
    //console.log("modsal...", this.modalType, " -- ", this.modalRef);
    if(this.modalType){
      switch(this.modalType){
          case 'delete':
            setTimeout(()=>{
              let elem = document.getElementById('openDialog');
              if(elem){
                elem.click();
              }
            }, 100)
          break;
          case 'reject':
            setTimeout(()=>{
              let elem = document.getElementById('openDialog'); 
              if(elem){
                elem.click();
              }
            }, 100)
          break;
      }
    }
  }

  //Modal Common Action
  closeAction(){
    //this.modalRef.hide();
    this._modalService.dismissAll();
    //Reset delete confirm from parent
    //
    if(this.parent && this.parent.deleteConfirm){
      this.parent.deleteConfirm = false;
    }else if(this.parent && this.parent.deleteEditScopeConfirm){
      this.parent.deleteEditScopeConfirm = false;
    }else if(this.parent && this.parent.deleteScopeConfirm){
      this.parent.deleteScopeConfirm = false;
    }else if(this.parent && this.parent.rejectedMessageId){
      this.parent.rejectedMessageId = false;
    }
    //Reset view confirm from parent
  }
  closeDialog(){
    let elem = document.getElementById('closeDialog');
    // console.log("close mmm: ", elem);    
    if(elem){
      elem.click();      
    }
  }
  openDialog(hashContent: any){
    // console.log("Open dialog....1");
    // this.modalRef = this.modalService.show(  
    //   hashContent,  
    //   Object.assign({}, { class: 'gray modal-lg' })  
    // );
    this._modalService.open(hashContent, this.modalOptions).result.then((result) => {
      //console.log("....1");
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //console.log("....2");
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      // console.log("Closed with ESC ");
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      // console.log("Closed with CLOSE ICON ");
      return 'by clicking on a backdrop';
    } else {
      // console.log("Closed ",`with: ${reason}`);
      return  `with: ${reason}`;
    }
  }

  //Delete Action
  deleteAction(){
    this.onDeleteAction.emit();
  }

  rejectAction(){
    // console.log(this.rejectmessage);
    this.rejectObj.message = this.rejectmessage;
    this.rejectObj.rejectId = 2;
    this.rejectMessageEvent.emit(this.rejectObj);
    this.closeDialog()
  }

}
