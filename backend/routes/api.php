<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\facebook;

use App\Http\Controllers\TaskmanagementController;

use App\Http\Controllers\AppController;

use App\Http\Controllers\AppController2;

use App\Http\Controllers\auditFormsController;

use App\Http\Controllers\AuditController; 

use App\Http\Controllers\CustomerFiberController;

use App\Http\Controllers\AuditorsController;

use App\Http\Controllers\RowController;

use App\Http\Controllers\OTDRController;

use App\Http\Controllers\ProjectMonitoringController;

use App\Http\Controllers\SuperAdminUserManagementController;

use App\Http\Controllers\SuperAdminFeatureConfigController;

use App\Http\Controllers\JourneyPlanController;

use App\Http\Controllers\CustomerFieldsController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/reactTest', [facebook::class, 'test']);

Route::post('/snagDashboardInit', [facebook::class, 'snagDashboardInit']);

Route::post('/auditDashboardInit', [facebook::class, 'auditDashboardInit']);

Route::post('/inspectionDashboardInit', [facebook::class, 'inspectionDashboardInit']);

Route::post('/inspectionDashboardInitGetTracksCity', [facebook::class, 'inspectionDashboardInitGetTracksCity']);

Route::post('/inspectionDashboardInitGetTracksMultipleCity', [facebook::class, 'inspectionDashboardInitGetTracksMultipleCity']);

Route::post('/snagReportingInit', [facebook::class, 'snagReportingInit']);

Route::post('/snagReportingGetSnags', [facebook::class, 'snagReportingGetSnags']);

Route::post('/snagReportingGetRectifiedImages', [facebook::class, 'snagReportingGetRectifiedImages']);

Route::post('/snagReportingGetMembers', [facebook::class, 'snagReportingGetMembers']);

Route::post('/projectDashboardInit', [facebook::class, 'projectDashboardInit']);

Route::post('/risksInit', [facebook::class, 'risksInit']);

Route::post('/issuesInit', [facebook::class, 'issuesInit']);

Route::post('/login', [facebook::class, 'login']);

Route::post('/register', [facebook::class, 'register']);

Route::post('/refresh/token', [facebook::class, 'token_exchange']);

Route::post('/dummy_test', [facebook::class, 'dummy_test']);

Route::post('/markerClicked', [facebook::class, 'markerClicked']);

Route::post('/overviewDashboardInit', [facebook::class, 'overviewDashboardInit']);

Route::post('/getTimeNow', [facebook::class, 'getTimeNow']);

Route::post('/getPlannedSites', [facebook::class, 'getPlannedSites']);

Route::post('/getPotentialSites', [facebook::class, 'getPotentialSites']);

Route::post('/getOtdrResults', [facebook::class, 'getOtdrResults']);

Route::post('/getFiberCity', [facebook::class, 'getFiberCity']);

/* sendMail */
Route::get('/sendMail', [facebook::class, 'sendMail']);
Route::get('/sendMail2', [facebook::class, 'sendMail2']);
/* sendMail */

/* Password Reset Route */
Route::post('enterVerificationCode', [facebook::class, 'enterVerificationCode']);

Route::post('verifyVerificationCode', [facebook::class, 'verifyVerificationCode']);

Route::post('resetPassword', [facebook::class, 'resetPassword']);
/* Password Reset Route */

/*credentials reset*/

Route::post('/resetCredentialsInit', [facebook::class, 'resetCredentialsInit']);

Route::post('/resetCredentials', [facebook::class, 'resetCredentials']);

/*credential reset*/

/*checker seperate */
Route::post('/checkerSeperate' , [facebook::class, 'checkerSeperate']);
/*checker seperate */

/* Task Management Routes */
Route::post('/getMembers', [TaskmanagementController:: class, 'getMembers']);
Route::post('/addMember', [TaskmanagementController:: class, 'addMember']);
Route::post('/addFunction', [TaskmanagementController:: class, 'addFunction']);

Route::post('/getTasks', [TaskmanagementController:: class, 'getTasks']);
Route::post('/addTask', [TaskmanagementController:: class, 'addTasks']);
Route::post('/assignMembers', [TaskmanagementController:: class, 'assignMembers']);

Route::post('/createTaskSnag', [TaskmanagementController:: class, 'createTaskSnag']);

Route::post('/getSnags', [TaskmanagementController:: class, 'getSnags']);

Route::post('/taskDelete', [TaskmanagementController:: class, 'taskDelete']);

Route::post('/memberDelete', [TaskmanagementController:: class, 'memberDelete']);
/* Task Management Routes */

/* Task App Routes */

Route::post('/appLogin', [AppController:: class, 'appLogin']);

Route::post('/getTasksApp', [AppController:: class, 'getTasksApp']);

Route::post('/getSingleTaskApp', [AppController:: class, 'getSingleTaskApp']);

Route::post('/getSnagsApp', [AppController:: class, 'getSnagsApp']);

Route::post('/taskImagesApp', [AppController:: class, 'taskImagesApp']);

Route::post('/taskCompleteApp', [AppController:: class, 'taskCompleteApp']);

Route::post('/taskAcceptanceStatusApp', [AppController:: class, 'taskAcceptanceStatusApp']);

/* Task App Routes */


/* Audit Form Routes */

Route::post('/auditInit', [auditFormsController::class, 'init']);

/* Audit Form Routes */

/* Audit App Routes */
Route::post('/auditlogin', [AuditController::class, 'auditlogin']);
Route::get('/getauditfields',[AuditController::class,'getauditfields']);
Route::post('/getauditsites',[AuditController::class,'getauditsites']);
Route::post('/uploadauditform',[AuditController::class,'uploadauditform']);
Route::post('/uploadauditmedia',[AuditController::class,'uploadauditmedia']);
Route::post('/auditsnags',[AuditController::class,'auditsnags']);
Route::post('/uploadsnagmedia',[AuditController::class,'uploadsnagmedia']);
Route::post('/uploadsnagform',[AuditController::class,'uploadsnagform']);

