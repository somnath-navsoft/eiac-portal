import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/services/constant.service';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { HostListener, ElementRef } from '@angular/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-testing-calibration-form',
  templateUrl: './testing-calibration-form.component.html',
  styleUrls: ['./testing-calibration-form.component.scss']
})
export class TestingCalibrationFormComponent implements OnInit {

  public newRow: any = {};
  public testingCalForm: any = {};
  public testingCalFormFile: any = new FormData();
  public ownOrgBasicInfo: Array<any> = [];
  public ownOrgMembInfo: Array<any> = [];
  public proficiencyTesting: Array<any> = [];
  public accreditationInfo: Array<any> = [];
  public technicalManager: any = {};
  public managementManager: any = {};
  public testingLabInfo:any={part1:[],part2:[]};
  public calLabInfo:any={part1:[],part2:[]};
  public medicaMainlLabInfo:Array<any>=[];
  public testingLabScopeFields:Array<any>=[];
  public calLabScopeFields:Array<any>=[];
  public testingLabData:any={part1:[],part2:[]};
  public calLabData:any={part1:[],part2:[]};
  public testingLabFirstData:Array<any>=[];
  public calLabFirstData:Array<any>=[];
  public countryList:Array<any>=[];
  public labTypeList:Array<any>=[];

  public orgMembToggle: boolean = false;
  public is_bod: boolean = false;
  public checkSecurity:boolean = false;
  public checkCaptchaValidation:boolean = false;
  public banner:any=[];
  public loader:boolean=true;
  public selectedValuesTl1:Array<any>=[];
  public selectedValuesTl2:Array<any>=[];
  public selectedValuesCl1:Array<any>=[];
  public selectedValuesCl2:Array<any>=[];
  public selectedValuesData:any={common_data:{},testingLab:{part1:[],part2:[]},calLab:{part1:[],part2:[]}};
  public testingLabScopeData:any = {part1:{},part2:{}};
  public calLabScopeData:any = {part1:{},part2:{}};
  public testingCalLabScopeData:any = {};
  accreditationTypeId:any;
  selectedFood1: string;
  selectedFood2: string;
  testingLabRowCount1:number=1;
  testingLabRowCount2:number=1;
  calLabRowCount1:number=1;
  calLabRowCount2:number=1;
  field2:number=2;
  public authorizationList:any;
  public authorizationStatus: boolean = false;
  public isSubmit:boolean = false;
  public addMinutesToTime:any;
  public file_validation: boolean = true;
  public minDate;
  authorization_confirm2:any;
  searchCountryLists:any;
  allCityByCountry: any = [];
  getCountryLists:any;
  onbehalf_representative_date:boolean = false;

  afterSubmit:boolean = false;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  // version = VERSION;
  dutyTime1: boolean = true;
  dutyTime2: boolean = true;
  dutyTime3: boolean = true;
  @ViewChild('mydiv', null) mydiv: ElementRef;
  @ViewChild('captchaRef',{static:true}) captchaRef: RecaptchaComponent;
  @HostListener('scroll', ['$event.target'])
  scrollHandler(elem) {
    if(elem != undefined){
      //console.debug("Scroll Event: ", elem.srcElement.scrollHeight, " == [ ",elem.srcElement.offsetHeight, " - ",elem.srcElement.scrollTop," ]"  );
      if(( elem.srcElement.offsetHeight + elem.srcElement.scrollTop) >=  elem.srcElement.scrollHeight) {
         ////console.log("Yo have reached!");
         this.authorizationList.authorization_confirm2 = true;
      }
    }        
  }

  constructor(public Service: AppService, public constant:Constants,public router: Router,public toastr: ToastrService) { }

  getData(getVal){
    //  console.log(">>>>Get MapBox Value: ", getVal);
     this.Service.mapboxToken = getVal;
  }

  scrollForm(el: HTMLElement)
  {
    //this.vps.scrollToAnchor(el);
    el.scrollIntoView({behavior: 'smooth'});
  }
  
