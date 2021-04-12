import { NgModule, InjectionToken, } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AuthEffects } from './store/effects/auth.effects';
import { TrainerEffects } from './store/effects/trainer.effects';

import { reducers } from './store/app.states';
import { ErrorInterceptor } from './services/errorIntercept.service'
import * as fromRoot from './store/reducers/auth.reducers';
import { allTrainer } from './store/reducers/trainer.reducers';
import { from } from 'rxjs';

import { AuthService } from './services/auth.service';
import { UiDialogService } from './services/uiDialog.service';
import { AppComponent } from './app.component';
import { SnackbarModule } from 'ngx-snackbar';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { SigninComponent } from './components/signin/signin.component';
import { AppService } from './services/app.service';
import { TrainerService } from './services/trainer.service';

import { TrainersComponent } from './components/dashboard/trainers/trainers.component';
import { CabComponent } from './components/dashboard/cab/cab.component';
import { CandidateComponent } from './components/dashboard/candidate/candidate.component';
import { AssessorsComponent } from './components/dashboard/assessors/assessors.component';
import { AssessorsDashboardComponent } from './components/dashboard/assessors/assessors-dashboard/assessors-dashboard.component';
//import { EiacStaffComponent } from './components/dashboard/eiac-staff/eiac-staff.component';

//Trainers sub component
import { UpdateProfileComponent } from './components/dashboard/trainers/update-profile/update-profile.component';
import { QualificatiosComponent } from './components/dashboard/trainers/qualificatios/qualificatios.component';
import { ExpertiseComponent } from './components/dashboard/trainers/expertise/expertise.component';
import { AgreementsComponent } from './components/dashboard/trainers/agreements/agreements.component';
import { MyfilesComponent } from './components/dashboard/trainers/myfiles/myfiles.component';
import { TrainersHomeComponent } from './components/dashboard/trainers/trainers-home/trainers-home.component';
import { TrainersAddComponent } from './components/dashboard/trainers/trainers-home/trainers-add/trainers-add.component';
import { TrainersEditComponent } from './components/dashboard/trainers/trainers-home/trainers-edit/trainers-edit.component';
import { TrainerServiceComponent } from './components/dashboard/trainers/trainer-service/trainer-service.component';
import { TrainerServiceListComponent } from './components/dashboard/trainers/trainer-service-list/trainer-service-list.component';
import { TrainersDashboardComponent } from './components/dashboard/trainers/trainers-dashboard/trainers-dashboard.component';
import { TrainersEventListComponent } from './components/dashboard/trainers/trainers-event-list/trainers-event-list.component';
import { TrainersAttendanceListComponent } from './components/dashboard/trainers/trainers-attendance-list/trainers-attendance-list.component';
import { TrainersAgendaListComponent } from './components/dashboard/trainers/trainers-agenda-list/trainers-agenda-list.component';