Route::get('/auditsnagsget',[AuditController::class,'auditsnagsget']);
Route::get('/visitrevisit',[AuditController::class,'visitrevisit']);
Route::post('/auditdatapopulation',[AuditController::class,'auditdatapopulation']);
Route::get('/getaudittracks',[AuditController::class,'getaudittracks']);
/* Audit App Routes */


/* Fiber App Routes */
Route::post('/fiberlogin', [CustomerFiberController::class, 'fiberlogin']);
Route::post('/trackdata', [CustomerFiberController::class, 'trackdata']);
Route::post('/fiber/trackmedia', [CustomerFiberController::class, 'trackmedia']);
Route::post('/customer/fiber', [CustomerFiberController::class, 'fiber']);
Route::post('/customer/fiber/delete', [CustomerFiberController::class, 'fiberdelete']);
/* Fiber App Routes */


/* Create Auditor */
Route::post('/addAuditor', [AuditorsController::class, 'addAuditor']);
/* Create Auditor */

/* OTDR Routes */

Route::post('/addOtdr', [OTDRController::class, 'addOtdr']);

Route::post('/otdrInit', [OTDRController::class, 'otdrInit']);

Route::post('/otdrUploadFile', [OTDRController::class, 'otdrUploadFile']);

Route::post('/otdrDeleteFile', [OTDRController::class, 'otdrDeleteFile']);

Route::post('/otdrDeleteEntry', [OTDRController::class, 'otdrDeleteEntry']);

/* OTDR Routes */

/* ROW Routes */

Route::post('/rowInit', [RowController::class, 'rowInit']);

Route::post('/getTracks', [RowController::class, 'getTracks']);

Route::post('/addRowStatus', [RowController::class, 'addRowStatus']);

Route::post('/updateRowStatus', [RowController::class, 'uptateRowStatus']);

Route::post('/getRowDetail', [RowController::class, 'getRowDetail']);

/* ROW Routes */

/* Project Monitoring Controller */

Route::post('/getFieldsAndTable', [ProjectMonitoringController::class, 'getFieldsAndTable']);

Route::post('/formInsert', [ProjectMonitoringController::class, 'formInsert']);

Route::post('/formUpdate', [ProjectMonitoringController::class, 'formUpdate']);

Route::post('/deleteEntry', [ProjectMonitoringController::class, 'deleteEntry']);

Route::post('/getTables', [ProjectMonitoringController::class, 'getTables']);

Route::post('/addTable', [ProjectMonitoringController::class, 'addTable']);

Route::post('/addField', [ProjectMonitoringController::class, 'addField']);

Route::post('/deleteField', [ProjectMonitoringController::class, 'deleteField']);

Route::post('/init', [ProjectMonitoringController::class, 'init']);

/* Project Monitoring Controller */

/* Super Admin User Management Controller */
Route::post('/SAuserManagementInit', [SuperAdminUserManagementController::class, 'SAuserManagementInit']);

Route::post('/SAuserManagementEnterOrganization', [SuperAdminUserManagementController::class, 'SAuserManagementEnterOrganization']);

Route::post('/SAuserManagementEnterRole', [SuperAdminUserManagementController::class, 'SAuserManagementEnterRole']);

Route::post('/SAuserManagementGetRolesPermission', [SuperAdminUserManagementController::class, 'SAuserManagementGetRolesPermission']);

Route::post('/SAuserManagementUserUpdate', [SuperAdminUserManagementController::class, 'SAuserManagementUserUpdate']);

Route::post('/SAuserManagementDelete', [SuperAdminUserManagementController::class, 'SAuserManagementDelete']);
/* Super Admin User Management Controller */

/* Super Admin Feature Config Controller */

Route::post('/SAFeatureConfigInit', [SuperAdminFeatureConfigController::class, 'SAFeatureConfigInit']);

Route::post('/SAFeatureConfigAssign', [SuperAdminFeatureConfigController::class, 'SAFeatureConfigAssign']);

Route::post('/SAFeatureConfigDelete', [SuperAdminFeatureConfigController::class, 'SAFeatureConfigDelete']);

/* Super Admin Featur Config Controller */

/* Journey Plan Routes */
Route::post('/journeyPlanInit', [JourneyPlanController::class, 'journeyPlanInit']);

Route::post('/journeyPlanInsert', [JourneyPlanController::class, 'journeyPlanInsert']);
/* Journey Plan Routes */

/*Customer Fields Routes */
Route::post('/getFields', [CustomerFieldsController::class, 'getFields']);
/*Customer Fields Routes */

/*daily charts*/
Route::post('/fetchDailyCharts', [facebook::class, 'fetchDailyCharts']);
/*daily charts*/

/*Markers Entry Temporary Routes */
//Route::post('/enterMarkers', [facebook::class, 'enterMarkers']);
/*Markers Entry Temporary Routes */

/*Cables Entry Temporary Routes */
//Route::post('/enterCables', [facebook::class, 'enterCables']);
/*Cables Entry Temporary Routes */

/* AppController2 Routes */

Route::post('/appLogin2', [AppController2:: class, 'appLogin2']);

Route::post('/appGetMarkers', [AppController2:: class, 'appGetMarkers']);

Route::post('/appGetCables', [AppController2::class, 'appGetCables']);

/* AppController2 Routes */



/* test Notification */
Route::get('/testNotification' , [facebook::class, 'testNotification']);
/* test Notification */