<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BillingController;
use App\Http\Controllers\API\BillingStatusController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\ContractorController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\EotRequestController;
use App\Http\Controllers\API\EotStatusController;
use App\Http\Controllers\API\GrievanceController;
use App\Http\Controllers\API\GrievancePriorityController;
use App\Http\Controllers\API\GrievanceStatusController;
use App\Http\Controllers\API\IntegrationController;
use App\Http\Controllers\API\MilestoneController;
use App\Http\Controllers\API\ProjectFinancialController;
use App\Http\Controllers\API\ProjectPhysicalController;
use App\Http\Controllers\API\ProjectProgressController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\WardController;
use App\Http\Controllers\API\WorkClassifactionController;
use App\Http\Controllers\API\WorkTypeController;
use App\Http\Controllers\API\ZoneController;
use App\Http\Controllers\API\TenderStatusController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\TenderController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ProjectStatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/sk', function () {
//     echo "ee";
// });
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum']]);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::get('/roles', [AuthController::class, 'roleList']);
    Route::get('/captcha', [AuthController::class, 'generateCaptcha']);
    Route::get('/refresh/captcha', [AuthController::class, 'refreshCaptcha']);
    Route::post('/login/password', [AuthController::class, 'passwordLogin'])->middleware('throttle:5,1');
    Route::post('/login/otp/send', [AuthController::class, 'sendOtp']);
    Route::post('/login/otp/verify', [AuthController::class, 'verifyOtp']);
    Route::post('/login/dsc', [AuthController::class, 'dscLogin']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'dashboard']);
    // master Route Here
    Route::prefix('master')->group(function () {
        Route::apiResource('departments', DepartmentController::class);
        Route::apiResource('wards', WardController::class);
        Route::apiResource('work-classifications', WorkClassifactionController::class);
        Route::apiResource('contractors', ContractorController::class);
        Route::apiResource('work-types', WorkTypeController::class);
        Route::apiResource('zones', ZoneController::class);
        Route::apiResource('tender_status', TenderStatusController::class);
        Route::apiResource('permission', PermissionController::class);
        Route::apiResource('role', RoleController::class);
        Route::get('role-create-data', [RoleController::class, 'createPage']);

        ######################################## Arvind ########################################
        Route::get('tenders/schedule/{status?}', [TenderStatusController::class, 'tenderList']);
        Route::apiResource('projects', ProjectController::class);
            Route::get('allprojects/{status?}', [ProjectController::class, 'allprojects']);
        Route::apiResource('project_status', ProjectStatusController::class);
        Route::get('projects_map/{status?}', [ProjectController::class, 'mapList']);
        Route::apiResource('eot_requests', EotRequestController::class);
        Route::apiResource('eot_status', EotStatusController::class);
        Route::post('eot_request_approval', [EotRequestController::class, 'eot_request_approval']);
        Route::apiResource('billings', BillingController::class);
        Route::apiResource('billing_status', BillingStatusController::class);
        Route::apiResource('milestones', MilestoneController::class);
        Route::apiResource('grievances', GrievanceController::class);
        Route::apiResource('grievance_status', GrievanceStatusController::class);
        Route::apiResource('grievance_priorities', GrievancePriorityController::class);

          Route::get('integration', [IntegrationController::class, 'index']);

        ################################## Chat #########################
        Route::get('/messages/{id}', [ChatController::class,'messages']);
        Route::post('/send-message', [ChatController::class,'sendMessage']);

    });

    Route::prefix('progress')->group(function () {
        ############################# physical ######################################
    Route::get('physical', [ProjectPhysicalController::class,'physical']);

    
    // Route::get('projects', [ProjectProgressController::class,'projects']);
    // Route::get('stage-progress/{project_id}', [ProjectProgressController::class,'stageProgress']);
    // Route::post('update-progress', [ProjectProgressController::class,'updateProgress']);
    // Route::post('upload-photo', [ProjectProgressController::class,'uploadPhoto']);

    ############################# Financial ######################################
    Route::get('financial', [ProjectFinancialController::class,'financial']);


});
    Route::apiResource('users', UserController::class);
    Route::get('/users/role/{role}', [UserController::class, 'getUsersByRole']);
    Route::apiResource('/tender', TenderController::class);
    Route::get('/tenders/counts', [TenderController::class, 'tenderCounts']);
});

//table  project,project_loaction,project_assigned_officers