import { CandidateDashboardComponent } from './components/dashboard/candidate/candidate-dashboard/candidate-dashboard.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { ToastContainerModule, ToastrModule, Overlay, OverlayContainer } from 'ngx-toastr';
import { RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
// import { OverlayModule } from "@angular/cdk/overlay";
import { OverlayModule } from "@angular/cdk/overlay";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Import your library
import { FormWizardModule } from 'angular-wizard-form';
import {
  MatStepperModule
} from '@angular/material';
import { ProfileCompletationComponent } from './components/profile-completation/profile-completation.component';
import { ClientCabProfileComponent } from './components/profile-completation/client-cab-profile/client-cab-profile.component';
import { CandidateProfileComponent } from './components/profile-completation/candidate-profile/candidate-profile.component';
import { TrainersProfileComponent } from './components/profile-completation/trainers-profile/trainers-profile.component';
import { AssessorsProfileComponent } from './components/profile-completation/assessors-profile/assessors-profile.component';
import { InternalOperationsProfileComponent } from './components/profile-completation/internal-operations-profile/internal-operations-profile.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/services/constant.service';
import { CabDashboardComponent } from './components/dashboard/cab/cab-dashboard/cab-dashboard.component';
import { CabTrainerServiceComponent } from './components/dashboard/cab/cab-trainer-service/cab-trainer-service.component';
import { CabTrainerServiceListComponent } from './components/dashboard/cab/cab-trainer-service-list/cab-trainer-service-list.component';
import { OperationsComponent } from './components/dashboard/operations/operations.component';
import { OperationsDashboardComponent } from './components/dashboard/operations/operations-dashboard/operations-dashboard.component';
import { OperationsTrainerServiceListComponent } from './components/dashboard/operations/operations-trainer-service-list/operations-trainer-service-list.component';
import { OperationsTrainerServiceComponent } from './components/dashboard/operations/operations-trainer-service/operations-trainer-service.component';
import { CandidateTrainerServiceComponent } from './components/dashboard/candidate/candidate-trainer-service/candidate-trainer-service.component';
import { CandidateTrainerServiceListComponent } from './components/dashboard/candidate/candidate-trainer-service-list/candidate-trainer-service-list.component';
import { CandidateAgendaListComponent } from './components/dashboard/candidate/candidate-agenda-list/candidate-agenda-list.component';
import { CandidateAttendanceListComponent } from './components/dashboard/candidate/candidate-attendance-list/candidate-attendance-list.component';
import { CustomModalComponent } from './components/utility/custom-modal/custom-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPayPalModule } from 'ngx-paypal';
import { StripeCheckoutModule } from 'ng-stripe-checkout';
import { CabTrainingApplicationComponent } from './components/dashboard/cab/cab-training-application/cab-training-application.component';
import { CabTrainingPublicCourseComponent } from './components/dashboard/cab/cab-training-public-course/cab-training-public-course.component';
import { CabTrainingInpremiseCourseComponent } from './components/dashboard/cab/cab-training-inpremise-course/cab-training-inpremise-course.component';
import { CabTrainingInpremiseCourseApplyComponent } from './components/dashboard/cab/cab-training-inpremise-course-apply/cab-training-inpremise-course-apply.component';

import { CandidateTrainingApplicationComponent } from './components/dashboard/candidate/candidate-training-application/candidate-training-application.component';
import { CandidateTrainingPublicCourseComponent } from './components/dashboard/candidate/candidate-training-public-course/candidate-training-public-course.component';
import { ApplicationRegistrationComponent } from './components/dashboard/cab/application-registration/application-registration.component';
import { ApplicationAccreditationComponent } from './components/dashboard/cab/application-accreditation/application-accreditation.component';
import { NoObjectionFormComponent } from './components/dashboard/cab/application-registration/no-objection-form/no-objection-form.component';
import { WorkPermitFormComponent } from './components/dashboard/cab/application-registration/work-permit-form/work-permit-form.component';
import { InspectionBodiesFormComponent } from './components/dashboard/cab/application-accreditation/inspection-bodies-form/inspection-bodies-form.component';
import { TestingCalibrationFormComponent } from './components/dashboard/cab/application-accreditation/testing-calibration-form/testing-calibration-form.component';
import { CertificationBodiesFormComponent } from './components/dashboard/cab/application-accreditation/certification-bodies-form/certification-bodies-form.component';
import { HealthCareFormComponent } from './components/dashboard/cab/application-accreditation/health-care-form/health-care-form.component';
import { HalalConformityFormComponent } from './components/dashboard/cab/application-accreditation/halal-conformity-form/halal-conformity-form.component';
import { PtProvidersFormComponent } from './components/dashboard/cab/application-accreditation/pt-providers-form/pt-providers-form.component';
import { CabTrainingPublicCourseListComponent } from './components/dashboard/cab/cab-training-public-course-list/cab-training-public-course-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OperationMessageComponent } from './components/dashboard/operations/operation-message/operation-message.component';
import { OperationMessageDetailsComponent } from './components/dashboard/operations/operation-message/operation-message-details/operation-message-details.component';
import { OperationsAccreditationServiceListComponent } from './components/dashboard/operations/operations-accreditation-service-list/operations-accreditation-service-list.component';
import { MessageComponent } from './components/dashboard/message/message.component';
import { MessageDetailComponent } from './components/dashboard/message/message-detail/message-detail.component';
import { MessageDetailsComponent } from './components/dashboard/assessors/message-details/message-details.component';
import { CabMessageDetailsComponent } from './components/dashboard/cab/cab-message-details/cab-message-details.component';
import { CandidateMessageDetailsComponent } from './components/dashboard/candidate/candidate-message-details/candidate-message-details.component';
import { OperationsMessageDetailsComponent } from './components/dashboard/operations/operations-message-details/operations-message-details.component';
import { TrainersMessageDetailsComponent } from './components/dashboard/trainers/trainers-message-details/trainers-message-details.component';

import { ViewerComponentComponent } from './components/utility/viewer-component/viewer-component.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { OperationsAccreditationServiceDetailsComponent } from './components/dashboard/operations/operations-accreditation-service-details/operations-accreditation-service-details.component';
import { StatusComponent } from './components/dashboard/status/status.component';
import { AccountsComponent } from './components/dashboard/accounts/accounts.component';
import { AccountDetailsComponent } from './components/dashboard/accounts/account-details/account-details.component';
import { AccountUploadComponent } from './components/dashboard/accounts/account-upload/account-upload.component';
import { CabTrainingDetailComponent } from './components/dashboard/cab/cab-training-detail/cab-training-detail.component';
import { CabTrainingInpremiseDetailComponent } from './components/dashboard/cab/cab-training-inpremise-detail/cab-training-inpremise-detail.component';
import { CabTrainingInpremiseApplyDetailComponent } from './components/dashboard/cab/cab-training-inpremise-apply-detail/cab-training-inpremise-apply-detail.component';
import { CabTrainingInpremiseEventDetailsComponent } from './components/dashboard/cab/cab-training-inpremise-event-details/cab-training-inpremise-event-details.component';
import { CabTrainingInpremiseFormComponent } from './components/dashboard/cab/cab-training-inpremise-form/cab-training-inpremise-form.component';
import { MessageReplyComponent } from './components/dashboard/message/message-reply/message-reply.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { OperationsRegistrationServiceListComponent } from './components/dashboard/operations/operations-registration-service-list/operations-registration-service-list.component';
import { OperationsRegistrationServiceDetailsComponent } from './components/dashboard/operations/operations-registration-service-details/operations-registration-service-details.component';
import { OperationsTrainingServiceListComponent } from './components/dashboard/operations/operations-training-service-list/operations-training-service-list.component';
import { OperationsTrainingServiceDetailsComponent } from './components/dashboard/operations/operations-training-service-details/operations-training-service-details.component';

import { CabCompanyProfileComponent } from './components/dashboard/cab/cab-company-profile/cab-company-profile.component';
import { AssessorsCompanyProfileComponent } from './components/dashboard/assessors/assessors-company-profile/assessors-company-profile.component';
import { TrainerCompanyProfileComponent } from './components/dashboard/trainers/trainer-company-profile/trainer-company-profile.component';
import { CandidateCompanyProfileComponent } from './components/dashboard/candidate/candidate-company-profile/candidate-company-profile.component';
import { OperationsCompanyProfileComponent } from './components/dashboard/operations/operations-company-profile/operations-company-profile.component';

import { CabMessage } from './components/dashboard/cab/cab-message/cab-message.component';
import { RegistrationStatusComponent } from './components/dashboard/registration-status/registration-status.component';
import { TrainingStatusComponent } from './components/dashboard/training-status/training-status.component';
import { InpremiseApprovalListComponent } from './components/dashboard/operations/inpremise-approval-list/inpremise-approval-list.component';
import { InpremiseApprovalDetailsComponent } from './components/dashboard/operations/inpremise-approval-details/inpremise-approval-details.component';
import { SchemeListComponent } from './components/dashboard/cab/scheme-list/scheme-list.component';
import { SchemeListOperationsComponent } from './components/dashboard/operations/scheme-list/operations-scheme-list.component';
import { ServicesListOperationsComponent } from './components/dashboard/operations/services-list/operations-services-list.component';

import { EventListsComponent } from './components/dashboard/cab/event-lists/event-lists.component';
import { CertificationRecordsComponent } from './components/dashboard/cab/certification-records/certification-records.component';
import { ExportAsModule } from 'ngx-export-as';
import { FullCalendarModule } from 'ng-fullcalendar';
import { NgxFullCalendarModule } from 'ngx-fullcalendar';
import { OperationsCertificationsComponent } from './components/dashboard/operations/operations-certifications/operations-certifications.component'
import { UserIdleModule } from 'angular-user-idle';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
//Cab user sub component
//Cabdidate sub component
//Assessors sub component
//Eiac Staff sub component

@NgModule({
  declarations: [DashboardComponent, SignUpComponent, AppComponent, LayoutComponent, ViewerComponentComponent,
    HeaderComponent, FooterComponent, SidebarComponent, SigninComponent, TrainersComponent,
    CabComponent, CandidateComponent, AssessorsComponent, AssessorsDashboardComponent,
    UpdateProfileComponent, QualificatiosComponent, ExpertiseComponent, AgreementsComponent,
    MyfilesComponent, TrainersHomeComponent, TrainersAddComponent, TrainersEditComponent, TrainerServiceComponent, TrainerServiceListComponent, ProfileCompletationComponent, ClientCabProfileComponent, CandidateProfileComponent, TrainersProfileComponent, AssessorsProfileComponent, InternalOperationsProfileComponent,
    UpdateProfileComponent, QualificatiosComponent, ExpertiseComponent, AgreementsComponent,
    TrainerServiceComponent, TrainerServiceListComponent,
    MyfilesComponent, TrainersHomeComponent, TrainersAddComponent, TrainersEditComponent, VerifyAccountComponent, ForgotPasswordComponent, ResetPasswordComponent, MyfilesComponent, TrainersHomeComponent, TrainersAddComponent, TrainersEditComponent, TrainerServiceComponent, CabDashboardComponent, CabTrainerServiceComponent, CabTrainerServiceListComponent, OperationsComponent, OperationsDashboardComponent, OperationsTrainerServiceListComponent, TrainersDashboardComponent, CandidateDashboardComponent, OperationsTrainerServiceComponent, CandidateTrainerServiceComponent, CandidateTrainerServiceListComponent, TrainersEventListComponent, TrainersAttendanceListComponent, TrainersAgendaListComponent, CandidateAgendaListComponent, CandidateAttendanceListComponent, CustomModalComponent, ApplicationRegistrationComponent, ApplicationAccreditationComponent, NoObjectionFormComponent, WorkPermitFormComponent, InspectionBodiesFormComponent, TestingCalibrationFormComponent, CertificationBodiesFormComponent, HealthCareFormComponent, HalalConformityFormComponent, PtProvidersFormComponent, CabTrainingApplicationComponent, CabTrainingPublicCourseComponent, CabTrainingInpremiseCourseComponent, CandidateTrainingApplicationComponent,
    CabTrainingInpremiseCourseApplyComponent,
    CandidateTrainingPublicCourseComponent,
    CabTrainingPublicCourseListComponent,
    LoaderComponent,
    OperationMessageComponent,
    OperationMessageDetailsComponent,
    OperationsAccreditationServiceListComponent,
    MessageComponent,
    MessageDetailComponent,
    MessageDetailsComponent,
    CabMessageDetailsComponent,
    CandidateMessageDetailsComponent,
    OperationsMessageDetailsComponent,
    TrainersMessageDetailsComponent,
    OperationsAccreditationServiceDetailsComponent,
    StatusComponent,
    AccountsComponent,
    AccountDetailsComponent,
    AccountUploadComponent,
    CabTrainingDetailComponent,
    CabTrainingInpremiseDetailComponent,
    CabTrainingInpremiseApplyDetailComponent,
    CabTrainingInpremiseEventDetailsComponent,
    CabTrainingInpremiseFormComponent,
    MessageReplyComponent,
    TimeAgoPipe,
    OperationsRegistrationServiceListComponent,
    OperationsRegistrationServiceDetailsComponent,
    OperationsTrainingServiceListComponent,
    OperationsTrainingServiceDetailsComponent,
    CabCompanyProfileComponent,
    AssessorsCompanyProfileComponent,
    TrainerCompanyProfileComponent,
    CandidateCompanyProfileComponent,
    OperationsCompanyProfileComponent,
    CabMessage,
    RegistrationStatusComponent,
    TrainingStatusComponent,
    InpremiseApprovalListComponent,
    InpremiseApprovalDetailsComponent,
    SchemeListComponent,
    SchemeListOperationsComponent,
    ServicesListOperationsComponent,
    EventListsComponent,
    CertificationRecordsComponent,
    OperationsCertificationsComponent
  ],
  imports: [
    UserIdleModule.forRoot({idle: 5, timeout: 2}),
    CommonModule,
    FormsModule,
    NgxPayPalModule,
    StripeCheckoutModule,
    FullCalendarModule,
    NgxFullCalendarModule,
    PdfViewerModule,
    HttpClientModule,
    AppRoutingModule,
    AppMaterialModule,
    BrowserModule,
    NgxPaginationModule,
    FlashMessagesModule.forRoot(),
    RecaptchaModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SnackbarModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot(
      //   {
      //   timeOut: 5000,
      //   positionClass: 'toast-bottom-center',
      //   preventDuplicates: true,
      //   closeButton: true,
      //   progressBar: true,
      //   maxOpened: 1,
      //   autoDismiss: true,
      //   enableHtml: true
      // }
    ),
    // OverlayModule,
    ToastrModule.forRoot(),
    OverlayModule,
    NgbModule,
    FormWizardModule,
    MatStepperModule,
    ToastContainerModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([AuthEffects, TrainerEffects]),
    ExportAsModule,
  ],
  entryComponents: [ViewerComponentComponent],
  exports: [PdfViewerModule],
  //providers: [ AuthEffects, AuthService,AppService,TrainerService,],
  providers: [AuthEffects, AuthService, AppService, UiDialogService, Constants, TrainerService, ToastrService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, Overlay, OverlayContainer, {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeeY8cUAAAAAMnRpgc79Pj6XLN0wo-m1JJZt3ie',
      } as RecaptchaSettings,
    }, { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  bootstrap: [AppComponent]
})
//{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
export class AppModule { }