  onChange(prevFieldId,row,curField,field,tableType,tableSection) {

      let ScopeData = 'ScopeData';
      let ScopeFields = 'ScopeFields';
      let Data = 'Data';
      if(tableType == 'testingLab'){
        var selectedValueObj = this['selectedValuesTl'+tableSection][row-1] ? this['selectedValuesTl'+tableSection][row-1] : {};
        var selectedValueObj2 = this.selectedValuesData[tableType]['part'+tableSection][row-1] ? this.selectedValuesData[tableType]['part'+tableSection][row-1] : {};
        selectedValueObj[curField] = prevFieldId.value;
      }
      else{
        var selectedValueObj = this['selectedValuesCl'+tableSection][row-1] ? this['selectedValuesCl'+tableSection][row-1] : {};
        var selectedValueObj2 = this.selectedValuesData[tableType]['part'+tableSection][row-1] ? this.selectedValuesData[tableType]['part'+tableSection][row-1] : {};
        selectedValueObj[curField] = prevFieldId.value;

      }

      let tempKey = ''

      if(curField=='field1'){
        tempKey = this[tableType+ScopeFields][0].id;
      }
      else if(curField=='field2'){
        tempKey = this[tableType+ScopeFields][1].id;
      }
      else if(curField=='field3'){
        tempKey = this[tableType+ScopeFields][2].id;
      }
      else if(curField=='field4'){
        tempKey = this[tableType+ScopeFields][3].id;
      }
      else if(curField=='field5'){
        tempKey = this[tableType+ScopeFields][4].id;
      }
      else if(curField=='field6'){
        tempKey = this[tableType+ScopeFields][5].id;
      }

      selectedValueObj2[tempKey] = prevFieldId.source.selected.viewValue;

      if(tableType == 'testingLab'){
        if(this['selectedValuesTl'+tableSection][row-1]){ 
          this['selectedValuesTl'+tableSection][row-1] = selectedValueObj;
          this.selectedValuesData['testingLab']['part'+tableSection][row-1] = selectedValueObj2;
        }
        else{ 
          this['selectedValuesTl'+tableSection].push(selectedValueObj);
          this.selectedValuesData['testingLab']['part'+tableSection].push(selectedValueObj2);
        }
      }
      else{

        if(this['selectedValuesCl'+tableSection][row-1]){
          this['selectedValuesCl'+tableSection][row-1] = selectedValueObj;
          this.selectedValuesData['calLab']['part'+tableSection][row-1] = selectedValueObj2;
        }
        else{
          this['selectedValuesCl'+tableSection].push(selectedValueObj);
          this.selectedValuesData['calLab']['part'+tableSection].push(selectedValueObj2);
        }

      }

      

      this[tableType+'RowCount'+tableSection] = row

      this.Service.put(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data,{'value_id':prevFieldId.value})
      .subscribe(
        res => {
          // if(res['banner'].length>0){
          //   this.banner = this.constant.mediaPath+res['banner'][0]['banner']['image'];
          // }
          
          if(field=='field2'){
            this[tableType+Data]['part'+tableSection][this[tableType+'RowCount'+tableSection]]['field2']=res['scopeValue']
          }
          else if(field=='field3'){
            //console.log('field3')
            this[tableType+Data]['part'+tableSection][row].field3=res['scopeValue']
          }
          else if(field=='field4'){
            this[tableType+Data]['part'+tableSection][row].field4=res['scopeValue']
          }
          else if(field=='field5'){
            this[tableType+Data]['part'+tableSection][row].field5=res['scopeValue']
          }
          else if(field=='field6'){
            this[tableType+Data]['part'+tableSection][row].field6=[{'field_value':'A','value':'A'},{'field_value':'B','value':'B'},{'field_value':'C','value':'C'}];
          }

          this.testingCalLabScopeData['testingCaldata'] = this.selectedValuesData;
          this.testingCalForm.testingCalLabScopeData = this.testingCalLabScopeData

          //console.log("LOggggg==>");
          //console.log(this.selectedValuesData);

        },
        error => {
        
    })
  }

