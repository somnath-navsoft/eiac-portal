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

import { CabTrainingApplicationComponent } from './components/dashboard/cab/cab-training-application/cab-training-application.component';
import { CabTrainingPublicCourseComponent } from './components/dashboard/cab/cab-training-public-course/cab-training-public-course.component';
import { CabTrainingInpremiseCourseComponent } from './components/dashboard/cab/cab-training-inpremise-course/cab-training-inpremise-course.component';

import { CandidateTrainingApplicationComponent } from './components/dashboard/candidate/candidate-training-application/candidate-training-application.component';
import { CandidateTrainingPublicCourseComponent } from './components/dashboard/candidate/candidate-training-public-course/candidate-training-public-course.component';


const routes: Routes = [
  //{ path: 'log-in', component: LogInComponent, canActivate: [AuthCheck] },
  { path: 'sign-in', component: SigninComponent, canActivate: [AuthCheck] },
  { path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard],
    children: [
      //Trainers
      { path: 'trainers', component: TrainersComponent, canActivate: [AuthGuard],
        children: [
            { path: 'home', component:TrainersDashboardComponent, canActivate: [AuthGuard]},
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
          ]
    },

    //Eiac-staff - internal operations
    { path: 'operations', component: OperationsComponent, canActivate: [AuthGuard],
        children:[
          { path: '', redirectTo:'home', pathMatch:'full'},
          { path: 'home', component:OperationsDashboardComponent, canActivate: [AuthGuard]},
          { path: 'training-apply/:id', component:OperationsTrainerServiceComponent, canActivate: [AuthGuard] },
          { path: 'training-service', component:OperationsTrainerServiceListComponent, canActivate: [AuthGuard] },
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
        { path: 'training-public-course', component:CabTrainingPublicCourseComponent, canActivate: [AuthGuard] },
        { path: 'training-inpremise-course', component:CabTrainingInpremiseCourseComponent, canActivate: [AuthGuard] },
      ]
    },

    //Assessors
    { path: 'assessors', component: AssessorsComponent, canActivate: [AuthGuard],
      children:[
        { path: '', redirectTo:'home', pathMatch:'full'},
        { path: 'home', component:AssessorsDashboardComponent, canActivate: [AuthGuard]},
      ]
    },
    //Candidate
    { path: 'candidate', component: CandidateComponent, canActivate: [AuthGuard],
      children:[
        { path: '', redirectTo:'home', pathMatch:'full'},
        { path: 'home', component:CandidateDashboardComponent, canActivate: [AuthGuard]},
        { path: 'training-apply', component:CandidateTrainerServiceComponent, canActivate: [AuthGuard] },
        { path: 'training-apply/:id', component:CandidateTrainerServiceComponent, canActivate: [AuthGuard] },
        { path: 'training-service', component:CandidateTrainerServiceListComponent, canActivate: [AuthGuard] },
        { path: 'attendane-list', component:CandidateAttendanceListComponent, canActivate: [AuthGuard] },
        { path: 'agenda-list', component:CandidateAgendaListComponent, canActivate: [AuthGuard] },
        { path: 'training-public-course', component:CandidateTrainingPublicCourseComponent, canActivate: [AuthGuard] },
        { path: 'training-course', component:CandidateTrainingApplicationComponent, canActivate: [AuthGuard] },
      ]
    },

    ]
  },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthCheck] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthCheck] },
  { path: 'reset-password/:id', component: ResetPasswordComponent, canActivate: [AuthCheck] },
  { path: 'verify-account', component: VerifyAccountComponent, canActivate: [AuthCheck] },
  { path: 'profile-completation', component: ProfileCompletationComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'sign-in' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
