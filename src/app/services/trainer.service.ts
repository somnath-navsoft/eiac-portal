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
  paymentVoucherSave(postData: any){
    const url = `${this.BASE_REQ_URL}` + this._constants.API_ENDPOINT.paymentDetailsSave;
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
  let url = `${this._service.apiServerUrl}` + '/' + this._constants.API_ENDPOINT.trainerAccredServList; 
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
