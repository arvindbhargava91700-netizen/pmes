<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ProjectProgressUpdate;
use App\Models\ProjectProgressPhoto;

class ProjectPhysicalController extends Controller
{

    // Dashboard cards
public function physical()
{
    // Dashboard stats
    $avgProgress = Project::avg('actual_progress');

    $ahead = Project::whereColumn('actual_progress','>','planned_progress')->count();

    $behind = Project::whereColumn('actual_progress','<','planned_progress')->count();

    $photos = ProjectProgressPhoto::count();

    $stats = [
        'avg_progress' => round($avgProgress),
        'ahead_schedule' => $ahead,
        'behind_schedule' => $behind,
        'total_photos' => $photos
    ];

    // Project list with milestone & photos
    $projects = Project::with([
            'milestones:id,project_id,stage_name,actual_percentage',
            'photos:id,project_id,photo_path'
        ])
        ->withCount('photos')
        ->select(
            'id',
            'project_code',
            'project_name',
            'zone',
            'planned_progress',
            'actual_progress'
        )
        ->orderBy('id','desc')
        ->get();

    return response()->json([
        'status' => true,
        'list' => [
            'stats' => $stats,
            'projects' => $projects
        ]
    ]);
}

    // Project list with progress
    public function projects()
    {

        $projects = Project::withCount('photos')
            ->select(
                'id',
                'project_code',
                'project_name',
                'planned_progress',
                'actual_progress',
                'zone'
            )
            ->get();

        return response()->json([
            'status'=>true,
            'data'=>$projects
        ]);

    }

    // Stage wise progress
    public function stageProgress($project_id)
    {

        $stages = ProjectMilestone::where('project_id',$project_id)
                    ->select('stage_name','actual_percentage')
                    ->get();

        return response()->json([
            'status'=>true,
            'data'=>$stages
        ]);

    }

    // Update milestone progress
    public function updateProgress(Request $request)
    {

        $request->validate([
            'project_id'=>'required',
            'milestone_id'=>'required',
            'progress_percentage'=>'required'
        ]);

        $update = ProjectProgressUpdate::create([

            'project_id'=>$request->project_id,
            'milestone_id'=>$request->milestone_id,
            'progress_percentage'=>$request->progress_percentage,
            'updated_by'=>auth()->id(),
            'progress_date'=>now()

        ]);

        // update milestone
        ProjectMilestone::where('id',$request->milestone_id)
            ->update([
                'actual_percentage'=>$request->progress_percentage
            ]);

        return response()->json([
            'status'=>true,
            'message'=>'Progress updated'
        ]);

    }

    // Upload progress photo
    public function uploadPhoto(Request $request)
    {

        $request->validate([
            'project_id'=>'required',
            'photo'=>'required|image'
        ]);

        $path = $request->file('photo')->store('progress','public');

        $photo = ProjectProgressPhoto::create([

            'project_id'=>$request->project_id,
            'milestone_id'=>$request->milestone_id,
            'photo_path'=>$path,
            'uploaded_by'=>auth()->id()

        ]);

        return response()->json([
            'status'=>true,
            'message'=>'Photo uploaded',
            'data'=>$photo
        ]);

    }

}