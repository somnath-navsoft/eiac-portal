import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { SignUpComponent} from './components/sign-up/sign-up.component';
import { AuthGuard } from './services/guard/auth.guard.service';
import { AuthCheck } from './services/guard/auth.check.service';
import { SigninComponent} from './components/signin/signin.component';

//Trainers sub component
import { TrainersComponent } from './components/dashboard/trainers/trainers.component';
import { TrainersHomeComponent } from './components/dashboard/trainers/trainers-home/trainers-home.component';
  import { TrainersAddComponent } from './components/dashboard/trainers/trainers-home/trainers-add/trainers-add.component';
  import { TrainersEditComponent } from './components/dashboard/trainers/trainers-home/trainers-edit/trainers-edit.component';
import { UpdateProfileComponent } from './components/dashboard/trainers/update-profile/update-profile.component';
import { QualificatiosComponent } from './components/dashboard/trainers/qualificatios/qualificatios.component';
import { ExpertiseComponent } from './components/dashboard/trainers/expertise/expertise.component';
import { AgreementsComponent } from './components/dashboard/trainers/agreements/agreements.component';
import { MyfilesComponent } from './components/dashboard/trainers/myfiles/myfiles.component';
import { TrainerServiceComponent } from './components/dashboard/trainers/trainer-service/trainer-service.component';
import { TrainerServiceListComponent } from './components/dashboard/trainers/trainer-service-list/trainer-service-list.component';
import { TrainersDashboardComponent } from './components/dashboard/trainers/trainers-dashboard/trainers-dashboard.component';
import { TrainersEventListComponent } from './components/dashboard/trainers/trainers-event-list/trainers-event-list.component';
import { TrainersAttendanceListComponent } from './components/dashboard/trainers/trainers-attendance-list/trainers-attendance-list.component';
import { TrainersAgendaListComponent } from './components/dashboard/trainers/trainers-agenda-list/trainers-agenda-list.component';

//Operations sub component
import { OperationsComponent } from './components/dashboard/operations/operations.component';
import { OperationsDashboardComponent } from './components/dashboard/operations/operations-dashboard/operations-dashboard.component';
import { OperationsTrainerServiceListComponent } from './components/dashboard/operations/operations-trainer-service-list/operations-trainer-service-list.component';
import { OperationsTrainerServiceComponent } from './components/dashboard/operations/operations-trainer-service/operations-trainer-service.component';

//Assessors sub component
import { AssessorsComponent } from './components/dashboard/assessors/assessors.component'; 

//Cab sub component
import { CabComponent } from './components/dashboard/cab/cab.component';
import { CabDashboardComponent } from './components/dashboard/cab/cab-dashboard/cab-dashboard.component';
import { CabTrainerServiceComponent } from './components/dashboard/cab/cab-trainer-service/cab-trainer-service.component';
import { CabTrainerServiceListComponent } from './components/dashboard/cab/cab-trainer-service-list/cab-trainer-service-list.component';

//Candidate sub component
import { CandidateComponent } from './components/dashboard/candidate/candidate.component';
import { CandidateDashboardComponent } from './components/dashboard/candidate/candidate-dashboard/candidate-dashboard.component';
import { CandidateTrainerServiceComponent } from './components/dashboard/candidate/candidate-trainer-service/candidate-trainer-service.component';
import { CandidateTrainerServiceListComponent } from './components/dashboard/candidate/candidate-trainer-service-list/candidate-trainer-service-list.component';
import { CandidateAgendaListComponent } from './components/dashboard/candidate/candidate-agenda-list/candidate-agenda-list.component';
import { CandidateAttendanceListComponent } from './components/dashboard/candidate/candidate-attendance-list/candidate-attendance-list.component';

import { AssessorsDashboardComponent } from './components/dashboard/assessors/assessors-dashboard/assessors-dashboard.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfileCompletationComponent } from './components/profile-completation/profile-completation.component';
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