  ngOnInit() { 
    
    // this.titleService.setTitle('EIAC - Testing and Calibration Laboratories');
    this.addMinutesToTime = this.Service.addMinutesToTime();
    this.loadData();
    this.loadFormDynamicTable();
    // this.loadCountryStateCity();
    //this.checkCaptchaValidation = true;
    
    this.loader = false;

  }

  // idToName(title,val) {
  //   if(title == 'country')
  //   {
  //     //this.country_name = val;
  //     this.testingCalForm.country_name = val;
  //     this.loadCountryCity(this.testingCalForm.country_name);
  //   }else{
  //     this.testingCalForm.accredation_type_name = val;
  //   }
    
  // }
  
  getPlaceName()
  {
    if(typeof this.testingCalForm.search_location_name != 'undefined')
    {
      this.Service.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.testingCalForm.search_location_name+'.json?access_token='+this.Service.mapboxToken+'','')
        .subscribe(res => {
            // //console.log(res['features']);
            this.searchCountryLists = res['features'];
          },
          error => {
          
      })
    }
  }

  getLatitudelongitude(longitude,latitude)
  {
    this.testingCalForm.location_longitude = longitude;
    this.testingCalForm.location_latitude = latitude;
  }
  
  resolvedSecurity(captchaResponse: string) {
    let captchaStatus   =  captchaResponse;
    if(captchaStatus != ''){
      this.checkSecurity = true;
      this.checkCaptchaValidation = true;
    }
    //console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  bod_toggle(value){
    this.is_bod = value;
  }
  loadFormDynamicTable(){
    this.ownOrgBasicInfo  =   [{}];
    this.ownOrgMembInfo = [{}];
    this.accreditationInfo = [{}];
    this. proficiencyTesting =[{}];
    this.testingLabInfo={part1:[{}],part2:[{}]};
    this.calLabInfo={part1:[{}],part2:[{}]};
    this.medicaMainlLabInfo=[{}];
    
    this.testingCalForm.organizationBasicInfo    = this.ownOrgBasicInfo;
    this.testingCalForm.organizationMemberInfo   = this.ownOrgMembInfo;
    this.testingCalForm.accreditationInfo        = this.accreditationInfo;
    this.testingCalForm.proficiencyTesting       = this.proficiencyTesting;
    this.testingCalForm.technicalManager         = this.technicalManager;
    this.testingCalForm.managementManager        = this.managementManager;
    this.testingCalForm.testingLabInfo           = this.testingLabInfo;
    this.testingCalForm.calLabInfo               = this.calLabInfo;
    this.testingCalForm.medicaMainlLabInfo        = this.medicaMainlLabInfo;
    this.authorizationList = {authorization_confirm1:false,authorization_confirm2:false,authorization_confirm3:false,undertaking_confirm1:false,undertaking_confirm2:false,undertaking_confirm3:false,undertaking_confirm4:false,undertaking_confirm5:false,undertaking_confirm6:false,undertaking_confirm7:false,undertaking_confirm8:false,undertaking_confirm9:false};

  }
  setexDate(){
    let cdate =this.testingCalForm.date_of_issue;
    this.minDate = new Date(cdate  + (60*60*24*1000));
  }
  loadData(){
    this.Service.get(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data,'')
    .subscribe(
      res => {
        this.testingLabScopeFields = res['testLabScopeFields'];
        this.calLabScopeFields = res['calLabScopeFields'];
        this.countryList = res['allCountry'];
        this.labTypeList = res['allLabtype'];
        //Testing Scope
        Object.keys(res['scopeValueTl']).forEach(key => {
          
          this.testingLabData['part1'][this.testingLabRowCount1] = {}
          this.testingLabData['part2'][this.testingLabRowCount2] = {}
          this.testingLabData['part1'][this.testingLabRowCount1].field1 = res['scopeValueTl'][key].values;
          this.testingLabData['part2'][this.testingLabRowCount2].field1 = res['scopeValueTl'][key].values;
          this.testingLabFirstData = res['scopeValueTl'][key].values;

        });

        //Calibration Scope

        Object.keys(res['scopeValueCl']).forEach(key => {
          
          this.calLabData['part1'][this.calLabRowCount1] = {}
          this.calLabData['part2'][this.calLabRowCount2] = {}
          this.calLabData['part1'][this.calLabRowCount1].field1 = res['scopeValueCl'][key].values;
          this.calLabData['part2'][this.calLabRowCount2].field1 = res['scopeValueCl'][key].values;
          this.calLabFirstData = res['scopeValueCl'][key].values;
        });
        //console.log("========>");
        //console.log(this.testingLabData);

      },
      error => {
      
  })

    if(this.testingLabScopeFields.length<1){
      this.testingLabScopeFields=  [{},{},{},{},{},{}];
    }
  }
  
  validateFile(fileEvent: any) {
    var file_name = fileEvent.target.files[0].name;
    var file_exe = file_name.substring(file_name.lastIndexOf('.')+1, file_name.length);
    var ex_type = ['pdf','png'];
    var ex_check = this.Service.isInArray(file_exe,ex_type);
    if(ex_check){
      this.testingCalForm.trade_license_name = fileEvent.target.files[0].name;
      this.testingCalFormFile.append('trade_license_file',fileEvent.target.files[0]);
      this.file_validation = true;
      return true;
    }
    else{
      this.file_validation = false;
      return false;
    }
}
  //organizationArray
  addRow(obj: any = [],type?: string){
    if(type != '' && type != undefined){
      //console.log('1st')
      let getIndex    =   obj.findIndex(rec => rec.type == type);
      this.newRow     =   {};
      obj[getIndex].data.push(this.newRow);
    }
    if(type === '' || type == undefined){
      let objlength = obj.length+1;
      this.testingLabData['part1']['row'+objlength]={};
      this.testingLabData['part1']['row'+objlength].field1 = this.testingLabFirstData;
      this.newRow     =   {};
      obj.push(this.newRow);
    }
      
    return true;
  }

  addMLRow(obj: any = [],type: string,tableType: string,tableSection: string){ 

    this[tableType+'RowCount'+tableSection]++;
    if(type === '' || type == undefined){
      let objlength = obj.length+1;
      this[tableType+'Data']['part'+tableSection][this[tableType+'RowCount'+tableSection]]=[];
      this[tableType+'Data']['part'+tableSection][this[tableType+'RowCount'+tableSection]].field1 = this[tableType+'FirstData'];
      this.newRow     =   {};
      obj.push(this.newRow);
    }
    return true;
  }

  
  showHideMembInfo(data){
    this.orgMembToggle  = data.checked;
  }

  accreditationType (id){
    this.accreditationTypeId = id;
    //this.testingCalForm.laboratory_type_name = title;
  }

  accreditationRequired(title) {
    this.testingCalForm.accredation_type_name = title;
  }

  onSubmit(ngForm){
    ////console.log(this.testingCalForm);
    // if(this.checkSecurity == true)
    // {
    //   this.checkCaptchaValidation = true;
    // }else{
    //   this.checkCaptchaValidation = false;
    // }
    // if(!this.testingCalForm.authorization_confirm1){
    //   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }
    // if(!this.testingCalForm.authorization_confirm2){
    //   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }
    // if(!this.testingCalForm.authorization_confirm3){
    //   this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }
    // if(!this.testingCalForm.recommend_confirm){
    //   this.toastr.error('Please Check Recommend Confirm ', '');
    // }
    this.authorizationStatus = true;
    this.isSubmit = true;
    this.afterSubmit = true;
    Object.keys(this.authorizationList).forEach(key => {
      if(this.authorizationList[key]==false){
        //console.log(this.authorizationList[key])
        this.authorizationStatus = false;
      }
    })
    if(!this.authorizationStatus){
      this.isSubmit = false;
      this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    }
    // if(!this.Service.checkInput('email',this.testingCalForm.mailing_address)){
    //   this.isSubmit = false;
    //   //this.toastr.error('Please Check All Authorization of the Application Confirm ', '');
    // }

    if(this.testingCalForm.duty_shift == '1' && typeof this.testingCalForm.duty_from1 == 'undefined' && typeof this.testingCalForm.duty_to1 == 'undefined')
    {
      ////console.log();
      this.dutyTime1 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime1 = true;
    }
    if(this.testingCalForm.duty_shift == '2' && typeof this.testingCalForm.duty_from2 == 'undefined' && typeof this.testingCalForm.duty_to2 == 'undefined')
    {
      if(typeof this.testingCalForm.duty_from1 == 'undefined' || typeof this.testingCalForm.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
      }
      this.dutyTime2 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime2 = true;
    }
    if(this.testingCalForm.duty_shift == '3' && typeof this.testingCalForm.duty_from3 == 'undefined' && typeof this.testingCalForm.duty_to3 == 'undefined')
    {
      if(typeof this.testingCalForm.duty_from1 == 'undefined' || typeof this.testingCalForm.duty_to1 == 'undefined')
      {
        this.dutyTime1 = false;
      }else{
        this.dutyTime1 = true;
      }
      if(typeof this.testingCalForm.duty_from2 == 'undefined' || typeof this.testingCalForm.duty_to2 == 'undefined')
      {
        this.dutyTime2 = false;
      }else{
        this.dutyTime2 = true;
      }
      ////console.log();
      this.dutyTime3 = false;
      this.isSubmit = false;
    }else{
      this.dutyTime3 = true;
    }

    if(ngForm.form.valid && this.checkCaptchaValidation == true){
      this.testingCalForm.is_bod = this.is_bod;
      this.testingCalFormFile.append('data',JSON.stringify(this.testingCalForm));
      this.loader = true;
       this.Service.post(this.Service.apiServerUrl+"/"+this.constant.API_ENDPOINT.testing_cal_form_basic_data,this.testingCalFormFile)
       .subscribe(
         res => {
           if(res['status']==true){
            this.loader = false;
            this.captchaRef.reset();
            this.checkCaptchaValidation = false;
            this.afterSubmit = false;
             this.toastr.success(res['msg'], '');
             this.router.navigate(['application-form/service/testing_calibration']);
           }
           else{
             this.toastr.error(res['msg'],'')
           }
         },
         error => {
           this.toastr.error('Something went wrong','')
     })
     }
     else{
       this.toastr.warning('Please Fill required field','')
     }
  }

  dayTimeChange(event,dayTime)
  {
    ////console.log(dayTime);
    if(event.value != '' && dayTime == '1')
    {
      this.dutyTime1 = true;
    }
    if(event.value != '' && dayTime == '2')
    {
      this.dutyTime2 = true;
    }
    if(event.value != '' && dayTime == '3')
    {
      this.dutyTime3 = true;
    }
  }

  // openDialog(obj: any, index: number) {
  //   const dialogRef = this.dialog.open(DialogBoxComponent,{
  //     data:{
  //       message: 'Are you sure want to delete?',
  //       buttonText: {
  //         ok: 'Yes',
  //         cancel: 'No'
  //       },
  //       obj:obj,
  //       index:index,
  //     }
  //   });
  // }

  removeRow(obj: any, index: number, type?:string){

    if(type === '' || type == undefined){
      obj.splice(index, 1);
    }    
    return true;
  }

  // openAuthorizationDialog() {
  //   const dialogRef = this.dialog.open(DialogBoxComponent,{
  //     data:{
  //       message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //       buttonText: {
  //         ok: 'Accept',
  //         cancel: 'Cancel'
  //       },
  //       obj:'',
  //       index:'',
  //       authorization_checked:true,
  //     },
  //     height: '300px',
  //     width: '600px',
  //   });
  //   dialogRef.afterClosed().pipe(
  //     filter(name => name)
  //   ).subscribe(name => {
  //     this.authorization_confirm2 = name.authorization;
  //     this.authorizationList.authorization_confirm2 = this.authorization_confirm2;
  //   })
  // }

}
