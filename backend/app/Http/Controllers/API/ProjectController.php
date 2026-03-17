<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectAssignedOfficer;
use App\Models\ProjectLocation;
use App\Models\ProjectStatusMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
class ProjectController extends Controller
{

    public function index(Request $request)
    {
        $query = Project::select(
            'id',
            'project_code',
            'project_name',
            'project_description',
            'department_id',
            'work_classification_id',
            'contractor_id',
            'start_date',
            'end_date',
            'total_budget',
            'planned_progress',
            'actual_progress',
            'created_at'
        )->with(['department:id,name,status',
        'work_classification:id,name,status',
        'contractor:id,company_name,contractor_name',
        'location',
        'officers']);

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->project_status_id) {
            $query->where('project_status_id', $request->project_status_id);
        }
        $projects = $query->latest()->paginate(10);

        // $projects = $query->latest()->paginate(10);

        $projects->getCollection()->transform(function ($project) {

            $totalBilling = $project->billings->sum('amount');

            $financialPercent = 0;
            if ($project->total_budget > 0) {
                $financialPercent = ($totalBilling / $project->total_budget) * 100;
            }

            return [
                'id' => $project->id,
                'project_code' => $project->project_code,
                'project_name' => $project->project_name,
                'department' => $project->department,
                'contractor' => $project->contractor,
                'location' => $project->location,
                'budget' => $project->total_budget,
                'physical_percent' => round($project->actual_progress, 2),
                'financial_percent' => round($financialPercent, 2),
                'start_date' => $project->start_date,
                'end_date' => $project->end_date
            ];
        });
        return response()->json([
            'status' => true,
            'data' => $projects
        ]);
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tender_id' => 'required|exists:tenders,id',
            'project_name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'work_classification_id' => 'required|exists:work_classifactions,id',
            'contractor_id' => 'required|exists:contractors,id',
            'project_description' => 'required|string',
            'project_status_id' => 'required|integer',
            'total_budget' => 'required',

            'zone_id' => 'required|exists:zones,id',
            'ward_id' => 'required|exists:wards,id',
            'latitude' => 'required|string|max:50',
            'longitude' => 'required|string|max:50',
            'site_address' => 'required|string|max:500',

            'je_id' => 'required|exists:users,id',
            'ae_id' => 'required|exists:users,id',
            'ee_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {

            $project = Project::create([
                'project_code' => Project::generateProjectCode(),
                'project_name' => $request->project_name,
                'tender_id' => $request->tender_id,
                'department_id' => $request->department_id,
                'work_classification_id' => $request->work_classification_id,
                'contractor_id' => $request->contractor_id,
                'project_description' => $request->project_description,
                'project_status_id' => $request->project_status_id,
                'total_budget' => $request->total_budget,
            ]);

            ProjectLocation::create([
                'project_id' => $project->id,
                'zone_id' => $request->zone_id,
                'ward_id' => $request->ward_id,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'site_address' => $request->site_address
            ]);

            ProjectAssignedOfficer::create([
                'project_id' => $project->id,
                'je_id' => $request->je_id,
                'ae_id' => $request->ae_id,
                'ee_id' => $request->ee_id
            ]);

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Project created successfully',
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Project creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {

        $project = Project::with(['status','department','location', 'officers'])->find($id);

        if (!$project) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $project
        ]);
    }


    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'tender_id' => 'required|exists:tenders,id',
            'project_name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'work_classification_id' => 'required|exists:work_classifactions,id',
            'contractor_id' => 'required|exists:contractors,id',
            'project_description' => 'required|string',
            'total_budget' => 'required',

            'zone_id' => 'required|exists:zones,id',
            'ward_id' => 'required|exists:wards,id',
            'latitude' => 'required|string|max:50',
            'longitude' => 'required|string|max:50',
            'site_address' => 'required|string|max:500',

            'je_id' => 'required|exists:users,id',
            'ae_id' => 'required|exists:users,id',
            'ee_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $project = Project::findOrFail($id);

        $project->update($request->only([
            'tender_id',
            'project_name',
            'department_id',
            'work_classification_id',
            'contractor_id',
            'project_description',
            'total_budget'
        ]));

        $project->location()->update([
            'zone_id' => $request->zone_id,
            'ward_id' => $request->ward_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'site_address' => $request->site_address
        ]);

        $project->officers()->update([
            'je_id' => $request->je_id,
            'ae_id' => $request->ae_id,
            'ee_id' => $request->ee_id
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Project updated successfully'
        ]);
    }


    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $project->delete();

        return response()->json([
            'status' => true,
            'message' => 'Project deleted successfully'
        ], 200);
    }





    public function mapList($status = null)
    {
        try {
            if ($status) {
                $statusData = ProjectStatusMaster::where('name', $status)->first();
                if (!$statusData) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Invalid status'
                    ], 404);
                }
                $tenders = Project::with(['status','department','location', 'officers'])->where('project_status_id', $statusData->id)
                    ->latest()
                    ->take(5)
                    ->get();
            } else {
                $tenders = Project::with(['status','department','location', 'officers'])->latest()
                    ->take(5)
                    ->get();
            }
            return response()->json([
                'status' => true,
                'message' => 'Project list fetched successfully',
                'data' => $tenders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch Project',
                'error' => $e->getMessage()
            ], 500);

        }
    }


    public function allprojects($status = null)
    {
        try {
            if ($status) {
                $statusData = ProjectStatusMaster::where('name', $status)->first();
                if (!$statusData) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Invalid status'
                    ], 404);
                }
                $tenders = Project::with(['status','department','location', 'officers'])->where('project_status_id', $statusData->id)
                    ->latest()
                    ->take(5)
                    ->get();
            } else {
                $tenders = Project::with(['status','department','location', 'officers'])->latest()
                    ->take(5)
                    ->get();
            }
            return response()->json([
                'status' => true,
                'message' => 'Project list fetched successfully',
                'data' => $tenders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch Project',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    

}