import { CabTrainingApplicationComponent } from './components/dashboard/cab/cab-training-application/cab-training-application.component';
import { CabTrainingPublicCourseComponent } from './components/dashboard/cab/cab-training-public-course/cab-training-public-course.component';
import { CabTrainingInpremiseCourseComponent } from './components/dashboard/cab/cab-training-inpremise-course/cab-training-inpremise-course.component';
import { CabTrainingInpremiseCourseApplyComponent } from './components/dashboard/cab/cab-training-inpremise-course-apply/cab-training-inpremise-course-apply.component';

import { CabTrainingPublicCourseListComponent } from './components/dashboard/cab/cab-training-public-course-list/cab-training-public-course-list.component';

import { CandidateTrainingApplicationComponent } from './components/dashboard/candidate/candidate-training-application/candidate-training-application.component';
import { CandidateTrainingPublicCourseComponent } from './components/dashboard/candidate/candidate-training-public-course/candidate-training-public-course.component';
import { OperationMessageComponent } from './components/dashboard/operations/operation-message/operation-message.component';
import { OperationMessageDetailsComponent } from './components/dashboard/operations/operation-message/operation-message-details/operation-message-details.component';
import { OperationsAccreditationServiceListComponent } from './components/dashboard/operations/operations-accreditation-service-list/operations-accreditation-service-list.component';
import { MessageComponent } from './components/dashboard/message/message.component';
import { MessageDetailComponent } from './components/dashboard/message/message-detail/message-detail.component';
import { OperationsMessageDetailsComponent } from './components/dashboard/operations/operations-message-details/operations-message-details.component';
import { CabMessageDetailsComponent } from './components/dashboard/cab/cab-message-details/cab-message-details.component';
import { TrainersMessageDetailsComponent } from './components/dashboard/trainers/trainers-message-details/trainers-message-details.component';
import { MessageDetailsComponent } from './components/dashboard/assessors/message-details/message-details.component';
import { CandidateMessageDetailsComponent } from './components/dashboard/candidate/candidate-message-details/candidate-message-details.component';
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
import { OperationsRegistrationServiceListComponent } from './components/dashboard/operations/operations-registration-service-list/operations-registration-service-list.component';
import { OperationsRegistrationServiceDetailsComponent } from './components/dashboard/operations/operations-registration-service-details/operations-registration-service-details.component';

import { CabCompanyProfileComponent } from './components/dashboard/cab/cab-company-profile/cab-company-profile.component';
import { AssessorsCompanyProfileComponent } from './components/dashboard/assessors/assessors-company-profile/assessors-company-profile.component';
import { TrainerCompanyProfileComponent } from './components/dashboard/trainers/trainer-company-profile/trainer-company-profile.component';
import { CandidateCompanyProfileComponent } from './components/dashboard/candidate/candidate-company-profile/candidate-company-profile.component';
import { OperationsCompanyProfileComponent } from './components/dashboard/operations/operations-company-profile/operations-company-profile.component';


import { CabMessage } from './components/dashboard/cab/cab-message/cab-message.component';
import { RegistrationStatusComponent } from './components/dashboard/registration-status/registration-status.component';
import { TrainingStatusComponent } from './components/dashboard/training-status/training-status.component';
import { OperationsTrainingServiceListComponent } from './components/dashboard/operations/operations-training-service-list/operations-training-service-list.component';
import { OperationsTrainingServiceDetailsComponent } from './components/dashboard/operations/operations-training-service-details/operations-training-service-details.component';
import { InpremiseApprovalListComponent } from './components/dashboard/operations/inpremise-approval-list/inpremise-approval-list.component';
import { InpremiseApprovalDetailsComponent } from './components/dashboard/operations/inpremise-approval-details/inpremise-approval-details.component';
import { SchemeListComponent } from './components/dashboard/cab/scheme-list/scheme-list.component';
import { SchemeListOperationsComponent } from './components/dashboard/operations/scheme-list/operations-scheme-list.component';
import { ServicesListOperationsComponent } from './components/dashboard/operations/services-list/operations-services-list.component';

