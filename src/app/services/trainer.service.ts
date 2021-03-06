import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { User } from '../models/user';

import { AppService } from '../services/app.service';
import { Constants } from '../services/constant.service';
   
@Injectable()

export class TrainerService {
  
  public BASE_REQ_URL = this._service.apiRequestUrl;
  constructor(private http: HttpClient, private _service: AppService, private _constants: Constants) {
  }

  //Get certificate List
  getCertificateList(page: number=0, limit: number=10){
    let url = `${this.BASE_REQ_URL}` + 'webservice/cab_certificate_list/?offset='+page+'&limit='+limit;
    //console.log(">>>Certif List: ", url);
    return this.http.get(url, this._service.getReqHeaders());
  }

  getEnquiriesList(page: number=1, limit: number=10, params: string){
    let url = `${this.BASE_REQ_URL}` + 'webservice/enquiry-list/?page='+page+'&limit='+limit+'&enquiry_for='+params;
    //console.log(">>>Enquiries List: ", url);
    return this.http.get(url, this._service.getReqHeaders());
  }

  //Get certificate List
  getRecordList(page: number=0, limit: number=10){
    let url = `${this.BASE_REQ_URL}` + 'webservice/record_list/?offset='+page+'&limit='+limit;
    //console.log(">>>Records List: ", url);
    return this.http.get(url, this._service.getReqHeaders());
  } 

  getCertificateType(){
    let url = `${this.BASE_REQ_URL}` + 'webservice/cab_directory_by_service/?status=all&language_id=1';
    return this.http.get(url, this._service.getReqHeaders());
  }

  searchCertificateList(params: any): any{
    let url = `${this.BASE_REQ_URL}` + 'webservice/cab_certificate_list/?'+params;
    return this.http.get(url, this._service.getReqHeaders());
  }

  searchRecordList(params: any): any{
    let url = `${this.BASE_REQ_URL}` + 'webservice/record_list/?'+params;
    return this.http.get(url, this._service.getReqHeaders());
  }


  //Get Trainer Page Details
  getTrainerPageDetails(){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCoursePageDetails;
    return this.http.get(url, this._service.getReqHeaders());
  }
  
