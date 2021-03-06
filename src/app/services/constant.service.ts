import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Output, EventEmitter}  from '@angular/core'; 
import { Subject} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class Constants{

	public apiUrl: string 					= '';

	public mediaPath: string 				= 'https://uat-service.eiac.gov.ae';

	public documentPath: string 			= 'https://eiac.gov.ae/documents/publications';
	public directoryPath: string 			= 'https://eiac.gov.ae/directory';

	//trainerAPI: '/trainer',
	//all_services: this.apiUrl + 'service_page/', 
	public myvalue: any;
	public API_ENDPOINT: any	=	{
		authToken:  '/api/token/',
		signUp: 'user-service/',

		trainerCourse: 'trainer/all-course-list',
		trainerEventList: 'trainer/event-list/',
		trainerAccredServList: 'accrediation-service-status/',
		registrationServList: 'registration-list/',
		trainerAccredDetailsServ: 'accrediation-details-show/',
		registrationDetailsServ: 'registration-details-show/',
		trainingDetailsServ: 'training-details-show/',
		registrationPaymentDetails: 'webservice/reg-payment-details-save/',
		trainingPaymentDetails: 'webservice/training-payment-details-save/',
		trainerAttendanceList:'trainer/attendance-list/',
		trainerAgendaList:'trainer/agenda-list/',
		trainerCourseByID: 'trainer/custom-course-dtls/',
		trainerCourseDelete: 'trainer/course-delete/',
		trainerCourseVoucherSave: 'webservice/proforma-details-save/',
		accountTypeSave: 'webservice/accounts-payment/',
		trainerCoursePageDetails : 'trainer/training-page-details/',
		trainerCourseTypeDetails: 'trainer/training-course-type/',
		trainingServList: 'training-list/',

		paymentDetailsSave: 'webservice/payment-details-save/',
		proformaAccrSave: 'webservice/proforma-step-accr/',
		accountPaymentSave: 'webservice/account-payment-save/',

		paymentGateway: 'webservice/payment_settings',

		savePublicTrainingForm:'trainer/training-application-form/',

		searchCourse: 'trainer/search-course/',
		searchTrainerEvent: 'trainer/search-event/',
		searchTrainerAttendance: 'trainer/search-attendance/',
		searchTrainerAgenda: 'trainer/search-agenda/',
		
		allCourse: 'trainer/course-list',
		allPublicCourseOptions: 'trainer/public-course-options',

		saveCourse: 'trainer/cust-course-save/',
		savePublicCourse: 'trainer/public-course-save/',   		
		updateCourse: 'trainer/cust-course-update/',
		emailVerification: 'user-email-verification/',
		profileService: 'profile-service/',
		service_details_page: 'pillar_page/',
		healthcare_form_basic_data: 'healthcare_form/',
		pt_provider: 'pt-provider-form/',
		testing_cal_form_basic_data: 'testing_calibration_form_management/',
		inspection_form_basic_data: 'inspection_body_form_management/',
		halal_conformity_form_management: 'halal_conformity_form_management/',
		approved_list: 'cust-course-event-list/all',

		criteriaIdByScope: this.apiUrl + 'criteria_wise_scope/',
		criteriaScope: this.apiUrl + 'inspection_body_form_management/?scheme=',
		paymentReceipt: 'payment-details-save/',
		userPermissionData: this.apiUrl + 'user-permission-data/',
		messageList: this.apiUrl + 'message-list/',
		profileApproval: this.apiUrl + 'profile-approval/',
		accrStatus: this.apiUrl + 'accr_status/',
		accrStatusReg: this.apiUrl + 'reg_status_change/',
		accrStatusTraining: this.apiUrl + 'training_status_change/',
		testingCalibration: this.apiUrl + 'testing_calibration_form_management/',
		certificationBodies: this.apiUrl + 'certification_bodies/',
		halalConfirmity: this.apiUrl + 'halal-conformity-form/',
		certificationBodiesForm: this.apiUrl + 'certification_bodies/',
		healthcareForm: this.apiUrl + 'healthcare_form/',
		ptProviderForm: this.apiUrl + 'pt-provider-form/',
		trainerAccredStaList: this.apiUrl + 'accrediation-service-status/',
		forgetPassword: this.apiUrl + 'user-password-reset-request/',
		userPasswordReset: this.apiUrl + 'user-password-reset/',
		accountLists: this.apiUrl + 'accounts/',
		accountDetails: this.apiUrl + 'account-details-show/',
		accrediationCsv: this.apiUrl + 'accrediation-csv/',
		registrationCsv: this.apiUrl + 'registration-csv/',
		registrationPdf: this.apiUrl + 'registration-pdf/',
		trainingCsv: this.apiUrl + 'training-csv/',
		accrediationPdf: this.apiUrl + 'accrediation-pdf/',
		trainingPdf: this.apiUrl + 'training-pdf/',
		workPermitform: this.apiUrl + 'workpermit_form/',
		training_course_list: this.apiUrl + 'training-course-list/',
		course_details_publicForm: this.apiUrl + 'public-course-event-details-show/',
		publicTrainingForm: 'training_request_form/',
		noc_submit_form : 'noc_form',
		event_list : 'event-list',
		// webservice/training_request_form/
	}
	//course_details: this.apiUrl + 'course-details/',
	public unhandledExceptionError: string 							=  "Unhandled Exception. Please Try Again Or Contact Support."
	public loggedIn													=	new Subject<any>();
	public logType: string 											=	'';

	//Message Dialog
	public generalFormValidationError: string						=	'Please enter required fields properly!';
	public emailValidationError: string								=	'Please enter valid email';
	public messageTimeout: number									=	3000;
	public errorDialogHeader: string								=	'Validation Error';
	public successDialogHeader: string								=	'Success';
	public errMessageDialogHeader: string							=	'Error';

	public addSuccessMessage: string								=	'Record Added Successfully';
	public updateSuccessMessage: string								=	'Record Modified Successfully';
	public deleteSuccessMessage: string								=	'Record Deleted Successfully';
	public deleteConfirmText: string								=	'Are you sure to delete?';
	public deleteConfirmDialogHeader: string						=	'Delete Confirmation';
	public rejectConfirmDialogHeader: string						=	'Reject Message';
	public dialogOKButtonText: string								=	'OK';	
	public dialogSubmitButtonText: string							=	'SUBMIT';	
	public dialogCancelButtonText: string							=	'CANCEL';

	//Flash message type
	public flashMessageTypeSuccess: string							=	'alert-success';
	public flashMessageTypeError: string							=	'alert-errors';
	public flashMessageTypeWarning: string							=	'alert-warning';
	public flashMessageTypeInfo: string								=	'alert-info';

	
	dashBoardMenu: any[]		= [
		{
			type: 'cab_client',
			menu: [
				{
					heading: 'Profile', link: '#', sub: true,
					submenu: [
						{title: 'Profile', link: '/profile-completion'},
						{title: 'Certification', link: '#'},
						{title: 'Agreements', link: '#'},
						{title: 'Records', link: '#'},
						{title: 'My Files', link: '#'}
					]
				},
				{
					heading: 'Messages', link: '#',
					submenu: []
				},
				// {
				// 	heading: 'Application', link: '#', sub: true,
				// 	submenu: [
				// 		{title: 'Accreditation', link: '#'},
				// 		{title: 'Registration', link: '#'},
				// 		{title: 'Training', link: '/dashboard/cab_client/training-course'}
				// 	]
				// },
				{
					heading: 'Status', link: '#', sub: true,
					submenu: []
				},
				{
					heading: 'Events', link: '#', sub: true,
					submenu: [],
				},
				{
					heading: 'Application', link: '#', sub: true,
					submenu: [
						{title: 'Accreditation', link: '/dashboard/cab_client/application-accreditation'},
						{title: 'Registration', link: '/dashboard/cab_client/application-registration'},
						//{title: 'Training Service', link: '#'},
						//{title: 'Training Apply', link: '/dashboard/cab_client/training-apply'},
						{title: 'Training', link: '/dashboard/cab_client/training-course'}
					]
				},
				{
					heading: 'Status', link: '#', sub: true,
					submenu: [
						{title: 'Application Listing', link: '#'},
						{title: 'Vouchers', link: '#'},
					]
				},
				{
					heading: 'Schedule', link: '#', sub: true,
					submenu: []
				},				
				{
					heading: 'Documents', link: '#',
					submenu: []
				},								
				{
					heading: 'Accounts', link: '#', sub: true,
					submenu: []
				}
			]
		},
		{
			type: 'candidate',
			menu: [
				{
					heading: 'Profile', link: '#', sub: true,
					submenu: [
						{title: 'Update Profile', link: '/profile-completion'},
						{title: 'Qualification', link: '#'},
						{title: 'Expertise', link: '#'},
						{title: 'Agreements', link: '#'},
						{title: 'Certificates', link: '#'},
						{title: 'My Files', link: '#'}
					]
				},
				{
					heading: 'Services', link: '#', sub: true,
					submenu: [
						{title: 'Training', link: '/dashboard/candidate/training-course'}
					]
				},
				{
					heading: 'Events', link: '#', sub: true,
					submenu: [
						{title: 'Event List', link: '#'},
						{title: 'Agenda', link: '/dashboard/candidate/agenda-list'},
						{title: 'Attendance', link: '/dashboard/candidate/attendane-list'},
						{title: 'Tests', link: '#'},
						{title: 'Surveys', link: '#'},
						{title: 'History', link: '#'}
					]
				},
				{
					heading: 'Schedule', link: '#',
					submenu: []
				},
				{
					heading: 'Status', link: '#', sub: true,
					submenu: [
						{title: 'Applications', link: '#'},
						{title: 'Vouchers', link: '#'},
					]
				},				
				{
					heading: 'Documents', link: '#',
					submenu: []
				},
				{
					heading: 'Billing & Accounts', link: '#', sub: true,
					submenu: [
						{title: 'Applications', link: '#'},
						{title: 'SOA', link: '#'},
					]
				},
				{
					heading: 'Messages', link: '#',
					submenu: []
				},
			]
		},
		{
			type: 'assessors',
			menu: [
				{
					heading: 'Profile', link: '#', sub: true,
					submenu: [
						{title: 'Update Profile', link: '/profile-completion'},
						{title: 'Qualifications', link: '#'},
						{title: 'Expertise', link: '#'},
						{title: 'Agreements', link: '#'},
						{title: 'My Files', link: '#'}
					]
				},				
				{
					heading: 'Schedule', link: '#', sub: true,
					submenu: [
						{title: 'Create Schedule', link: '#'},
						{title: 'View Schedule', link: '#'},
					]
				},				
				{
					heading: 'Documents', link: '#',
					submenu: []
				},				
				{
					heading: 'Messages', link: '#',
					submenu: []
				},
			]
		},
		{
			type: 'operations',
			menu: [
				{
					heading: 'Update Profile', link: '/profile-completion',
					submenu: []
				},
				{
					heading: 'Portal Onboarding', link: '#',
					submenu: []
				},
				{
					heading: 'Directory', link: '#',
					submenu: []
				},				
				{
					heading: 'Applications', link: '#', sub: true,
					submenu: [
						{title: 'Accreditation Service', link: '/dashboard/operations/accreditation-service-list'},
						{title: 'Registration Service', link: '#'},
						{title: 'Training Service', link: ''},
					]
				},
				{
					heading: 'Assessors', link: '#', sub: true,
					submenu: [
						{title: 'Assessors List', link: '#'},
						{title: 'Schedule', link: '#'},
					]
				},	
				{
					heading: 'Training Events', link: '#',
					submenu: []
				},			
				{
					heading: 'Documents', link: '#',
					submenu: []
				},
				{
					heading: 'Service Card', link: '#',
					submenu: []
				},
				{
					heading: 'Billing & Accounts', link: '#',
					submenu: []
				},				
				{
					heading: 'Messages', link: '#',
					submenu: []
				},
			]
		},
		{
			type: 'trainers',
			menu: [
				{
					heading: 'Profile', link: '#', sub: true,
					submenu: [
						{title: 'Update Profile', link: '/profile-completion'},
						{title: 'Qualifications', link: '/dashboard/trainers/qualifications'},
						{title: 'Expertise', link: '/dashboard/trainers/expertise'},
						{title: 'Agreements', link: '/dashboard/trainers/agreements'},
						{title: 'My Files', link: '/dashboard/trainers/my-files'},
						//{title: 'Training Apply', link: '/dashboard/trainers/training-apply'},
						//{title: 'Training Service', link: '/dashboard/trainers/training-service'}
					]
				},
				{
					heading: 'Events', link: '#', sub: true,
					submenu: [
						{title: 'Event List', link: '/dashboard/trainers/event-list'},
						{title: 'Agenda', link: '/dashboard/trainers/agenda-list'},
						{title: 'Attendance', link: '/dashboard/trainers/attendane-list'},
						{title: 'Tests', link: '#'},
						{title: 'Surveys', link: '#'},
						{title: 'History', link: '#'}
					]
				},				
				{
					heading: 'Schedule', link: '#', sub: true,
					submenu: [
						{title: 'Create Schedule', link: '#'},
						{title: 'View Schedule', link: '#'},
					]
				},				
				{
					heading: 'Documents', link: '#',
					submenu: []
				},				
				{
					heading: 'Messages', link: '#',
					submenu: []
				},
			]
		},
	];
	///dashboard/operations/training-service
	dashBoardUserType: any[]		= [
		{name: 'cab'},{name: 'assessors'}, {name: 'candidate'},
		{name: 'eiac_staff'}, {name: 'trainers'}
	];

}