import { EventListsComponent } from './components/dashboard/cab/event-lists/event-lists.component';
import { CertificationRecordsComponent } from './components/dashboard/cab/certification-records/certification-records.component';
import { OperationsCertificationsComponent } from './components/dashboard/operations/operations-certifications/operations-certifications.component'

const routes: Routes = [
  //{ path: 'log-in', component: LogInComponent, canActivate: [AuthCheck] },
  //component:DashboardComponent, canActivate: [AuthGuard],
  { path: 'sign-in', component: SigninComponent, canActivate: [AuthCheck] },
  { path: 'sign-in/:any', component: SigninComponent, canActivate: [AuthCheck] },
  { path: 'dashboard',canActivate: [AuthGuard], 
    children: [
      //Trainers
      { path: 'onboarding-message-list', component: MessageComponent, canActivate: [AuthGuard] },
      { path: 'status/:id', component: StatusComponent, canActivate: [AuthGuard] }, 
      { path: 'certifications', component:OperationsCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'registration-status', component: RegistrationStatusComponent, canActivate: [AuthGuard] }, 
      { path: 'training-status', component: TrainingStatusComponent, canActivate: [AuthGuard] }, 
      { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
      { path: 'account-details/:id/:any', component: AccountDetailsComponent, canActivate: [AuthGuard] },
      { path: 'account-upload/:id', component: AccountUploadComponent, canActivate: [AuthGuard] },
      //{ path: 'onboarding-message-list', component: MessageComponent, canActivate: [AuthGuard] },
      { path: 'message-detail/:id', component: MessageDetailComponent, canActivate: [AuthGuard] },
      { path: 'message-reply/:id', component: MessageReplyComponent, canActivate: [AuthGuard] },
      { path: 'records', component:CertificationRecordsComponent, canActivate: [AuthGuard] },
      { path: 'event-list', component:EventListsComponent, canActivate: [AuthGuard] },
      { path: 'trainers', component: TrainersComponent, canActivate: [AuthGuard],
        children: [
            { path: 'home', component:TrainersDashboardComponent, canActivate: [AuthGuard]},
            { path: 'company-profile', component:TrainerCompanyProfileComponent, canActivate: [AuthGuard] },
            { path: '', redirectTo:'home', pathMatch:'full'},
            { path: 'add', component:TrainersAddComponent, canActivate: [AuthGuard]},
            { path: 'edit/:id', component:TrainersEditComponent, canActivate: [AuthGuard]},
            { path: 'update-profile', component:UpdateProfileComponent, canActivate: [AuthGuard] },
            { path: 'qualifications', component:QualificatiosComponent, canActivate: [AuthGuard] },
            { path: 'expertise', component:ExpertiseComponent, canActivate: [AuthGuard] },
            { path: 'agreements', component:AgreementsComponent, canActivate: [AuthGuard] },
            { path: 'my-files', component:MyfilesComponent, canActivate: [AuthGuard] },
            { path: 'event-list', component:TrainersEventListComponent, canActivate: [AuthGuard] },
            { path: 'attendane-list', component:TrainersAttendanceListComponent, canActivate: [AuthGuard] },
            { path: 'agenda-list', component:TrainersAgendaListComponent, canActivate: [AuthGuard] },
            //{ path: 'training-apply', component:TrainerServiceComponent, canActivate: [AuthGuard] },
            //{ path: 'training-service', component:TrainerServiceListComponent, canActivate: [AuthGuard] },  
            { path: 'message-detail/:id', component:TrainersMessageDetailsComponent, canActivate: [AuthGuard] },          
          ]
    },

    //Eiac-staff - internal operations
    { path: 'operations', component: OperationsComponent, canActivate: [AuthGuard],
        children:[
          { path: '', redirectTo:'home', pathMatch:'full'},
          { path: 'home', component:OperationsDashboardComponent, canActivate: [AuthGuard]},
          { path: 'company-profile', component:OperationsCompanyProfileComponent, canActivate: [AuthGuard] },
          //{ path: 'certifications', component:OperationsCertificationsComponent, canActivate: [AuthGuard] },
          { path: 'training-apply/:id', component:OperationsTrainerServiceComponent, canActivate: [AuthGuard] },
          { path: 'training-service', component:OperationsTrainerServiceListComponent, canActivate: [AuthGuard] },
          { path: 'accreditation-service-list', component:OperationsAccreditationServiceListComponent, canActivate: [AuthGuard] },
          { path: 'accreditation-service-details/:id', component:OperationsAccreditationServiceDetailsComponent, canActivate: [AuthGuard] },
          { path: 'registration-service-list', component:OperationsRegistrationServiceListComponent, canActivate: [AuthGuard] },
          { path: 'registration-service-details/:id', component:OperationsRegistrationServiceDetailsComponent, canActivate: [AuthGuard] },
          { path: 'training-service-list', component:OperationsTrainingServiceListComponent, canActivate: [AuthGuard] },
          { path: 'training-service-details/:id', component:OperationsTrainingServiceDetailsComponent, canActivate: [AuthGuard] },
          { path: 'message', component:OperationMessageComponent, canActivate: [AuthGuard] },
          { path: 'message-detail/:id', component:OperationsMessageDetailsComponent, canActivate: [AuthGuard] },
          { path: 'inpremise-approve', component:InpremiseApprovalListComponent, canActivate: [AuthGuard] },
          { path: 'inpremise-approve-detail/:id', component:InpremiseApprovalDetailsComponent, canActivate: [AuthGuard] },
          { path: 'scheme-list', component:SchemeListOperationsComponent, canActivate: [AuthGuard] },  
          { path: 'service-enquiries-list', component:ServicesListOperationsComponent, canActivate: [AuthGuard] },
                  
        ] 
    }, 

    //Cab client
    { path: 'cab_client', component: CabComponent, canActivate: [AuthGuard],  
      children:[
        { path: '', redirectTo:'home', pathMatch:'full'},
        { path: 'home', component:CabDashboardComponent, canActivate: [AuthGuard]},
        { path: 'training-apply', component:CabTrainerServiceComponent, canActivate: [AuthGuard] },
        { path: 'training-apply/:id', component:CabTrainerServiceComponent, canActivate: [AuthGuard] },
        { path: 'training-course', component:CabTrainingApplicationComponent, canActivate: [AuthGuard] },
        { path: 'training-public-course-form', component:CabTrainingPublicCourseComponent, canActivate: [AuthGuard] },
        { path: 'training-public-course-form/:id', component:CabTrainingPublicCourseComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-form', component:CabTrainingInpremiseFormComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-form/:id', component:CabTrainingInpremiseFormComponent, canActivate: [AuthGuard] },
        { path: 'training-public-course-list', component:CabTrainingPublicCourseListComponent, canActivate: [AuthGuard] },
        { path: 'training-course-details/:id', component:CabTrainingDetailComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-details/:id', component:CabTrainingInpremiseDetailComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-event-details/:id', component:CabTrainingInpremiseEventDetailsComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-apply-details/:id', component:CabTrainingInpremiseApplyDetailComponent, canActivate: [AuthGuard] },

        { path: 'training-inpremise-course', component:CabTrainingInpremiseCourseComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-course-apply', component:CabTrainingInpremiseCourseApplyComponent, canActivate: [AuthGuard] },
        
        { path: 'training-service', component:CabTrainerServiceListComponent, canActivate: [AuthGuard] },
        { path: 'application-registration', component:ApplicationRegistrationComponent, canActivate: [AuthGuard] },
        { path: 'application-accreditation', component:ApplicationAccreditationComponent, canActivate: [AuthGuard] },
        { path: 'work-permit-form', component:WorkPermitFormComponent, canActivate: [AuthGuard] },
        { path: 'work-permit-form/:id', component:WorkPermitFormComponent, canActivate: [AuthGuard] },
        { path: 'no-objection-certificate-form', component:NoObjectionFormComponent, canActivate: [AuthGuard] },
        { path: 'no-objection-certificate-form/:id', component:NoObjectionFormComponent, canActivate: [AuthGuard] },
        { path: 'inspection-bodies-form', component:InspectionBodiesFormComponent, canActivate: [AuthGuard] },
        { path: 'inspection-bodies-form/:id', component:InspectionBodiesFormComponent, canActivate: [AuthGuard] },
        { path: 'testing-calibration-form', component:TestingCalibrationFormComponent, canActivate: [AuthGuard] },
        { path: 'testing-calibration-form/:id', component:TestingCalibrationFormComponent, canActivate: [AuthGuard] },
        { path: 'certification-bodies-form', component:CertificationBodiesFormComponent, canActivate: [AuthGuard] },
        { path: 'certification-bodies-form/:id', component:CertificationBodiesFormComponent, canActivate: [AuthGuard] },
        { path: 'health-care-form', component:HealthCareFormComponent, canActivate: [AuthGuard] },
        { path: 'health-care-form/:id', component:HealthCareFormComponent, canActivate: [AuthGuard] },
        { path: 'halal-conformity-form', component:HalalConformityFormComponent, canActivate: [AuthGuard] },
        { path: 'halal-conformity-form/:id', component:HalalConformityFormComponent, canActivate: [AuthGuard] },
        { path: 'pt-providers-form', component:PtProvidersFormComponent, canActivate: [AuthGuard] },
        { path: 'pt-providers-form/:id', component:PtProvidersFormComponent, canActivate: [AuthGuard] },
        { path: 'message-detail/:id', component:CabMessageDetailsComponent, canActivate: [AuthGuard] },
        { path: 'company-profile', component:CabCompanyProfileComponent, canActivate: [AuthGuard] },
        { path: 'onboarding-message-list', component:CabMessage, canActivate: [AuthGuard] },
        { path: 'scheme-list', component:SchemeListComponent, canActivate: [AuthGuard] },
      ]
    },

    //Assessors
    { path: 'assessors', component: AssessorsComponent, canActivate: [AuthGuard],
      children:[
        { path: '', redirectTo:'home', pathMatch:'full'},
        { path: 'home', component:AssessorsDashboardComponent, canActivate: [AuthGuard]},
        { path: 'message-detail/:id', component:MessageDetailsComponent, canActivate: [AuthGuard] },
        { path: 'company-profile', component:AssessorsCompanyProfileComponent, canActivate: [AuthGuard] },
      ]
    },
    //Candidate
    { path: 'candidate',component: CandidateComponent, canActivate: [AuthGuard],
      children:[
        { path: '', redirectTo:'home', pathMatch:'full'},
        { path: 'home', component:CandidateDashboardComponent, canActivate: [AuthGuard]},
        { path: 'training-apply', component:CandidateTrainerServiceComponent, canActivate: [AuthGuard] },
        { path: 'training-apply/:id', component:CandidateTrainerServiceComponent, canActivate: [AuthGuard] },
        { path: 'training-service', component:CandidateTrainerServiceListComponent, canActivate: [AuthGuard] },
        { path: 'attendane-list', component:CandidateAttendanceListComponent, canActivate: [AuthGuard] },
        { path: 'agenda-list', component:CandidateAgendaListComponent, canActivate: [AuthGuard] },
        { path: 'training-public-course', component:CandidateTrainingPublicCourseComponent, canActivate: [AuthGuard]},
        { path: 'training-course', component:CandidateTrainingApplicationComponent, canActivate: [AuthGuard] },
        { path: 'message-detail/:id', component:CandidateMessageDetailsComponent, canActivate: [AuthGuard] },
        { path: 'company-profile', component:CandidateCompanyProfileComponent, canActivate: [AuthGuard] },
      ]
    },

    ]
  },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthCheck] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthCheck] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthCheck] },
  { path: 'verify-account', component: VerifyAccountComponent, canActivate: [AuthCheck] },
  { path: 'profile-completion', component: ProfileCompletationComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'sign-in' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