  //Get Trainer Course Details
  getTrainerCourseTypeDetails(){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCourseTypeDetails;
    return this.http.get(url, this._service.getReqHeaders());
  }
  //Get Trainer Course
  getTrainerCourseAll(){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.allCourse;
    return this.http.get(url, this._service.getReqHeaders());
  }
  //Delete Trainer Course By Id
  deleteTrainerCourseByID(id: number){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCourseDelete + id;
    //console.log(">>> GET DELETE URL: ", url);
    return this.http.delete(url, this._service.getReqHeaders());
  }
  //Get Trainer Course Details By Id
  getTrainerCourseByID(id: number){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCourseByID + id;
    //console.log(">>> GET URL: ", url);
    return this.http.get(url, this._service.getReqHeaders());
  }
  getTrainerPublicCourse(){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.savePublicTrainingForm;
    return this.http.get(url, this._service.getReqHeaders());
  }
  //Get Trainer Public Course options
  getTrainerPublicCourseOptions(){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.allPublicCourseOptions;
    return this.http.get(url, this._service.getReqHeaders());
  }
  //Submit Voucher
  courseVoucherSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCourseVoucherSave;
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  //Submit Accounty type
  accountTypeSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.accountTypeSave;
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  //webservice/reg_status_change/2
  registrationVoucherSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCourseVoucherSave;
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  searchAccrStatus(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/seach-accrediation-service-status/all/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  searchEventlist(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/event-list/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  searchAccountlist(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/accounts/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  searchRegStatus(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/seach-registration-list/all/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }
  searchTrainerStatus(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/seach-training-list/all/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }
  //================================
  searchAccrServList(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/seach-accrediation-service-status/all/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }
  searchRegServList(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/seach-registration-list/all/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }
  searchTrainingServList(postData: any){
    const url = `${this.BASE_REQ_URL}` + 'webservice/seach-training-list/all/';
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }
  

  registrationDetailsService(id) {
    let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.registrationDetailsServ+id; 
    //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
    //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
    return this.http.get(url, this._service.getReqHeaders());
  }

  trainingDetailsServ(id) {
    let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.trainingDetailsServ+id; 
    //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
    //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
    return this.http.get(url, this._service.getReqHeaders());
  }

  paymentVoucherSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.paymentDetailsSave;
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  paymentVoucherSaveTrainers(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainingPaymentDetails;
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  paymentVoucherNOCSave(postData: any){ 
    const url = `${this.BASE_REQ_URL}` + "webservice/reg-payment-details-save/";
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }

  paymentVoucherSaveWap(postData: any){
    //const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.registrationPaymentDetails;
    const url = `${this.BASE_REQ_URL}` + "webservice/reg-payment-details-save/";
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }
  //Trainer service

  //proforma-step-accr/
  proformaAccrSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.proformaAccrSave;
    console.log(">>> Prodorma saving: ", url);
    return this.http.post(url, postData, this._service.getReqHeaders());
  }

  checkPaymentGateway(){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.paymentGateway; 
    console.log("GET PAyment URL: ", url, " -- ", this._service.getReqHeaders());
    return this.http.get(url, this._service.getReqHeaders());
  }


  accountPaymentSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.accountPaymentSave;
    return this.http.post(url, postData, this._service.getReqHeadersUpload());
  }


  //Apply Trainer Public Course
  applyTrainerPublicCourse(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.savePublicTrainingForm;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }
   
  //Save Trainer Public Course
  savePublicCourse(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.savePublicCourse;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }
  //Save Trainer Custom Course
  saveTrainerCourse(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.saveCourse;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }
  //Update Trainer Course
  updateTrainerCourse(postData: any, postId: number){  
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.updateCourse + postId + '/';
    //console.log("Update URL: ", url);
    return this.http.put(url, postData, this._service.getReqHeaders());
  }

  updateStatus(postId: number){  
    var postData = ''
    const url = `${this._service.apiServerUrl}`+"/"+this._constants.API_ENDPOINT.accrStatus + postId;
    //console.log("Update URL: ", url);
    return this.http.put(url, postData, this._service.getReqHeaders());
  }

  updateStatusReg(postId: number){  
    var postData = ''
    const url = `${this._service.apiServerUrl}`+"/"+this._constants.API_ENDPOINT.accrStatusReg + postId;
    //console.log("Update URL: ", url);
    return this.http.put(url, postData, this._service.getReqHeaders());
  }

  updateStatusTraining(postId: number){  
    var postData = ''
    const url = `${this._service.apiServerUrl}`+"/"+this._constants.API_ENDPOINT.accrStatusTraining + postId;
    //console.log("Update URL: ", url);
    return this.http.put(url, postData, this._service.getReqHeaders());
  }

  /******************************
  * Search Section
  * Start
  *  
  *******************************/

  //Search Course
  searchCourse(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.searchCourse;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }
  //Search Event
  searchEvent(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.searchTrainerEvent;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }
  //Search Attendance
  searchAttendance(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.searchTrainerAttendance;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }
  //Search Agenda
  searchAgenda(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.searchTrainerAgenda;
    return this.http.post(url, postData, this._service.getReqHeaders());
  }

  /******************************
  * Search Section
  * End
  *  
  *******************************/

  /******************************
  * Listing Section
  * Start
  *  
  *******************************/
  //Get Event Listing
  getEventList(){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerEventList; 
    //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
    return this.http.get(url, this._service.getReqHeaders());
 }
 //Get Accreditation Service Listing
 getAccreditationServiceList(){
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.trainerAccredServList+"all"; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

getRegistratationServiceList(){
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.registrationServList+"all"; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

getAllEventList(){
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.event_list; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

searchTargetAud(){
  const url = `${this.BASE_REQ_URL}` + 'webservice/search-get-dropdown/';
  return this.http.get(url, this._service.getReqHeaders());
}

getTrainingServiceList(){
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.trainingServList+"all"; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

getAccreditationStatusList(id) {
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.trainerAccredStaList+id; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

getApprovedList() {
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.approved_list; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

getAccountLists() {
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.accountLists; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}

getAccountDetails(id: number, type: any) {
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.accountDetails+id+'?applicationType='+type;
  return this.http.get(url, this._service.getReqHeaders());
}

trainerAccredDetailsServtrainerAccredDetailsServ(id){
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.trainerAccredDetailsServ+id; 
  //let url = this._service.apiServerUrl + this._constants.API_ENDPOINT.trainerAccredServList; 
  //console.log("GET Event URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}
 //Get Attendance Listing
 getAttendanceList(){
  let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerAttendanceList; 
  //console.log("GET Attendance URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}
//Get Agenda Listing
getAgendaList(){
  let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerAgendaList;
  //console.log("GET URL: ", url, " -- ", this._service.getReqHeaders());
  return this.http.get(url, this._service.getReqHeaders());
}
//Get Record Listing
getRecordAll(pagedata?:any){
    let url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.trainerCourse; 
  //  if(pagedata.page != undefined && pagedata.limit != undefined){
  //    url += '?_page='+pagedata.page+'&_limit=' + pagedata.limit;
  //  }
    //console.log("GET URL: ", url, " -- ", this._service.getReqHeaders());
    return this.http.get(url, this._service.getReqHeaders());
}
/******************************
  * Listing Section
  * End
  *  
  *******************************/
  /*
  //Save New Trainer
  saveNew(postData: any){
    const url = `${this.BASE_URL}` + this._constants.API_ENDPOINT.trainerAPI;
    return this.http.post(url, postData, this._service.getAuthHeaders());
  }

  
  //Save New Trainer
  update(postData: any, id: number){
    const url = `${this.BASE_URL}` + this._constants.API_ENDPOINT.trainerAPI + '/' + id;
    return this.http.put(url, postData, this._service.getAuthHeaders());
  }

  //Save New Trainer
  deleteRecord(id: number){
    const url = `${this.BASE_URL}` + this._constants.API_ENDPOINT.trainerAPI + '/' + id;
    return this.http.delete(url, this._service.getAuthHeaders());
  }

  //Get Record By ID
  getRecordByID(id: number){
      if(id){
        const url = `${this.BASE_URL}` + this._constants.API_ENDPOINT.trainerAPI + '/' + id;
        ////console.log("Edit URL: ", url);
        return this.http.get(url);
      }
  }
  */
  

}
